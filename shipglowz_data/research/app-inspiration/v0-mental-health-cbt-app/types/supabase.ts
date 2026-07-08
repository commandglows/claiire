export type MoodEntry = {
  id: number
  created_at: string
  user_id: string
  mood: string
  context: string
}

export type JournalEntry = {
  id: number
  created_at: string
  user_id: string
  entry: string
  prompt: string
}

export type ThoughtEntry = {
  id: number
  created_at: string
  user_id: string
  situation: string
  automaticThoughts: string
  emotions: string
  distortion: string
  evidenceFor: string
  evidenceAgainst: string
  alternativeThought: string
  newEmotion: string
}

