"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supportedLanguages } from "@/lib/languages"

type SettingsContextType = {
  transcriptionEnabled: boolean
  toggleTranscription: () => void
  transcriptionLanguage: string
  setTranscriptionLanguage: (language: string) => void
  autoDetectLanguage: boolean
  toggleAutoDetectLanguage: () => void
  saveSettings: () => void
}

const defaultSettings: SettingsContextType = {
  transcriptionEnabled: true,
  toggleTranscription: () => {},
  transcriptionLanguage: "en-US",
  setTranscriptionLanguage: () => {},
  autoDetectLanguage: false,
  toggleAutoDetectLanguage: () => {},
  saveSettings: () => {},
}

const SettingsContext = createContext<SettingsContextType>(defaultSettings)

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(true)
  const [transcriptionLanguage, setTranscriptionLanguage] = useState("en-US")
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("dreambuddy-settings")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setTranscriptionEnabled(parsedSettings.transcriptionEnabled ?? true)
        setAutoDetectLanguage(parsedSettings.autoDetectLanguage ?? false)

        // Validate language code before setting it
        const langCode = parsedSettings.transcriptionLanguage
        if (langCode && supportedLanguages.some((lang) => lang.code === langCode)) {
          setTranscriptionLanguage(langCode)
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }, [])

  const toggleTranscription = () => {
    setTranscriptionEnabled((prev) => !prev)
  }

  const toggleAutoDetectLanguage = () => {
    setAutoDetectLanguage((prev) => !prev)
  }

  const saveSettings = () => {
    try {
      localStorage.setItem(
        "dreambuddy-settings",
        JSON.stringify({
          transcriptionEnabled,
          transcriptionLanguage,
          autoDetectLanguage,
        }),
      )
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  // Save settings whenever they change
  useEffect(() => {
    saveSettings()
  }, [transcriptionEnabled, transcriptionLanguage, autoDetectLanguage])

  return (
    <SettingsContext.Provider
      value={{
        transcriptionEnabled,
        toggleTranscription,
        transcriptionLanguage,
        setTranscriptionLanguage,
        autoDetectLanguage,
        toggleAutoDetectLanguage,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
