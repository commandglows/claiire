"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UploadCloud, X, AlertCircle, CheckCircle2, FileImage, FileAudio } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUpload: (file: File) => void
  onCancel: () => void
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function FileUpload({
  onUpload,
  onCancel,
  accept = "image/*,audio/*",
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return false
    }

    // Check file type
    const acceptedTypes = accept.split(",")
    const fileType = file.type.split("/")[0] + "/*"
    const isAccepted = acceptedTypes.some((type) => {
      return type.trim() === "*" || type.trim() === file.type || type.trim() === fileType
    })

    if (!isAccepted) {
      setError(`File type not supported. Please upload ${accept.replace(/\*/g, "")}`)
      return false
    }

    return true
  }

  const processFile = (file: File) => {
    if (!validateFile(file)) return

    setFile(file)
    setError(null)
    setIsUploading(true)

    // Simulate upload progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 10
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          onUpload(file)
        }, 500)
      }
    }, 200)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      processFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      processFile(file)
    }
  }

  const handleCancel = () => {
    setFile(null)
    setError(null)
    setProgress(0)
    setIsUploading(false)
    onCancel()
  }

  const getFileIcon = () => {
    if (!file) return <UploadCloud className="h-10 w-10 text-muted-foreground" />

    const fileType = file.type.split("/")[0]
    switch (fileType) {
      case "image":
        return <FileImage className="h-10 w-10 text-primary" />
      case "audio":
        return <FileAudio className="h-10 w-10 text-primary" />
      default:
        return <UploadCloud className="h-10 w-10 text-primary" />
    }
  }

  return (
    <Card
      className={cn(
        "border-2 border-dashed p-6 text-center",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-secondary/50 rounded-full">{getFileIcon()}</div>

        {error ? (
          <div className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : file && progress === 100 ? (
          <div className="text-primary flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Upload complete!</span>
          </div>
        ) : file ? (
          <div className="w-full space-y-2">
            <div className="text-sm font-medium">{file.name}</div>
            <Progress value={progress} className="h-2 w-full" />
            <div className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Upload a file</h3>
              <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
            </div>

            <div className="text-xs text-muted-foreground">
              Supported formats: images (JPG, PNG, GIF) and audio (MP3, WAV)
              <br />
              Maximum file size: {maxSize}MB
            </div>
          </>
        )}

        <div className="flex gap-2">
          {!file && (
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Select File</span>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />
            </Button>
          )}

          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
