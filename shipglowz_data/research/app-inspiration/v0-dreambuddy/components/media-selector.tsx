"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MediaBrowser } from "@/components/media-browser"
import { MediaPreview } from "@/components/media-preview"
import { useMediaLibrary } from "@/contexts/media-library-context"
import { ImageIcon } from "lucide-react"

interface MediaSelectorProps {
  onSendMedia: (mediaId: string) => void
}

export function MediaSelector({ onSendMedia }: MediaSelectorProps) {
  const [browserOpen, setBrowserOpen] = useState(false)
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null)
  const { getMediaById } = useMediaLibrary()

  const handleSelectMedia = (mediaId: string) => {
    setPreviewMediaId(mediaId)
  }

  const handleClosePreview = () => {
    setPreviewMediaId(null)
  }

  const handleSendMedia = (mediaId: string) => {
    onSendMedia(mediaId)
    setPreviewMediaId(null)
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => setBrowserOpen(true)}>
        <ImageIcon className="h-5 w-5" />
        <span className="sr-only">Open media library</span>
      </Button>

      <MediaBrowser open={browserOpen} onOpenChange={setBrowserOpen} onSelectMedia={handleSelectMedia} />

      {previewMediaId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <MediaPreview mediaId={previewMediaId} onClose={handleClosePreview} onSend={handleSendMedia} />
          </div>
        </div>
      )}
    </>
  )
}
