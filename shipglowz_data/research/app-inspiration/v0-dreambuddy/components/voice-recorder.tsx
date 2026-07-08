"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Square, Send, X, Loader2, AlertCircle, Globe, RotateCw, Edit2, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useSettings } from "@/contexts/settings-context"
import { getLanguageNameByCode } from "@/lib/languages"
import { isConfidentLanguageDetection, findBestMatchingLanguage } from "@/lib/language-detection"
import type { SpeechRecognition, SpeechRecognitionEvent } from "@/types/speech-recognition"

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, transcription: string, detectedLanguage: string) => void
  onCancel: () => void
}

export function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
  const { transcriptionEnabled, transcriptionLanguage, autoDetectLanguage } = useSettings()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(5))
  const [transcription, setTranscription] = useState("")
  const [interimTranscription, setInterimTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionSupported, setTranscriptionSupported] = useState(true)
  const [languageDetectionError, setLanguageDetectionError] = useState(false)
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null)
  const [isDetectingLanguage, setIsDetectingLanguage] = useState(false)
  const [currentRecognitionLanguage, setCurrentRecognitionLanguage] = useState(transcriptionLanguage)
  const [isEditingTranscription, setIsEditingTranscription] = useState(false)
  const [editedTranscription, setEditedTranscription] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const autoDetectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Initialize speech recognition
  const initSpeechRecognition = (lang: string = currentRecognitionLanguage) => {
    // Skip if transcription is disabled in settings
    if (!transcriptionEnabled) {
      return null
    }

    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setTranscriptionSupported(false)
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      if (finalTranscript) {
        setTranscription((prev) => prev + " " + finalTranscript)
      }

      setInterimTranscription(interimTranscript)
      setLanguageDetectionError(false)

      // If we're in auto-detect mode and haven't detected a language yet,
      // check if we can determine the language from the results
      if (autoDetectLanguage && isDetectingLanguage) {
        const { isConfident, detectedLanguage: langCode } = isConfidentLanguageDetection(event.results)

        if (isConfident) {
          // We've detected a language with confidence
          if (langCode) {
            const bestMatch = findBestMatchingLanguage(langCode)
            setDetectedLanguage(bestMatch.code)
            setCurrentRecognitionLanguage(bestMatch.code)

            // Restart recognition with the detected language
            restartRecognitionWithLanguage(bestMatch.code)
          }

          setIsDetectingLanguage(false)

          // Clear the auto-detect timeout since we've detected a language
          if (autoDetectTimeoutRef.current) {
            clearTimeout(autoDetectTimeoutRef.current)
            autoDetectTimeoutRef.current = null
          }
        }
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event)

      // Check if the error is related to language detection
      if (event.error === "language-not-supported" || event.error === "not-allowed") {
        setLanguageDetectionError(true)
      }

      setIsTranscribing(false)
    }

    recognition.onend = () => {
      setIsTranscribing(false)
    }

    return recognition
  }

  // Function to restart recognition with a new language
  const restartRecognitionWithLanguage = (language: string) => {
    // Stop the current recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    // Start a new recognition with the detected language
    const newRecognition = initSpeechRecognition(language)
    if (newRecognition) {
      recognitionRef.current = newRecognition
      newRecognition.start()
      setIsTranscribing(true)
    }
  }

  // Start auto-detection process
  const startAutoDetection = () => {
    setIsDetectingLanguage(true)
    setDetectedLanguage(null)

    // Set a timeout to fallback to the default language if detection takes too long
    autoDetectTimeoutRef.current = setTimeout(() => {
      if (isDetectingLanguage) {
        setIsDetectingLanguage(false)
        setDetectedLanguage(transcriptionLanguage)
        restartRecognitionWithLanguage(transcriptionLanguage)
      }
    }, 5000) // 5 seconds timeout for language detection
  }

  // Start recording
  const startRecording = async () => {
    try {
      setIsProcessing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Set up audio context for visualization
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      analyser.fftSize = 256

      const source = audioContext.createMediaStreamSource(stream)
      sourceRef.current = source
      source.connect(analyser)

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      dataArrayRef.current = dataArray

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)

        // Clean up stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        // Stop speech recognition
        if (recognitionRef.current) {
          recognitionRef.current.stop()
        }

        // Clear auto-detect timeout
        if (autoDetectTimeoutRef.current) {
          clearTimeout(autoDetectTimeoutRef.current)
          autoDetectTimeoutRef.current = null
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      setIsProcessing(false)

      // Reset transcription
      setTranscription("")
      setInterimTranscription("")
      setLanguageDetectionError(false)

      // Start speech recognition if supported and enabled
      if (transcriptionEnabled && transcriptionSupported) {
        // If auto-detect is enabled, start with auto-detection
        if (autoDetectLanguage) {
          setCurrentRecognitionLanguage("") // Clear current language during detection
          startAutoDetection()

          // Start with a multi-language recognition instance
          const recognition = initSpeechRecognition("en-US") // Start with English as a base
          if (recognition) {
            recognitionRef.current = recognition
            recognition.start()
            setIsTranscribing(true)
          }
        } else {
          // Use the manually selected language
          setCurrentRecognitionLanguage(transcriptionLanguage)
          setDetectedLanguage(null)

          const recognition = initSpeechRecognition(transcriptionLanguage)
          if (recognition) {
            recognitionRef.current = recognition
            recognition.start()
            setIsTranscribing(true)
          }
        }
      }

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      // Start visualizer
      updateVisualizer()
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setPermissionDenied(true)
      setIsProcessing(false)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop visualizer
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }

      // Clean up audio context
      if (audioContextRef.current) {
        if (sourceRef.current) {
          sourceRef.current.disconnect()
        }
        audioContextRef.current.close()
      }

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      // Clear auto-detect timeout
      if (autoDetectTimeoutRef.current) {
        clearTimeout(autoDetectTimeoutRef.current)
        autoDetectTimeoutRef.current = null
      }
    }
  }

  // Update visualizer
  const updateVisualizer = () => {
    if (!analyserRef.current || !dataArrayRef.current) return

    animationFrameRef.current = requestAnimationFrame(updateVisualizer)
    analyserRef.current.getByteFrequencyData(dataArrayRef.current)

    // Calculate visualization values
    const values = Array(20).fill(0)
    const segmentLength = Math.floor(dataArrayRef.current.length / 20)

    for (let i = 0; i < 20; i++) {
      let sum = 0
      for (let j = 0; j < segmentLength; j++) {
        sum += dataArrayRef.current[i * segmentLength + j]
      }
      // Scale values between 5 and 50
      values[i] = 5 + (sum / segmentLength) * 0.45
    }

    setVisualizerValues(values)
  }

  // Clear transcription
  const clearTranscription = () => {
    setTranscription("")
    setInterimTranscription("")
    setEditedTranscription("")
  }

  // Start editing transcription
  const startEditingTranscription = () => {
    setEditedTranscription(transcription.trim())
    setIsEditingTranscription(true)

    // Focus the textarea after it's rendered
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        // Place cursor at the end
        textareaRef.current.selectionStart = textareaRef.current.value.length
        textareaRef.current.selectionEnd = textareaRef.current.value.length
      }
    }, 50)
  }

  // Save edited transcription
  const saveEditedTranscription = () => {
    setTranscription(editedTranscription)
    setIsEditingTranscription(false)
  }

  // Cancel editing transcription
  const cancelEditingTranscription = () => {
    setEditedTranscription("")
    setIsEditingTranscription(false)
  }

  // Handle send
  const handleSend = () => {
    if (audioBlob) {
      // Only send transcription if enabled
      const finalTranscription = transcriptionEnabled ? transcription.trim() : ""
      const finalLanguage = detectedLanguage || currentRecognitionLanguage || transcriptionLanguage
      onSend(audioBlob, finalTranscription, finalLanguage)
    }
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }

      if (autoDetectTimeoutRef.current) {
        clearTimeout(autoDetectTimeoutRef.current)
      }
    }
  }, [audioUrl])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (permissionDenied) {
    return (
      <Card className="p-4 text-center">
        <p className="text-destructive mb-2">Microphone access denied</p>
        <p className="text-sm text-muted-foreground mb-4">Please enable microphone access in your browser settings.</p>
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      {!audioBlob ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{isRecording ? "Recording..." : "Ready to record"}</p>
            <p className="text-sm text-muted-foreground">{formatTime(recordingTime)}</p>
          </div>

          {isRecording && (
            <>
              <div className="flex items-center justify-center h-12 gap-1">
                {visualizerValues.map((value, index) => (
                  <div
                    key={index}
                    className="w-1 bg-primary rounded-full animate-pulse"
                    style={{
                      height: `${value}px`,
                      animationDelay: `${index * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>

              {transcriptionEnabled && transcriptionSupported && (
                <div className="bg-secondary/30 rounded-lg p-3 max-h-24 overflow-y-auto">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Transcription</span>
                      {autoDetectLanguage ? (
                        isDetectingLanguage ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                            <RotateCw className="h-2.5 w-2.5 mr-1 animate-spin" />
                            <span>Detecting language...</span>
                          </Badge>
                        ) : detectedLanguage ? (
                          <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                            <Globe className="h-2.5 w-2.5 mr-1" />
                            <span>Detected: {getLanguageNameByCode(detectedLanguage)}</span>
                          </Badge>
                        ) : null
                      ) : (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                          <Globe className="h-2.5 w-2.5 mr-1" />
                          <span>{getLanguageNameByCode(transcriptionLanguage)}</span>
                        </Badge>
                      )}
                    </div>
                    {transcription && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={clearTranscription}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Clear transcription</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">
                    {transcription}
                    <span className="text-muted-foreground">{interimTranscription}</span>
                    {isTranscribing && <span className="animate-pulse">...</span>}
                  </p>
                </div>
              )}

              {languageDetectionError && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Language detection issue. Try a different language in settings.</AlertDescription>
                </Alert>
              )}

              {transcriptionEnabled && !transcriptionSupported && isRecording && (
                <Alert variant="default" className="bg-secondary/30 border-primary/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Transcription is not supported in your browser.</AlertDescription>
                </Alert>
              )}
            </>
          )}

          <div className="flex justify-center gap-4">
            {isProcessing ? (
              <Button disabled className="rounded-full h-12 w-12 p-0">
                <Loader2 className="h-6 w-6 animate-spin" />
              </Button>
            ) : isRecording ? (
              <>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={onCancel}>
                  <X className="h-6 w-6" />
                </Button>
                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={stopRecording}>
                  <Square className="h-6 w-6" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={onCancel}>
                  <X className="h-6 w-6" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full h-12 w-12 bg-primary"
                  onClick={startRecording}
                >
                  <Mic className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium">Preview your message</p>

          <div className="bg-secondary/30 rounded-lg p-3">
            <audio src={audioUrl || ""} controls className="w-full h-10" />
          </div>

          {transcriptionEnabled && (
            <div className="bg-secondary/30 rounded-lg p-3 max-h-48 overflow-y-auto">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Transcription</span>
                  {autoDetectLanguage && detectedLanguage ? (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                      <Globe className="h-2.5 w-2.5 mr-1" />
                      <span>Detected: {getLanguageNameByCode(detectedLanguage)}</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                      <Globe className="h-2.5 w-2.5 mr-1" />
                      <span>{getLanguageNameByCode(currentRecognitionLanguage || transcriptionLanguage)}</span>
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  {!isEditingTranscription && transcription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={startEditingTranscription}
                      title="Edit transcription"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span className="sr-only">Edit transcription</span>
                    </Button>
                  )}
                  {!isEditingTranscription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full"
                      onClick={clearTranscription}
                      title="Clear transcription"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Clear transcription</span>
                    </Button>
                  )}
                </div>
              </div>

              {isEditingTranscription ? (
                <div className="space-y-2">
                  <Textarea
                    ref={textareaRef}
                    value={editedTranscription}
                    onChange={(e) => setEditedTranscription(e.target.value)}
                    className="min-h-[80px] text-sm"
                    placeholder="Edit your transcription..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={cancelEditingTranscription}
                    >
                      Cancel
                    </Button>
                    <Button variant="default" size="sm" className="h-7 px-2 text-xs" onClick={saveEditedTranscription}>
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{transcription || "No transcription available"}</p>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={onCancel}>
              <X className="h-6 w-6" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="rounded-full h-12 w-12 bg-primary"
              onClick={handleSend}
              disabled={isEditingTranscription}
            >
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
