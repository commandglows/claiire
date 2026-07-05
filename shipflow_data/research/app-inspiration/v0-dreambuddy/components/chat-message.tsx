"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageActions } from "@/components/message-actions"
import Image from "next/image"
import { HeartIcon, PlayIcon, PauseIcon, FileTextIcon, XIcon, Globe, Edit2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { getLanguageNameByCode } from "@/lib/languages"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    type?: "text" | "audio" | "image"
    mediaUrl?: string
    audioBlob?: Blob
    transcription?: string
    transcriptionLanguage?: string
  }
  onDeleteTranscription?: (messageId: string) => void
  onEditTranscription?: (messageId: string, newTranscription: string) => void
  onDeleteMessage?: (messageId: string) => void
}

export function ChatMessage({
  message,
  onDeleteTranscription,
  onEditTranscription,
  onDeleteMessage,
}: ChatMessageProps) {
  const isUser = message.role === "user"
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showTranscription, setShowTranscription] = useState(false)
  const [isEditingTranscription, setIsEditingTranscription] = useState(false)
  const [editedTranscription, setEditedTranscription] = useState("")
  const audioRef = useRef<HTMLAudioElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const toggleTranscription = () => {
    setShowTranscription(!showTranscription)
  }

  const handleDeleteTranscription = () => {
    if (onDeleteTranscription) {
      onDeleteTranscription(message.id)
      setShowTranscription(false)
    }
  }

  const startEditingTranscription = () => {
    if (message.transcription) {
      setEditedTranscription(message.transcription)
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
  }

  const saveEditedTranscription = () => {
    if (onEditTranscription && editedTranscription.trim()) {
      onEditTranscription(message.id, editedTranscription.trim())
    }
    setIsEditingTranscription(false)
  }

  const cancelEditingTranscription = () => {
    setEditedTranscription("")
    setIsEditingTranscription(false)
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2 message-bubble-in group`}>
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/20">DB</AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-1" : "order-2"} relative`}>
        {/* Message actions button - only visible on hover */}
        {onDeleteMessage && (
          <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <MessageActions messageId={message.id} messageContent={message.content} onDelete={onDeleteMessage} />
          </div>
        )}

        <Card className={cn("border-0", isUser ? "bg-primary text-primary-foreground" : "bg-secondary/50")}>
          <CardContent className="p-3">
            {message.type === "image" && message.mediaUrl && (
              <div className="mb-2">
                <Image
                  src={message.mediaUrl || "/placeholder.svg"}
                  alt="Shared media"
                  width={240}
                  height={180}
                  className="rounded-md"
                />
              </div>
            )}

            {message.type === "audio" && message.mediaUrl && (
              <div className="space-y-2">
                <audio
                  ref={audioRef}
                  src={message.mediaUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleEnded}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full",
                      isUser ? "bg-white/20 hover:bg-white/30" : "bg-primary/20 hover:bg-primary/30",
                    )}
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                  </Button>

                  <div className="flex-1">
                    <div className="h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", isUser ? "bg-white/50" : "bg-primary/50")}
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs opacity-70">{formatTime(currentTime)}</span>
                      <span className="text-xs opacity-70">{formatTime(duration)}</span>
                    </div>
                  </div>

                  {message.transcription && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isUser ? "bg-white/20 hover:bg-white/30" : "bg-primary/20 hover:bg-primary/30",
                        showTranscription && "bg-primary/40",
                      )}
                      onClick={toggleTranscription}
                      title={showTranscription ? "Hide transcription" : "Show transcription"}
                    >
                      <FileTextIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {message.transcription && showTranscription && (
                  <div className={cn("mt-2 p-2 rounded text-sm relative", isUser ? "bg-white/10" : "bg-primary/10")}>
                    <div className="flex justify-between items-start mb-1">
                      {message.transcriptionLanguage && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-4 bg-primary/10">
                          <Globe className="h-2.5 w-2.5 mr-1" />
                          <span>{getLanguageNameByCode(message.transcriptionLanguage)}</span>
                        </Badge>
                      )}

                      <div className="flex gap-1">
                        {isUser && onEditTranscription && !isEditingTranscription && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                            onClick={startEditingTranscription}
                            title="Edit transcription"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span className="sr-only">Edit transcription</span>
                          </Button>
                        )}

                        {isUser && onDeleteTranscription && !isEditingTranscription && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100"
                            onClick={handleDeleteTranscription}
                            title="Delete transcription"
                          >
                            <XIcon className="h-3 w-3" />
                            <span className="sr-only">Delete transcription</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {isEditingTranscription ? (
                      <div className="space-y-2 mt-2">
                        <Textarea
                          ref={textareaRef}
                          value={editedTranscription}
                          onChange={(e) => setEditedTranscription(e.target.value)}
                          className={cn("min-h-[80px] text-sm", isUser ? "bg-white/10 text-white" : "bg-primary/10")}
                          placeholder="Edit your transcription..."
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-7 px-2 text-xs",
                              isUser && "bg-white/10 hover:bg-white/20 border-white/20",
                            )}
                            onClick={cancelEditingTranscription}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant={isUser ? "secondary" : "default"}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={saveEditedTranscription}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="italic">{message.transcription}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {(message.type !== "audio" || message.content !== "Voice message") && (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </CardContent>
        </Card>

        {!isUser && (
          <div className="flex justify-end mt-1">
            <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <HeartIcon className="h-3 w-3" />
              <span>Like</span>
            </button>
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-accent/20">You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
