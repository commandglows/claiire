"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMediaLibrary, type MediaItem } from "@/contexts/media-library-context"
import { Heart, Music, Play, ImageIcon, Clock, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MediaCardProps {
  media: MediaItem
  onSelect: () => void
  onDelete?: () => void
}

export function MediaCard({ media, onSelect, onDelete }: MediaCardProps) {
  const { toggleFavorite } = useMediaLibrary()
  const [isHovering, setIsHovering] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(media.id)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete()
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const renderThumbnail = () => {
    if (media.type === "audio") {
      return (
        <div className="relative w-full aspect-square bg-secondary/50 rounded-md flex items-center justify-center">
          {isHovering ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <Play className="h-10 w-10 text-white" />
            </div>
          ) : (
            <>
              <Music className="h-10 w-10 text-primary/50" />
              {media.duration && (
                <Badge variant="secondary" className="absolute bottom-2 right-2">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(media.duration)}
                </Badge>
              )}
            </>
          )}
        </div>
      )
    }

    return (
      <div className="relative w-full aspect-square rounded-md overflow-hidden">
        <Image src={media.thumbnail || media.url} alt={media.title} fill className="object-cover" />
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            {media.type === "image" ? (
              <ImageIcon className="h-10 w-10 text-white" />
            ) : (
              <Play className="h-10 w-10 text-white" />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-border/50 group"
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-0">
        {renderThumbnail()}
        <div className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-sm line-clamp-1">{media.title}</h3>
              {media.description && <p className="text-xs text-muted-foreground line-clamp-1">{media.description}</p>}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full -mt-1 -mr-1"
                onClick={handleFavoriteClick}
              >
                <Heart
                  className={`h-4 w-4 ${media.isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
                <span className="sr-only">{media.isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
              </Button>

              {onDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive cursor-pointer">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
              {media.category}
            </Badge>
            {media.moods.slice(0, 1).map((mood) => (
              <Badge key={mood} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                {mood}
              </Badge>
            ))}
            {media.isUserUploaded && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-primary/10 text-primary">
                Personal
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
