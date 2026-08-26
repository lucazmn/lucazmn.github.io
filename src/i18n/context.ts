// Nur Context-Objekt und Typen, kein JSX — sonst meckert react/only-export-components.
import { createContext } from 'react'

export type Language = 'de' | 'en'

export type LanguageContextValue = {
  lang: Language
  setLang: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextValue | null>(null)
