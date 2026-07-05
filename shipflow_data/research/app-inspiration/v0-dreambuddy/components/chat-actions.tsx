"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MediaBrowser } from "@/components/media-browser"
import { MediaUploadDialog } from "@/components/media-upload-dialog"
import { CoffeeIcon, SparklesIcon, VolumeIcon, ImageIcon, Upload } from "lucide-react"
import { useMediaLibrary } from "@/contexts/media-library-context"

interface ChatActionsProps {
  onVoiceMessageClick?: () => void
  onSelectMedia?: (mediaId: string) => void
}

export function ChatActions({ onVoiceMessageClick, onSelectMedia }: ChatActionsProps) {
  const [browserOpen, setBrowserOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { getMediaById } = useMediaLibrary()

  const handleSelectMedia = (mediaId: string) => {
    if (onSelectMedia) {
      onSelectMedia(mediaId)
    }
    setBrowserOpen(false)
  }

  return (
    <>
      <div className="p-2 flex justify-center gap-2 border-t">
        <Button variant="outline" size="sm" className="rounded-full text-xs flex gap-1" onClick={onVoiceMessageClick}>
          <VolumeIcon className="h-3 w-3" />
          <span>Voice</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs flex gap-1"
          onClick={() => setBrowserOpen(true)}
        >
          <ImageIcon className="h-3 w-3" />
          <span>Media</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs flex gap-1"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="h-3 w-3" />
          <span>Upload</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs flex gap-1 text-amber-500 border-amber-500/20"
        >
          <CoffeeIcon className="h-3 w-3" />
          <span>Buy a Coffee</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="rounded-full text-xs flex gap-1 text-purple-500 border-purple-500/20"
        >
          <SparklesIcon className="h-3 w-3" />
          <span>Premium</span>
        </Button>
      </div>

      <MediaBrowser open={browserOpen} onOpenChange={setBrowserOpen} onSelectMedia={handleSelectMedia} />
      <MediaUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </>
  )
}
