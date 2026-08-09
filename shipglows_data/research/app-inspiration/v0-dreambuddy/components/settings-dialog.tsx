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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { supportedLanguages } from "@/lib/languages"

export function SettingsDialog() {
  const {
    transcriptionEnabled,
    toggleTranscription,
    transcriptionLanguage,
    setTranscriptionLanguage,
    autoDetectLanguage,
    toggleAutoDetectLanguage,
  } = useSettings()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your DreamBuddy AI experience</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="transcription">Voice Transcription</Label>
              <p className="text-sm text-muted-foreground">Convert your voice messages to text</p>
            </div>
            <Switch id="transcription" checked={transcriptionEnabled} onCheckedChange={toggleTranscription} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-detect">Auto-detect Language</Label>
              <p className="text-sm text-muted-foreground">Automatically detect the language you're speaking</p>
            </div>
            <Switch
              id="auto-detect"
              checked={autoDetectLanguage}
              onCheckedChange={toggleAutoDetectLanguage}
              disabled={!transcriptionEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Transcription Language</Label>
            <Select
              value={transcriptionLanguage}
              onValueChange={setTranscriptionLanguage}
              disabled={!transcriptionEnabled || autoDetectLanguage}
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {supportedLanguages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center">
                        <span>{language.name}</span>
                        {language.localName !== language.name && (
                          <span className="ml-2 text-muted-foreground">({language.localName})</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {autoDetectLanguage
                ? "Language will be detected automatically when you speak"
                : "Select the language you'll be speaking in for voice messages"}
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
