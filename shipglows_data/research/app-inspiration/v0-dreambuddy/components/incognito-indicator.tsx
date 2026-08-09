"use client"

import { EyeOff } from "lucide-react"
import { usePrivacy } from "@/contexts/privacy-context"
import { Badge } from "@/components/ui/badge"

export function IncognitoIndicator() {
  const { incognitoMode } = usePrivacy()

  if (!incognitoMode) return null

  return (
    <Badge variant="outline" className="bg-secondary/50 text-xs gap-1">
      <EyeOff className="h-3 w-3" />
      <span>Incognito</span>
    </Badge>
  )
}
