"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ChatHeader } from "@/components/chat-header"
import { ChatMessage } from "@/components/chat-message"
import { ChatActions } from "@/components/chat-actions"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { VoiceRecorder } from "@/components/voice-recorder"
import { SettingsDialog } from "@/components/settings-dialog"
import { PrivacyDialog } from "@/components/privacy-dialog"
import { IncognitoIndicator } from "@/components/incognito-indicator"
import { MediaSelector } from "@/components/media-selector"
import { MediaUploadDialog } from "@/components/media-upload-dialog"
import { SendIcon, MicIcon, HomeIcon, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { getResponseForPersonality } from "@/lib/chat-responses"
import { useSettings } from "@/contexts/settings-context"
import { usePrivacy } from "@/contexts/privacy-context"
import { useMediaLibrary } from "@/contexts/media-library-context"
import { differenceInHours, differenceInDays } from "date-fns"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  type?: "text" | "audio" | "image"
  mediaUrl?: string
  mediaId?: string
  audioBlob?: Blob
  transcription?: string
  transcriptionLanguage?: string
  timestamp?: string
}

export function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { transcriptionEnabled, transcriptionLanguage } = useSettings()
  const { autoDeletePeriod, incognitoMode } = usePrivacy()
  const { getMediaById, addToRecentlyUsed } = useMediaLibrary()

  // Default to 'wholesome' if searchParams is null or personality param is missing
  const personality = searchParams ? searchParams.get("personality") || "wholesome" : "wholesome"

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationId = useRef<string>(searchParams?.get("id") || `conversation-${Date.now()}`)

  // Load conversation from localStorage on mount
  useEffect(() => {
    if (incognitoMode) return // Don't load conversations in incognito mode

    try {
      const savedConversations = localStorage.getItem("dreambuddy-conversations")
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations)
        const currentConversation = parsedConversations[conversationId.current]

        if (currentConversation?.messages) {
          // Apply auto-delete logic
          const filteredMessages = applyAutoDeleteFilter(currentConversation.messages)
          setMessages(filteredMessages)

          // If messages were filtered due to auto-delete, update storage
          if (filteredMessages.length !== currentConversation.messages.length) {
            saveConversation(filteredMessages)
          }
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }, [incognitoMode])

  // Listen for conversation cleared event
  useEffect(() => {
    const handleConversationsCleared = () => {
      setMessages([])
    }

    window.addEventListener("dreambuddy-conversations-cleared", handleConversationsCleared)

    return () => {
      window.removeEventListener("dreambuddy-conversations-cleared", handleConversationsCleared)
    }
  }, [])

  // Apply auto-delete filter based on message timestamps
  const applyAutoDeleteFilter = (messagesToFilter: Message[]): Message[] => {
    if (autoDeletePeriod === "never") return messagesToFilter

    const now = new Date()
    return messagesToFilter.filter((message) => {
      if (!message.timestamp) return true

      const messageDate = new Date(message.timestamp)

      switch (autoDeletePeriod) {
        case "24h":
          return differenceInHours(now, messageDate) < 24
        case "7d":
          return differenceInDays(now, messageDate) < 7
        case "30d":
          return differenceInDays(now, messageDate) < 30
        default:
          return true
      }
    })
  }

  // Save conversation to localStorage
  const saveConversation = (messagesToSave: Message[]) => {
    if (incognitoMode) return // Don't save in incognito mode

    try {
      const savedConversations = localStorage.getItem("dreambuddy-conversations")
      const parsedConversations = savedConversations ? JSON.parse(savedConversations) : {}

      parsedConversations[conversationId.current] = {
        id: conversationId.current,
        personality,
        lastUpdated: new Date().toISOString(),
        messages: messagesToSave,
      }

      localStorage.setItem("dreambuddy-conversations", JSON.stringify(parsedConversations))
    } catch (error) {
      console.error("Error saving conversation:", error)
    }
  }

  // Simulate initial message based on personality
  useEffect(() => {
    if (!searchParams) return // Skip if searchParams is not available yet
    if (messages.length > 0) return // Skip if we already have messages

    const initialMessages: Record<string, string> = {
      wholesome: "Hey there! 💖 I'm your Wholesome Bestie! What's on your mind tonight?",
      dark: "Sup. 🖤 Can't sleep either, huh? What existential crisis are we diving into tonight?",
      therapy: "Hello there. 🌿 I'm your Therapy Llama. What's bothering you this evening?",
    }

    setTimeout(() => {
      const initialMessage = {
        id: "1",
        role: "assistant" as const,
        content: initialMessages[personality] || initialMessages.wholesome,
        type: "text" as const,
        timestamp: new Date().toISOString(),
      }

      setMessages([initialMessage])

      // Save initial message if not in incognito mode
      if (!incognitoMode) {
        saveConversation([initialMessage])
      }
    }, 1000)
  }, [personality, searchParams, messages.length, incognitoMode])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      type: "text",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveConversation(updatedMessages)

    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = getResponseForPersonality(personality, input)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        type: response.type,
        mediaUrl: response.mediaUrl,
        timestamp: new Date().toISOString(),
      }

      const messagesWithResponse = [...updatedMessages, aiMessage]
      setMessages(messagesWithResponse)
      saveConversation(messagesWithResponse)

      setIsTyping(false)
    }, 2000)
  }

  const handleSendVoiceMessage = (audioBlob: Blob, transcription: string, detectedLanguage: string) => {
    // Create object URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob)

    // Add user voice message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: transcription || "Voice message",
      type: "audio",
      mediaUrl: audioUrl,
      audioBlob: audioBlob,
      transcription: transcription || undefined,
      transcriptionLanguage: transcription ? detectedLanguage : undefined,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveConversation(updatedMessages)

    setIsRecording(false)
    setIsTyping(true)

    // Simulate AI response to voice message
    setTimeout(() => {
      // Get a response that's appropriate for a voice message
      const response = getResponseForPersonality(personality, transcription || "voice message", true)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        type: response.type,
        mediaUrl: response.mediaUrl,
        timestamp: new Date().toISOString(),
      }

      const messagesWithResponse = [...updatedMessages, aiMessage]
      setMessages(messagesWithResponse)
      saveConversation(messagesWithResponse)

      setIsTyping(false)
    }, 2000)
  }

  const handleSendMedia = (mediaId: string) => {
    const media = getMediaById(mediaId)
    if (!media) return

    // Add to recently used
    addToRecentlyUsed(mediaId)

    // Add user media message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Shared ${media.type}: ${media.title}`,
      type: media.type === "audio" ? "audio" : "image",
      mediaUrl: media.url,
      mediaId: media.id,
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    saveConversation(updatedMessages)

    setIsTyping(true)

    // Simulate AI response to media
    setTimeout(() => {
      // Get a response based on the media mood
      const mood = media.moods[0] || "reflective"
      const response = getResponseForPersonality(personality, `Shared a ${mood} ${media.type}`)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        type: "text",
        timestamp: new Date().toISOString(),
      }

      const messagesWithResponse = [...updatedMessages, aiMessage]
      setMessages(messagesWithResponse)
      saveConversation(messagesWithResponse)

      setIsTyping(false)
    }, 2000)
  }

  const handleDeleteTranscription = (messageId: string) => {
    const updatedMessages = messages.map((message) =>
      message.id === messageId ? { ...message, transcription: undefined, transcriptionLanguage: undefined } : message,
    )

    setMessages(updatedMessages)
    saveConversation(updatedMessages)
  }

  const handleEditTranscription = (messageId: string, newTranscription: string) => {
    const updatedMessages = messages.map((message) =>
      message.id === messageId ? { ...message, transcription: newTranscription, content: newTranscription } : message,
    )

    setMessages(updatedMessages)
    saveConversation(updatedMessages)
  }

  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter((message) => message.id !== messageId)
    setMessages(updatedMessages)
    saveConversation(updatedMessages)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-background to-secondary/20">
      <ChatHeader
        personality={personality}
        rightContent={
          <div className="flex items-center gap-2">
            <IncognitoIndicator />
            <PrivacyDialog />
            <SettingsDialog />
          </div>
        }
      />

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-md mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onDeleteTranscription={message.role === "user" ? handleDeleteTranscription : undefined}
              onEditTranscription={message.role === "user" ? handleEditTranscription : undefined}
              onDeleteMessage={handleDeleteMessage}
            />
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20">DB</AvatarFallback>
              </Avatar>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <SubscriptionBanner />

      <Card className="rounded-t-xl border-t border-x border-b-0 mx-auto w-full max-w-md">
        {isRecording ? (
          <div className="p-4">
            <VoiceRecorder onSend={handleSendVoiceMessage} onCancel={() => setIsRecording(false)} />
          </div>
        ) : (
          <>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => router.push("/")}>
                  <HomeIcon className="h-5 w-5" />
                </Button>
                <div className="flex-1 flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2">
                  <Input
                    className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    placeholder="What's bothering you?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <MediaSelector onSendMedia={handleSendMedia} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setIsRecording(true)}
                  >
                    <MicIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8"
                    onClick={() => setUploadDialogOpen(true)}
                  >
                    <Upload className="h-5 w-5" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                >
                  <SendIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ChatActions onVoiceMessageClick={() => setIsRecording(true)} onSelectMedia={handleSendMedia} />
          </>
        )}
      </Card>

      <MediaUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
