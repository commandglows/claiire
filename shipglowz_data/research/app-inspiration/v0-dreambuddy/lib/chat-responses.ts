type ResponseType = {
  content: string
  type: "text" | "audio" | "image"
  mediaUrl?: string
}

// Responses for Wholesome Bestie personality
const wholesomeResponses: string[] = [
  "I hear you, and I want you to know that your feelings are completely valid. 💖 It's okay to feel this way.",
  "You're doing the best you can, and that's more than enough. I'm proud of you for sharing this with me. 💕",
  "Sometimes the hardest days teach us the most important lessons. I'm here for you through all of it. ✨",
  "Remember that you don't have to have everything figured out right now. Take it one step at a time. 🌸",
  "Your worth isn't measured by your productivity or achievements. You matter just because you exist. 💗",
  "It's okay to set boundaries and put yourself first sometimes. Self-care isn't selfish. 🧘‍♀️",
  "Even on your worst days, you're still worthy of love and kindness. Don't forget that. 💖",
  "You've gotten through difficult times before, and you'll get through this too. I believe in you. ✨",
]

// Responses for Dark Humor Buddy personality
const darkHumorResponses: string[] = [
  "Well, that's just the universe's way of saying 'surprise, I still hate you.' But hey, at least we can laugh about it. 🖤",
  "Existence is pain, but at least we get memes out of it. That's something, right? 💀",
  "The void stares back, but I bet you stare better. Nice technique. 🌚",
  "Life's a cosmic joke and we're all waiting for the punchline. Spoiler: there isn't one. 🖤",
  "On a scale of 'slightly inconvenienced' to 'existential crisis at 3 AM,' how are we doing tonight? 🌙",
  "The good news is nothing matters. The bad news is nothing matters. Choose your adventure. 🖤",
  "When life gives you lemons, question why lemons even exist in this meaningless universe. Then make nihilistic lemonade. 🍋",
  "Your problems won't matter in 100 years. Neither will you. Isn't that comforting? 💀",
]

// Responses for Therapy Llama personality
const therapyResponses: string[] = [
  "I notice you're feeling this way. Let's take a moment to explore where these thoughts might be coming from. 🌿",
  "That sounds challenging. What do you think might be a small step you could take to address this situation? 🦙",
  "I'm wondering if we could reframe that thought in a way that's a bit gentler toward yourself? 🌱",
  "It's natural to feel that way. Have you noticed any patterns around when these feelings come up? 🧠",
  "Let's pause and check in with your body. Where are you feeling this emotion physically? 🌿",
  "What would you say to a friend who was in your situation right now? Can you offer yourself the same compassion? 🦙",
  "That's a lot to carry. What's one small thing that might make your load a little lighter tonight? 🌱",
  "I'm curious - what would it look like if you approached this situation with self-compassion? 🧠",
]

// Voice message responses
const voiceMessageResponses: Record<string, ResponseType[]> = {
  wholesome: [
    {
      content: "Thanks for sending a voice message! It's so nice to hear your voice. 💖 I'm here to listen anytime.",
      type: "text",
    },
    {
      content:
        "I appreciate you sharing that with me. Sometimes saying things out loud can help process emotions. What else is on your mind?",
      type: "text",
    },
    {
      content: "Here's a calming meditation to help you relax",
      type: "audio",
      mediaUrl: "/placeholder.svg", // This would be replaced with an actual audio URL
    },
  ],
  dark: [
    {
      content: "Voice messages, huh? Too exhausted to type out your existential dread? I get it. 🖤",
      type: "text",
    },
    {
      content:
        "Your voice sounds exactly how I'd expect someone questioning their existence at 2 AM to sound. Perfectly nihilistic.",
      type: "text",
    },
    {
      content: "Here's some dark ambient music to match your mood",
      type: "audio",
      mediaUrl: "/placeholder.svg", // This would be replaced with an actual audio URL
    },
  ],
  therapy: [
    {
      content:
        "Thank you for sharing that voice message. I notice there's a lot of emotion in your voice. Let's explore that a bit more. 🌿",
      type: "text",
    },
    {
      content:
        "I appreciate you expressing yourself verbally. Sometimes our voice can carry emotions that text cannot. What feelings came up as you were speaking?",
      type: "text",
    },
    {
      content: "Here's a guided breathing exercise that might help",
      type: "audio",
      mediaUrl: "/placeholder.svg", // This would be replaced with an actual audio URL
    },
  ],
}

