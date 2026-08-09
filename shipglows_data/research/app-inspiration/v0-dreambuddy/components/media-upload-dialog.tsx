"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Badge } from "@/components/ui/badge"
import { useMediaLibrary, type MediaCategory, type MediaMood, type MediaType } from "@/contexts/media-library-context"
import { X, Plus, AlertCircle } from "lucide-react"

interface MediaUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MediaUploadDialog({ open, onOpenChange }: MediaUploadDialogProps) {
  const { addUserMedia } = useMediaLibrary()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<MediaCategory>("personal")
  const [selectedMoods, setSelectedMoods] = useState<MediaMood[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState<"file" | "details">("file")

  const categories: { value: MediaCategory; label: string }[] = [
    { value: "personal", label: "Personal" },
    { value: "memes", label: "Memes" },
    { value: "calming", label: "Calming" },
    { value: "motivation", label: "Motivation" },
    { value: "comfort", label: "Comfort" },
    { value: "sleep", label: "Sleep Aid" },
    { value: "anxiety", label: "Anxiety Relief" },
    { value: "quotes", label: "Quotes" },
  ]

  const moods: { value: MediaMood; label: string }[] = [
    { value: "sad", label: "Sad" },
    { value: "anxious", label: "Anxious" },
    { value: "overwhelmed", label: "Overwhelmed" },
    { value: "lonely", label: "Lonely" },
    { value: "tired", label: "Tired" },
    { value: "hopeful", label: "Hopeful" },
    { value: "reflective", label: "Reflective" },
  ]

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile)
    setUploadStep("details")

    // Auto-detect media type from file
    const fileType = uploadedFile.type.split("/")[0]
    if (fileType === "image") {
      // For images, try to extract a title from the filename
      const fileName = uploadedFile.name.split(".")[0]
      setTitle(fileName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    } else if (fileType === "audio") {
      // For audio, set category to calming by default
      setCategory("calming")
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleToggleMood = (mood: MediaMood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood))
    } else {
      setSelectedMoods([...selectedMoods, mood])
    }
  }

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      setError("Please provide a title for your media")
      return
    }

    if (selectedMoods.length === 0) {
      setError("Please select at least one mood")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Create object URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Determine media type
      let mediaType: MediaType = "image"
      if (file.type.startsWith("audio/")) {
        mediaType = "audio"
      } else if (file.type.includes("gif")) {
        mediaType = "gif"
      }

      // Create thumbnail for audio files
      let thumbnail: string | undefined
      if (mediaType === "audio") {
        thumbnail = "/placeholder.svg?height=200&width=200"
      }

      // Get audio duration if it's an audio file
      let duration: number | undefined
      if (mediaType === "audio") {
        try {
          duration = await getAudioDuration(file)
        } catch (error) {
          console.error("Error getting audio duration:", error)
        }
      }

      // Add to media library
      addUserMedia({
        title,
        description,
        type: mediaType,
        category,
        url: fileUrl,
        thumbnail,
        moods: selectedMoods,
        tags,
        duration,
        localFile: true,
        isUserUploaded: true,
      })

      // Reset form and close dialog
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error uploading media:", error)
      setError("An error occurred while uploading your media")
    } finally {
      setIsUploading(false)
    }
  }

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.onloadedmetadata = () => {
        resolve(audio.duration)
      }
      audio.onerror = () => {
        reject(new Error("Could not load audio file"))
      }
      audio.src = URL.createObjectURL(file)
    })
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setCategory("personal")
    setSelectedMoods([])
    setTags([])
    setTagInput("")
    setError(null)
    setUploadStep("file")
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Your Media</DialogTitle>
        </DialogHeader>

        {uploadStep === "file" ? (
          <FileUpload
            onUpload={handleFileUpload}
            onCancel={handleClose}
            accept="image/jpeg,image/png,image/gif,audio/mpeg,audio/wav"
            maxSize={15}
          />
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your media a title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description"
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    type="button"
                    variant={category === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat.value)}
                    className="rounded-full"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Moods</Label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    type="button"
                    variant={selectedMoods.includes(mood.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleMood(mood.value)}
                    className="rounded-full"
                  >
                    {mood.label}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Select moods that match your media</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button type="button" size="icon" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0 rounded-full"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-2 w-2" />
                      <span className="sr-only">Remove {tag}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Press Enter or click + to add a tag</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {uploadStep === "details" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadStep("file")}>
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Media"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
