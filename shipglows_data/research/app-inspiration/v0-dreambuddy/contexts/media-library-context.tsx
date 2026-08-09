"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type MediaCategory = "memes" | "calming" | "motivation" | "comfort" | "sleep" | "anxiety" | "quotes" | "personal"

export type MediaType = "image" | "audio" | "gif"

export type MediaMood = "sad" | "anxious" | "overwhelmed" | "lonely" | "tired" | "hopeful" | "reflective"

export type MediaItem = {
  id: string
  title: string
  description?: string
  type: MediaType
  category: MediaCategory
  url: string
  thumbnail?: string
  moods: MediaMood[]
  tags: string[]
  duration?: number // for audio
  createdAt: string
  isFavorite?: boolean
  isUserUploaded?: boolean
  localFile?: boolean // Indicates if the file is stored locally
}

type MediaLibraryContextType = {
  mediaItems: MediaItem[]
  favorites: string[]
  recentlyUsed: string[]
  getMediaByCategory: (category: MediaCategory) => MediaItem[]
  getMediaByMood: (mood: MediaMood) => MediaItem[]
  getMediaByType: (type: MediaType) => MediaItem[]
  getMediaById: (id: string) => MediaItem | undefined
  toggleFavorite: (id: string) => void
  addToRecentlyUsed: (id: string) => void
  searchMedia: (query: string) => MediaItem[]
  getRandomMediaForMood: (mood: MediaMood) => MediaItem | undefined
  addUserMedia: (media: Omit<MediaItem, "id" | "createdAt">) => string
  deleteUserMedia: (id: string) => void
  getUserUploadedMedia: () => MediaItem[]
}

const defaultMediaLibraryContext: MediaLibraryContextType = {
  mediaItems: [],
  favorites: [],
  recentlyUsed: [],
  getMediaByCategory: () => [],
  getMediaByMood: () => [],
  getMediaByType: () => [],
  getMediaById: () => undefined,
  toggleFavorite: () => {},
  addToRecentlyUsed: () => {},
  searchMedia: () => [],
  getRandomMediaForMood: () => undefined,
  addUserMedia: () => "",
  deleteUserMedia: () => {},
  getUserUploadedMedia: () => [],
}

const MediaLibraryContext = createContext<MediaLibraryContextType>(defaultMediaLibraryContext)

export const useMediaLibrary = () => useContext(MediaLibraryContext)