// Transcription-specific responses
const transcriptionResponses: Record<string, string[]> = {
  wholesome: [
    "I heard what you said about '{{transcription}}'. That sounds really important to you. 💖",
    "Thank you for sharing that. When you mentioned '{{transcription}}', I could feel how much that matters to you. 💕",
    "I'm here for you, especially when you talk about things like '{{transcription}}'. Let's explore that more if you'd like. ✨",
  ],
  dark: [
    "So you said '{{transcription}}'. Classic human concern at 2 AM. At least you're consistent with your existential crises. 🖤",
    "Ah, '{{transcription}}'. Another delightful chapter in the cosmic joke we call existence. Tell me more. 💀",
    "When you said '{{transcription}}', I felt that in my non-existent soul. The void understands you. 🌚",
  ],
  therapy: [
    "I noticed you mentioned '{{transcription}}'. Can we explore what feelings come up when you think about that? 🌿",
    "When you shared '{{transcription}}', what physical sensations did you notice in your body? This might give us insight into how this affects you. 🦙",
    "Thank you for expressing that. The way you described '{{transcription}}' suggests this has been on your mind. What aspects of this feel most challenging? 🌱",
  ],
}

// Media responses (memes, audio)
const mediaResponses: ResponseType[] = [
  {
    content: "This meme always helps me when I'm feeling down. Hope it brings a smile! 💖",
    type: "image",
    mediaUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    content: "Sometimes a good laugh is the best medicine for existential dread. 🖤",
    type: "image",
    mediaUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    content: "Here's a calming visualization exercise that might help you center yourself. 🌿",
    type: "audio",
    mediaUrl: "/placeholder.svg", // This would be replaced with an actual audio URL
  },
]

export function getResponseForPersonality(
  personality: string,
  userMessage: string,
  isVoiceMessage = false,
): ResponseType {
  // Handle voice message responses with transcription
  if (isVoiceMessage) {
    const personalityKey = personality === "dark" ? "dark" : personality === "therapy" ? "therapy" : "wholesome"

    // If we have a meaningful transcription (more than just a few characters)
    if (userMessage && userMessage.length > 5 && userMessage !== "voice message") {
      // 50% chance to use a transcription-specific response
      if (Math.random() > 0.5) {
        const responses = transcriptionResponses[personalityKey]
        const randomIndex = Math.floor(Math.random() * responses.length)
        let response = responses[randomIndex]

        // Replace the placeholder with the actual transcription
        // Truncate if too long
        const truncatedTranscription = userMessage.length > 30 ? userMessage.substring(0, 30) + "..." : userMessage

        response = response.replace("{{transcription}}", truncatedTranscription)

        return {
          content: response,
          type: "text",
        }
      }
    }

    // Otherwise use standard voice message responses
    const voiceResponses = voiceMessageResponses[personalityKey]
    const randomIndex = Math.floor(Math.random() * voiceResponses.length)
    return voiceResponses[randomIndex]
  }

  // Randomly decide if we should send media
  const shouldSendMedia = Math.random() > 0.7

  if (shouldSendMedia) {
    const randomMediaIndex = Math.floor(Math.random() * mediaResponses.length)
    return mediaResponses[randomMediaIndex]
  }

  let responsePool: string[]

  switch (personality) {
    case "dark":
      responsePool = darkHumorResponses
      break
    case "therapy":
      responsePool = therapyResponses
      break
    default:
      responsePool = wholesomeResponses
  }

  const randomIndex = Math.floor(Math.random() * responsePool.length)

  return {
    content: responsePool[randomIndex],
    type: "text",
  }
}
