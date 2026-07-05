"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMediaLibrary, type MediaItem } from "@/contexts/media-library-context"
import { Heart, Play, Pause, X, Share, Download, Volume2, VolumeX } from "lucide-react"

interface MediaPreviewProps {
  mediaId: string
  onClose: () => void
  onSend: (mediaId: string) => void
}

export function MediaPreview({ mediaId, onClose, onSend }: MediaPreviewProps) {
  const { getMediaById, toggleFavorite, addToRecentlyUsed } = useMediaLibrary()
  const [media, setMedia] = useState<MediaItem | undefined>(undefined)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const mediaItem = getMediaById(mediaId)
    setMedia(mediaItem)

    // Add to recently used when previewing
    if (mediaItem) {
      addToRecentlyUsed(mediaItem.id)
    }
  }, [mediaId, getMediaById, addToRecentlyUsed])

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

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleFavoriteClick = () => {
    if (media) {
      toggleFavorite(media.id)
    }
  }

  const handleSend = () => {
    if (media) {
      onSend(media.id)
    }
  }

  if (!media) {
    return null
  }

  return (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-0">
        <div className="relative">
          {media.type === "audio" ? (
            <div className="relative w-full aspect-video bg-secondary/50 flex items-center justify-center">
              <audio
                ref={audioRef}
                src={media.url}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                className="hidden"
              />

              {media.thumbnail ? (
                <Image
                  src={media.thumbnail || "/placeholder.svg"}
                  alt={media.title}
                  fill
                  className="object-cover opacity-50"
                />
              ) : null}

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-16 w-16 rounded-full bg-primary/20 hover:bg-primary/30 mb-4"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>

                <div className="w-3/4 space-y-2">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-h-[400px] flex items-center justify-center">
              <Image
                src={media.url || "/placeholder.svg"}
                alt={media.title}
                width={400}
                height={400}
                className="object-contain max-h-[400px] w-auto"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{media.title}</h3>
              {media.description && <p className="text-sm text-muted-foreground">{media.description}</p>}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleFavoriteClick}>
              <Heart
                className={`h-5 w-5 ${media.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
              <span className="sr-only">{media.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            <Badge variant="outline">{media.category}</Badge>
            {media.moods.map((mood) => (
              <Badge key={mood} variant="secondary">
                {mood}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              {media.type === "audio" && (
                <Button variant="outline" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>
              )}
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
            <Button onClick={handleSend} className="gap-2">
              <Share className="h-4 w-4" />
              <span>Send in Chat</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