// Initial media library data
const initialMediaItems: MediaItem[] = [
  // Memes
  {
    id: "meme-1",
    title: "Self-Care Reminder",
    description: "A gentle reminder that it's okay to take care of yourself",
    type: "image",
    category: "memes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["overwhelmed", "tired"],
    tags: ["self-care", "reminder", "gentle"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meme-2",
    title: "You're Doing Great",
    description: "Supportive meme for when you need encouragement",
    type: "image",
    category: "memes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "anxious", "overwhelmed"],
    tags: ["encouragement", "support", "positive"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meme-3",
    title: "Overthinking Be Like",
    description: "Humorous take on overthinking spirals",
    type: "image",
    category: "memes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["anxious", "overwhelmed"],
    tags: ["overthinking", "humor", "relatable"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meme-4",
    title: "Emotional Support Cat",
    description: "Cute cat offering emotional support",
    type: "image",
    category: "memes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "lonely"],
    tags: ["cats", "cute", "support"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "meme-5",
    title: "This Too Shall Pass",
    description: "Reminder that difficult feelings are temporary",
    type: "image",
    category: "memes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "anxious", "overwhelmed"],
    tags: ["temporary", "hope", "perspective"],
    createdAt: new Date().toISOString(),
  },

  // Calming audio
  {
    id: "audio-1",
    title: "Gentle Rain Sounds",
    description: "Soothing rain sounds to help you relax",
    type: "audio",
    category: "calming",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg?height=200&width=200",
    moods: ["anxious", "overwhelmed"],
    tags: ["nature", "rain", "relaxation"],
    duration: 180, // 3 minutes
    createdAt: new Date().toISOString(),
  },
  {
    id: "audio-2",
    title: "Guided Breathing Exercise",
    description: "Simple breathing exercise to reduce anxiety",
    type: "audio",
    category: "anxiety",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg?height=200&width=200",
    moods: ["anxious", "overwhelmed"],
    tags: ["breathing", "exercise", "guided"],
    duration: 120, // 2 minutes
    createdAt: new Date().toISOString(),
  },
  {
    id: "audio-3",
    title: "Gentle Piano Melody",
    description: "Soft piano music to calm your mind",
    type: "audio",
    category: "calming",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg?height=200&width=200",
    moods: ["sad", "reflective"],
    tags: ["music", "piano", "melody"],
    duration: 240, // 4 minutes
    createdAt: new Date().toISOString(),
  },
  {
    id: "audio-4",
    title: "5-Minute Meditation",
    description: "Quick meditation for when you need to center yourself",
    type: "audio",
    category: "anxiety",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg?height=200&width=200",
    moods: ["anxious", "overwhelmed"],
    tags: ["meditation", "mindfulness", "quick"],
    duration: 300, // 5 minutes
    createdAt: new Date().toISOString(),
  },

  // Motivational content
  {
    id: "motivation-1",
    title: "You've Got This",
    description: "Motivational image for difficult times",
    type: "image",
    category: "motivation",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "overwhelmed", "hopeful"],
    tags: ["motivation", "encouragement", "positive"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "motivation-2",
    title: "One Step at a Time",
    description: "Reminder to take things slowly",
    type: "image",
    category: "motivation",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["overwhelmed", "anxious"],
    tags: ["pace", "steps", "progress"],
    createdAt: new Date().toISOString(),
  },

  // Comfort content
  {
    id: "comfort-1",
    title: "Cozy Vibes",
    description: "Warm and cozy scene to bring comfort",
    type: "image",
    category: "comfort",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "lonely", "tired"],
    tags: ["cozy", "warm", "comfort"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "comfort-2",
    title: "Digital Hug",
    description: "When you need a hug but no one's around",
    type: "gif",
    category: "comfort",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "lonely"],
    tags: ["hug", "support", "care"],
    createdAt: new Date().toISOString(),
  },

  // Sleep aid
  {
    id: "sleep-1",
    title: "Night Sky",
    description: "Peaceful night sky to help you drift off",
    type: "image",
    category: "sleep",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["tired", "reflective"],
    tags: ["night", "stars", "peaceful"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "sleep-2",
    title: "Sleep Meditation",
    description: "Gentle meditation to help you fall asleep",
    type: "audio",
    category: "sleep",
    url: "/placeholder.svg",
    thumbnail: "/placeholder.svg?height=200&width=200",
    moods: ["tired", "anxious"],
    tags: ["sleep", "meditation", "relaxation"],
    duration: 600, // 10 minutes
    createdAt: new Date().toISOString(),
  },

  // Quotes
  {
    id: "quote-1",
    title: "Growth Quote",
    description: "Quote about personal growth through difficult times",
    type: "image",
    category: "quotes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["reflective", "hopeful"],
    tags: ["growth", "quote", "wisdom"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "quote-2",
    title: "Self-Compassion Quote",
    description: "Quote about being kind to yourself",
    type: "image",
    category: "quotes",
    url: "/placeholder.svg?height=400&width=400",
    moods: ["sad", "overwhelmed"],
    tags: ["self-compassion", "quote", "kindness"],
    createdAt: new Date().toISOString(),
  },
]

export function MediaLibraryProvider({ children }: { children: React.ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMediaItems)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([])

  // Load user media, favorites and recently used from localStorage
  useEffect(() => {
    try {
      // Load user uploaded media
      const savedUserMedia = localStorage.getItem("dreambuddy-user-media")
      if (savedUserMedia) {
        const userMedia = JSON.parse(savedUserMedia) as MediaItem[]
        setMediaItems((prev) => [...prev, ...userMedia])
      }

      // Load favorites
      const savedFavorites = localStorage.getItem("dreambuddy-media-favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }

      // Load recently used
      const savedRecentlyUsed = localStorage.getItem("dreambuddy-media-recent")
      if (savedRecentlyUsed) {
        setRecentlyUsed(JSON.parse(savedRecentlyUsed))
      }

      // Update media items with favorite status
      if (savedFavorites) {
        const favs = JSON.parse(savedFavorites) as string[]
        setMediaItems((prev) =>
          prev.map((item) => ({
            ...item,
            isFavorite: favs.includes(item.id),
          })),
        )
      }
    } catch (error) {
      console.error("Error loading media preferences:", error)
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("dreambuddy-media-favorites", JSON.stringify(favorites))

      // Update media items with favorite status
      setMediaItems((prev) =>
        prev.map((item) => ({
          ...item,
          isFavorite: favorites.includes(item.id),
        })),
      )
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }, [favorites])

  // Save recently used to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("dreambuddy-media-recent", JSON.stringify(recentlyUsed))
    } catch (error) {
      console.error("Error saving recently used:", error)
    }
  }, [recentlyUsed])

  // Save user uploaded media to localStorage when they change
  useEffect(() => {
    try {
      const userMedia = mediaItems.filter((item) => item.isUserUploaded)
      localStorage.setItem("dreambuddy-user-media", JSON.stringify(userMedia))
    } catch (error) {
      console.error("Error saving user media:", error)
    }
  }, [mediaItems])

  const getMediaByCategory = (category: MediaCategory) => {
    return mediaItems.filter((item) => item.category === category)
  }

  const getMediaByMood = (mood: MediaMood) => {
    return mediaItems.filter((item) => item.moods.includes(mood))
  }

  const getMediaByType = (type: MediaType) => {
    return mediaItems.filter((item) => item.type === type)
  }

  const getMediaById = (id: string) => {
    return mediaItems.find((item) => item.id === id)
  }

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const addToRecentlyUsed = (id: string) => {
    // Remove if already exists to avoid duplicates
    const filtered = recentlyUsed.filter((recentId) => recentId !== id)
    // Add to beginning of array (most recent first)
    const updated = [id, ...filtered]
    // Limit to 10 items
    setRecentlyUsed(updated.slice(0, 10))
  }

  const searchMedia = (query: string) => {
    if (!query.trim()) return []

    const lowercaseQuery = query.toLowerCase()
    return mediaItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        (item.description && item.description.toLowerCase().includes(lowercaseQuery)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
        item.category.toLowerCase().includes(lowercaseQuery) ||
        item.moods.some((mood) => mood.toLowerCase().includes(lowercaseQuery))
      )
    })
  }

  const getRandomMediaForMood = (mood: MediaMood) => {
    const matchingMedia = getMediaByMood(mood)
    if (matchingMedia.length === 0) return undefined

    const randomIndex = Math.floor(Math.random() * matchingMedia.length)
    return matchingMedia[randomIndex]
  }

  const addUserMedia = (media: Omit<MediaItem, "id" | "createdAt">) => {
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newMedia: MediaItem = {
      ...media,
      id,
      createdAt: new Date().toISOString(),
      isUserUploaded: true,
    }

    setMediaItems((prev) => [...prev, newMedia])
    return id
  }

  const deleteUserMedia = (id: string) => {
    // Only allow deletion of user-uploaded media
    const mediaToDelete = mediaItems.find((item) => item.id === id)
    if (!mediaToDelete || !mediaToDelete.isUserUploaded) return

    // If the media has a local file URL, revoke it
    if (mediaToDelete.localFile && mediaToDelete.url.startsWith("blob:")) {
      URL.revokeObjectURL(mediaToDelete.url)
      if (mediaToDelete.thumbnail && mediaToDelete.thumbnail.startsWith("blob:")) {
        URL.revokeObjectURL(mediaToDelete.thumbnail)
      }
    }

    // Remove from media items
    setMediaItems((prev) => prev.filter((item) => item.id !== id))

    // Remove from favorites if present
    if (favorites.includes(id)) {
      setFavorites((prev) => prev.filter((favId) => favId !== id))
    }

    // Remove from recently used if present
    if (recentlyUsed.includes(id)) {
      setRecentlyUsed((prev) => prev.filter((recentId) => recentId !== id))
    }
  }

  const getUserUploadedMedia = () => {
    return mediaItems.filter((item) => item.isUserUploaded)
  }

  return (
    <MediaLibraryContext.Provider
      value={{
        mediaItems,
        favorites,
        recentlyUsed,
        getMediaByCategory,
        getMediaByMood,
        getMediaByType,
        getMediaById,
        toggleFavorite,
        addToRecentlyUsed,
        searchMedia,
        getRandomMediaForMood,
        addUserMedia,
        deleteUserMedia,
        getUserUploadedMedia,
      }}
    >
      {children}
    </MediaLibraryContext.Provider>
  )
}
