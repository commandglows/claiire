import { supportedLanguages, type Language } from "./languages"

// List of language codes for auto-detection
// These are the language codes that the Web Speech API supports for auto-detection
const autoDetectLanguages = [
  "en-US", // English (US)
  "en-GB", // English (UK)
  "es-ES", // Spanish
  "fr-FR", // French
  "de-DE", // German
  "it-IT", // Italian
  "pt-BR", // Portuguese (Brazil)
  "ja-JP", // Japanese
  "ko-KR", // Korean
  "zh-CN", // Chinese (Simplified)
  "zh-TW", // Chinese (Traditional)
  "ru-RU", // Russian
  "ar-SA", // Arabic
  "hi-IN", // Hindi
]

// Function to get a list of languages for auto-detection
export function getAutoDetectLanguages(): string[] {
  // Filter supported languages to only include those that are in the autoDetectLanguages list
  return autoDetectLanguages.filter((langCode) =>
    supportedLanguages.some((supportedLang) => supportedLang.code === langCode),
  )
}

// Function to check if a language was detected with high confidence
export function isConfidentLanguageDetection(
  results: SpeechRecognitionResultList,
  minConfidence = 0.5,
): { isConfident: boolean; detectedLanguage?: string } {
  // Check if we have any results
  if (results.length === 0) {
    return { isConfident: false }
  }

  // Get the most recent result
  const result = results[results.length - 1]

  // Check if the result has a language property (Chrome-specific)
  if ("lang" in result && typeof result.lang === "string" && result.lang) {
    return { isConfident: true, detectedLanguage: result.lang }
  }

  // For browsers that don't provide the language directly,
  // we can check if the confidence of the first alternative is high enough
  if (result[0] && result[0].confidence > minConfidence) {
    // We don't know the language, but the recognition is confident
    return { isConfident: true }
  }

  return { isConfident: false }
}

// Function to find the best matching supported language for a detected language code
export function findBestMatchingLanguage(detectedCode: string): Language {
  // Try to find an exact match first
  const exactMatch = supportedLanguages.find((lang) => lang.code === detectedCode)
  if (exactMatch) {
    return exactMatch
  }

  // If no exact match, try to match just the language part (e.g., "en" from "en-US")
  const languagePart = detectedCode.split("-")[0]
  const languageMatch = supportedLanguages.find((lang) => lang.code.startsWith(languagePart + "-"))
  if (languageMatch) {
    return languageMatch
  }

  // If no match at all, return English as default
  return supportedLanguages[0] // English (US)
}
