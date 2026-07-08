"use client"

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
import { Button } from "@/components/ui/button"
import { MoreVertical, Trash2, Copy } from "lucide-react"

interface MessageActionsProps {
  messageId: string
  messageContent: string
  onDelete: (messageId: string) => void
}

export function MessageActions({ messageId, messageContent, onDelete }: MessageActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard
      .writeText(messageContent)
      .then(() => {
        // Could show a toast notification here
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
      })
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    onDelete(messageId)
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full opacity-70 hover:opacity-100">
            <MoreVertical className="h-3 w-3" />
            <span className="sr-only">Message actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
            <Copy className="mr-2 h-3.5 w-3.5" />
            <span>Copy text</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-destructive">
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span>Delete message</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this message from your conversation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
