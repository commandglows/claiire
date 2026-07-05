"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MediaCard } from "@/components/media-card"
import { MediaUploadDialog } from "@/components/media-upload-dialog"
import { useMediaLibrary, type MediaCategory, type MediaMood } from "@/contexts/media-library-context"
import { Search, Smile, Heart, Clock, X, Upload, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface MediaBrowserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectMedia: (mediaId: string) => void
}

export function MediaBrowser({ open, onOpenChange, onSelectMedia }: MediaBrowserProps) {
  const {
    mediaItems,
    favorites,
    recentlyUsed,
    getMediaByCategory,
    getMediaByMood,
    getMediaById,
    searchMedia,
    getUserUploadedMedia,
    deleteUserMedia,
  } = useMediaLibrary()

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof mediaItems>([])
  const [selectedMood, setSelectedMood] = useState<MediaMood | "">("")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null)

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchMedia(searchQuery))
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchMedia])

  const handleSelectMedia = (mediaId: string) => {
    onSelectMedia(mediaId)
    onOpenChange(false)
  }

  const handleDeleteMedia = (mediaId: string) => {
    setMediaToDelete(mediaId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteMedia = () => {
    if (mediaToDelete) {
      deleteUserMedia(mediaToDelete)
      setMediaToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const renderMediaItems = () => {
    if (searchQuery.trim()) {
      return searchResults.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onSelect={() => handleSelectMedia(item.id)}
          onDelete={item.isUserUploaded ? () => handleDeleteMedia(item.id) : undefined}
        />
      ))
    }

    if (activeTab === "favorites") {
      return favorites
        .map((id) => getMediaById(id))
        .filter(Boolean)
        .map((item) => (
          <MediaCard
            key={item!.id}
            media={item!}
            onSelect={() => handleSelectMedia(item!.id)}
            onDelete={item!.isUserUploaded ? () => handleDeleteMedia(item!.id) : undefined}
          />
        ))
    }

    if (activeTab === "recent") {
      return recentlyUsed
        .map((id) => getMediaById(id))
        .filter(Boolean)
        .map((item) => (
          <MediaCard
            key={item!.id}
            media={item!}
            onSelect={() => handleSelectMedia(item!.id)}
            onDelete={item!.isUserUploaded ? () => handleDeleteMedia(item!.id) : undefined}
          />
        ))
    }

    if (activeTab === "personal") {
      return getUserUploadedMedia().map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onSelect={() => handleSelectMedia(item.id)}
          onDelete={() => handleDeleteMedia(item.id)}
        />
      ))
    }

    if (activeTab === "moods" && selectedMood) {
      return getMediaByMood(selectedMood as MediaMood).map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onSelect={() => handleSelectMedia(item.id)}
          onDelete={item.isUserUploaded ? () => handleDeleteMedia(item.id) : undefined}
        />
      ))
    }

    if (activeTab !== "all" && activeTab !== "moods" && activeTab !== "personal") {
      return getMediaByCategory(activeTab as MediaCategory).map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onSelect={() => handleSelectMedia(item.id)}
          onDelete={item.isUserUploaded ? () => handleDeleteMedia(item.id) : undefined}
        />
      ))
    }

    return mediaItems.map((item) => (
      <MediaCard
        key={item.id}
        media={item}
        onSelect={() => handleSelectMedia(item.id)}
        onDelete={item.isUserUploaded ? () => handleDeleteMedia(item.id) : undefined}
      />
    ))
  }

  const moods: { value: MediaMood; label: string }[] = [
    { value: "sad", label: "Sad" },
    { value: "anxious", label: "Anxious" },
    { value: "overwhelmed", label: "Overwhelmed" },
    { value: "lonely", label: "Lonely" },
    { value: "tired", label: "Tired" },
    { value: "hopeful", label: "Hopeful" },
    { value: "reflective", label: "Reflective" },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Media Library</DialogTitle>
            <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-7 w-7 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="memes">Memes</TabsTrigger>
              <TabsTrigger value="calming">Calming</TabsTrigger>
              <TabsTrigger value="motivation">Motivation</TabsTrigger>
              <TabsTrigger value="moods">Moods</TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>Favorites</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Recent</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "moods" && (
              <div className="flex flex-wrap gap-2 my-4">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMood(mood.value)}
                    className="rounded-full"
                  >
                    <Smile className="h-3 w-3 mr-1" />
                    {mood.label}
                  </Button>
                ))}
                {selectedMood && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMood("")} className="rounded-full">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            )}

            <ScrollArea className="flex-1 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">{renderMediaItems()}</div>
              {activeTab === "personal" && getUserUploadedMedia().length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't uploaded any media yet</p>
                  <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload Media</span>
                  </Button>
                </div>
              )}
            </ScrollArea>
          </Tabs>
        </DialogContent>
      </Dialog>

      <MediaUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMedia} className="bg-destructive text-destructive-foreground">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
