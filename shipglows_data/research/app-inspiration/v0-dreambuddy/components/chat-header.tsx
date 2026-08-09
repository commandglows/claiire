"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeartIcon, CloudMoonIcon, BrainIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type React from "react"
import { DreamBuddyMascot, type BuddyCustomization, defaultCustomization } from "@/components/dream-buddy-mascot"

interface ChatHeaderProps {
  personality: string
  rightContent?: React.ReactNode
}

export function ChatHeader({ personality = "wholesome", rightContent }: ChatHeaderProps) {
  const [buddyCustomization, setBuddyCustomization] = useState<BuddyCustomization>({ ...defaultCustomization })

  // Load saved customization from localStorage on mount
  useEffect(() => {
    try {
      const savedCustomization = localStorage.getItem("dreambuddy-customization")
      if (savedCustomization) {
        setBuddyCustomization(JSON.parse(savedCustomization))
      }
    } catch (error) {
      console.error("Error loading customization:", error)
    }
  }, [])

  const getPersonalityDetails = () => {
    switch (personality) {
      case "dark":
        return {
          name: "Dark Humor Buddy",
          icon: <CloudMoonIcon className="h-4 w-4" />,
          color: "bg-purple-700",
          textColor: "text-purple-200",
        }
      case "therapy":
        return {
          name: "Therapy Llama",
          icon: <BrainIcon className="h-4 w-4" />,
          color: "bg-teal-600",
          textColor: "text-teal-200",
        }
      default:
        return {
          name: "Wholesome Bestie",
          icon: <HeartIcon className="h-4 w-4" />,
          color: "bg-pink-500",
          textColor: "text-pink-200",
        }
    }
  }

  const details = getPersonalityDetails()
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-md mx-auto flex items-center p-4">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarFallback className="p-0 flex items-center justify-center">
            <DreamBuddyMascot customization={buddyCustomization} size="sm" animated={false} />
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{details.name}</div>
          <div className="text-xs text-muted-foreground">Online • {currentTime}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className={`text-xs px-2 py-1 rounded-full ${details.color} ${details.textColor}`}>Active</div>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/profile">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
          {rightContent}
        </div>
      </div>
    </div>
  )
}
