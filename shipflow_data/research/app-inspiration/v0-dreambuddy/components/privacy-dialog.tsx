"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, Trash2, Download, Clock } from "lucide-react"
import { usePrivacy, type AutoDeletePeriod } from "@/contexts/privacy-context"
import { format } from "date-fns"

export function PrivacyDialog() {
  const {
    autoDeletePeriod,
    setAutoDeletePeriod,
    incognitoMode,
    toggleIncognitoMode,
    clearAllConversations,
    exportConversations,
    lastClearedAt,
  } = usePrivacy()

  const [open, setOpen] = useState(false)

  const autoDeleteOptions = [
    { value: "never", label: "Never" },
    { value: "24h", label: "After 24 hours" },
    { value: "7d", label: "After 7 days" },
    { value: "30d", label: "After 30 days" },
  ]

  const formatLastCleared = () => {
    if (!lastClearedAt) return null
    try {
      return format(new Date(lastClearedAt), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return null
    }
  }

  const lastClearedFormatted = formatLastCleared()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Shield className="h-5 w-5" />
          <span className="sr-only">Privacy Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Privacy Settings</DialogTitle>
          <DialogDescription>Manage your data and privacy preferences</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="auto-delete">Auto-Delete Conversations</Label>
            <Select value={autoDeletePeriod} onValueChange={(value) => setAutoDeletePeriod(value as AutoDeletePeriod)}>
              <SelectTrigger id="auto-delete" className="w-full">
                <SelectValue placeholder="Select a time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Time Period</SelectLabel>
                  {autoDeleteOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Automatically delete your conversation history after the selected time period
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="incognito">Incognito Mode</Label>
              <p className="text-sm text-muted-foreground">Don't save conversations to history</p>
            </div>
            <Switch id="incognito" checked={incognitoMode} onCheckedChange={toggleIncognitoMode} />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-medium">Data Management</h3>

            <div className="flex flex-col space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    Clear All Conversations
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will permanently delete all your conversation history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        clearAllConversations()
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" className="justify-start" onClick={exportConversations}>
                <Download className="mr-2 h-4 w-4" />
                Export Conversations
              </Button>
            </div>

            {lastClearedFormatted && (
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last cleared: {lastClearedFormatted}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Privacy Information</h3>
            <p className="text-xs text-muted-foreground">
              DreamBuddy AI stores all your conversation data locally on your device. No data is sent to our servers
              except for voice processing. Your privacy is our priority.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
