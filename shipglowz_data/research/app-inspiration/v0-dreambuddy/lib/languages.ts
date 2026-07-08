export interface Language {
  code: string
  name: string
  localName: string
}

// List of supported languages for speech recognition
export const supportedLanguages: Language[] = [
  { code: "en-US", name: "English (US)", localName: "English (US)" },
  { code: "en-GB", name: "English (UK)", localName: "English (UK)" },
  { code: "es-ES", name: "Spanish", localName: "Español" },
  { code: "fr-FR", name: "French", localName: "Français" },
  { code: "de-DE", name: "German", localName: "Deutsch" },
  { code: "it-IT", name: "Italian", localName: "Italiano" },
  { code: "pt-BR", name: "Portuguese (Brazil)", localName: "Português (Brasil)" },
  { code: "ja-JP", name: "Japanese", localName: "日本語" },
  { code: "ko-KR", name: "Korean", localName: "한국어" },
  { code: "zh-CN", name: "Chinese (Simplified)", localName: "中文 (简体)" },
  { code: "zh-TW", name: "Chinese (Traditional)", localName: "中文 (繁體)" },
  { code: "ar-SA", name: "Arabic", localName: "العربية" },
  { code: "hi-IN", name: "Hindi", localName: "हिन्दी" },
  { code: "ru-RU", name: "Russian", localName: "Русский" },
]

// Get language by code
export function getLanguageByCode(code: string): Language {
  return supportedLanguages.find((lang) => lang.code === code) || supportedLanguages[0]
}

// Get language name by code
export function getLanguageNameByCode(code: string): string {
  const language = getLanguageByCode(code)
  return language.name
}

// Get language local name by code
export function getLanguageLocalNameByCode(code: string): string {
  const language = getLanguageByCode(code)
  return language.localName
}
