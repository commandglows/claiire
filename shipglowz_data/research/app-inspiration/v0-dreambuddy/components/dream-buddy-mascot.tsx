"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export type BuddyCustomization = {
  faceColor: string
  earColor: string
  accentColor: string
  eyeColor: string
  noseColor: string
  accessory: "none" | "hat" | "bowtie" | "glasses" | "scarf"
  mugColor: string
  mugStyle: "coffee" | "tea" | "cocoa" | "none"
}

export const defaultCustomization: BuddyCustomization = {
  faceColor: "bg-white dark:bg-purple-800/30",
  earColor: "bg-purple-200 dark:bg-purple-800/50",
  accentColor: "bg-purple-100 dark:bg-purple-900/30",
  eyeColor: "bg-purple-900 dark:bg-white",
  noseColor: "bg-pink-300 dark:bg-pink-600",
  accessory: "none",
  mugColor: "from-pink-400 to-purple-500 dark:from-pink-600 dark:to-purple-700",
  mugStyle: "coffee",
}

interface DreamBuddyMascotProps {
  className?: string
  customization?: Partial<BuddyCustomization>
  size?: "sm" | "md" | "lg"
  animated?: boolean
}

export function DreamBuddyMascot({
  className,
  customization = {},
  size = "md",
  animated = true,
}: DreamBuddyMascotProps) {
  const [isBlinking, setIsBlinking] = useState(false)
  const [isMugTilting, setIsMugTilting] = useState(false)

  // Merge default customization with provided options
  const buddyStyle: BuddyCustomization = {
    ...defaultCustomization,
    ...customization,
  }

  // Size mappings
  const sizeClasses = {
    sm: {
      container: "w-12 h-12",
      face: "w-10 h-10",
      ear: "w-2.5 h-5",
      eye: "w-1.5 h-1.5",
      nose: "w-2 h-1.5",
      smile: "w-4 h-1.5 border-b-[1.5px]",
      mug: "w-4 h-5",
      mugHandle: "w-1.5 h-3",
    },
    md: {
      container: "w-20 h-20",
      face: "w-16 h-16",
      ear: "w-4 h-8",
      eye: "w-2 h-2",
      nose: "w-3 h-2",
      smile: "w-6 h-2 border-b-2",
      mug: "w-6 h-7",
      mugHandle: "w-2 h-4",
    },
    lg: {
      container: "w-32 h-32",
      face: "w-24 h-24",
      ear: "w-6 h-12",
      eye: "w-3 h-3",
      nose: "w-4 h-3",
      smile: "w-8 h-3 border-b-3",
      mug: "w-8 h-10",
      mugHandle: "w-3 h-6",
    },
  }

  // Random blinking effect
  useEffect(() => {
    if (!animated) return

    const blinkInterval = setInterval(
      () => {
        setIsBlinking(true)
        setTimeout(() => setIsBlinking(false), 200)
      },
      Math.random() * 3000 + 2000,
    ) // Random interval between 2-5 seconds

    return () => clearInterval(blinkInterval)
  }, [animated])

  // Occasional mug tilting
  useEffect(() => {
    if (!animated || buddyStyle.mugStyle === "none") return

    const tiltInterval = setInterval(
      () => {
        setIsMugTilting(true)
        setTimeout(() => setIsMugTilting(false), 1000)
      },
      Math.random() * 10000 + 5000,
    ) // Random interval between 5-15 seconds

    return () => clearInterval(tiltInterval)
  }, [animated, buddyStyle.mugStyle])

  // Render accessory based on selection
  const renderAccessory = () => {
    switch (buddyStyle.accessory) {
      case "hat":
        return (
          <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${sizeClasses[size].ear} w-auto h-auto`}>
            <div className="w-10 h-2 bg-red-500 dark:bg-red-600 rounded-full"></div>
            <div className="w-6 h-4 bg-red-500 dark:bg-red-600 rounded-t-full mx-auto"></div>
            <div className="w-2 h-2 bg-white dark:bg-white/80 rounded-full absolute top-2 left-4"></div>
          </div>
        )
      case "bowtie":
        return (
          <div
            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${sizeClasses[size].ear} w-auto h-auto`}
          >
            <div className="w-6 h-3 bg-red-500 dark:bg-red-600 transform rotate-45 absolute -left-2"></div>
            <div className="w-6 h-3 bg-red-500 dark:bg-red-600 transform -rotate-45 absolute -right-2"></div>
            <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )
      case "glasses":
        return (
          <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 ${sizeClasses[size].ear} w-auto h-auto`}>
            <div className="w-12 h-3 border-2 border-black dark:border-white rounded-full flex items-center justify-between px-1">
              <div className="w-3 h-2 bg-blue-300/50 dark:bg-blue-500/50 rounded-full"></div>
              <div className="w-3 h-2 bg-blue-300/50 dark:bg-blue-500/50 rounded-full"></div>
            </div>
          </div>
        )
      case "scarf":
        return (
          <div
            className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${sizeClasses[size].ear} w-auto h-auto`}
          >
            <div className="w-14 h-3 bg-teal-500 dark:bg-teal-600 rounded-md"></div>
            <div className="w-3 h-5 bg-teal-500 dark:bg-teal-600 rounded-b-md absolute -bottom-5 -right-1"></div>
          </div>
        )
      default:
        return null
    }
  }

  // Render mug based on style
  const renderMug = () => {
    if (buddyStyle.mugStyle === "none") return null

    const mugContent = () => {
      switch (buddyStyle.mugStyle) {
        case "tea":
          return (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-green-300 dark:bg-green-500 rounded-full">
              <div className="absolute top-0 right-1 w-1 h-1 bg-green-200 dark:bg-green-400 rounded-full"></div>
            </div>
          )
        case "cocoa":
          return (
            <>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brown-300 dark:bg-brown-500 rounded-full"></div>
              <div className="absolute top-0 left-1 w-1 h-1 bg-white dark:bg-white/80 rounded-full"></div>
              <div className="absolute top-0 right-2 w-1 h-1 bg-white dark:bg-white/80 rounded-full"></div>
            </>
          )
        default: // coffee
          return <div className="absolute top-0 left-0 w-full h-1.5 bg-white/30 dark:bg-white/20 rounded-full"></div>
      }
    }

    return (
      <div
        className={`absolute -bottom-2 -right-4 transition-transform duration-500 ${
          isMugTilting ? "transform rotate-12" : ""
        }`}
      >
        <div className="relative">
          <div className={`${sizeClasses[size].mug} bg-gradient-to-b ${buddyStyle.mugColor} rounded-b-lg`}></div>
          <div
            className={`absolute -right-2 top-1 ${sizeClasses[size].mugHandle} border-2 border-pink-400 dark:border-pink-600 rounded-full`}
          ></div>
          {mugContent()}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Llama face */}
      <div
        className={`relative ${buddyStyle.accentColor} rounded-full p-2 overflow-hidden ${sizeClasses[size].container}`}
      >
        <div className="relative z-10">
          {/* Ears */}
          <div
            className={`absolute -top-1 -left-1 ${sizeClasses[size].ear} ${buddyStyle.earColor} rounded-full transform -rotate-12`}
          ></div>
          <div
            className={`absolute -top-1 -right-1 ${sizeClasses[size].ear} ${buddyStyle.earColor} rounded-full transform rotate-12`}
          ></div>

          {/* Face */}
          <div
            className={`${sizeClasses[size].face} ${buddyStyle.faceColor} rounded-full flex items-center justify-center`}
          >
            {/* Eyes */}
            <div className={`absolute top-6 left-4 ${sizeClasses[size].eye} ${buddyStyle.eyeColor} rounded-full`}></div>
            <div
              className={`absolute top-6 right-4 ${sizeClasses[size].eye} ${buddyStyle.eyeColor} rounded-full`}
            ></div>

            {/* Blinking eyelids */}
            <div
              className={`absolute top-6 left-4 ${sizeClasses[size].eye} ${buddyStyle.faceColor} rounded-full transition-transform duration-100 ${
                isBlinking ? "transform scale-y-100" : "transform scale-y-0"
              }`}
            ></div>
            <div
              className={`absolute top-6 right-4 ${sizeClasses[size].eye} ${buddyStyle.faceColor} rounded-full transition-transform duration-100 ${
                isBlinking ? "transform scale-y-100" : "transform scale-y-0"
              }`}
            ></div>

            {/* Nose */}
            <div className={`absolute top-8 ${sizeClasses[size].nose} ${buddyStyle.noseColor} rounded-full`}></div>

            {/* Smile */}
            <div
              className={`absolute top-10 ${sizeClasses[size].smile} border-purple-900 dark:border-white rounded-full`}
            ></div>
          </div>
        </div>
      </div>

      {/* Accessories */}
      {renderAccessory()}

      {/* Mug */}
      {renderMug()}
    </div>
  )
}
