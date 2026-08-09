"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type AutoDeletePeriod = "never" | "24h" | "7d" | "30d"

type PrivacyContextType = {
  autoDeletePeriod: AutoDeletePeriod
  setAutoDeletePeriod: (period: AutoDeletePeriod) => void
  incognitoMode: boolean
  toggleIncognitoMode: () => void
  savePrivacySettings: () => void
  clearAllConversations: () => void
  exportConversations: () => void
  lastClearedAt: string | null
  setLastClearedAt: (date: string | null) => void
}

const defaultPrivacySettings: PrivacyContextType = {
  autoDeletePeriod: "never",
  setAutoDeletePeriod: () => {},
  incognitoMode: false,
  toggleIncognitoMode: () => {},
  savePrivacySettings: () => {},
  clearAllConversations: () => {},
  exportConversations: () => {},
  lastClearedAt: null,
  setLastClearedAt: () => {},
}

const PrivacyContext = createContext<PrivacyContextType>(defaultPrivacySettings)

export const usePrivacy = () => useContext(PrivacyContext)

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [autoDeletePeriod, setAutoDeletePeriod] = useState<AutoDeletePeriod>("never")
  const [incognitoMode, setIncognitoMode] = useState(false)
  const [lastClearedAt, setLastClearedAt] = useState<string | null>(null)

  // Load privacy settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("dreambuddy-privacy")
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings)
        setAutoDeletePeriod(parsedSettings.autoDeletePeriod || "never")
        setIncognitoMode(parsedSettings.incognitoMode || false)
        setLastClearedAt(parsedSettings.lastClearedAt || null)
      }
    } catch (error) {
      console.error("Error loading privacy settings:", error)
    }
  }, [])

  const toggleIncognitoMode = () => {
    setIncognitoMode((prev) => !prev)
  }

  const savePrivacySettings = () => {
    try {
      localStorage.setItem(
        "dreambuddy-privacy",
        JSON.stringify({
          autoDeletePeriod,
          incognitoMode,
          lastClearedAt,
        }),
      )
    } catch (error) {
      console.error("Error saving privacy settings:", error)
    }
  }

  // Clear all conversations from localStorage
  const clearAllConversations = () => {
    try {
      // Clear conversations from localStorage
      localStorage.removeItem("dreambuddy-conversations")

      // Update last cleared timestamp
      const now = new Date().toISOString()
      setLastClearedAt(now)

      // Trigger a custom event that components can listen for
      window.dispatchEvent(new CustomEvent("dreambuddy-conversations-cleared"))

      // Save updated settings
      savePrivacySettings()
    } catch (error) {
      console.error("Error clearing conversations:", error)
    }
  }

  // Export conversations as JSON file
  const exportConversations = () => {
    try {
      const conversations = localStorage.getItem("dreambuddy-conversations")
      if (!conversations) {
        alert("No conversations to export")
        return
      }

      // Create a blob with the conversations data
      const blob = new Blob([conversations], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      // Create a download link and trigger it
      const a = document.createElement("a")
      a.href = url
      a.download = `dreambuddy-conversations-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // Clean up
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting conversations:", error)
    }
  }

  // Save settings whenever they change
  useEffect(() => {
    savePrivacySettings()
  }, [autoDeletePeriod, incognitoMode, lastClearedAt])

  return (
    <PrivacyContext.Provider
      value={{
        autoDeletePeriod,
        setAutoDeletePeriod,
        incognitoMode,
        toggleIncognitoMode,
        savePrivacySettings,
        clearAllConversations,
        exportConversations,
        lastClearedAt,
        setLastClearedAt,
      }}
    >
      {children}
    </PrivacyContext.Provider>
  )
}
