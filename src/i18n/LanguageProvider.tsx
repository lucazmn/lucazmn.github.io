import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language } from './context'
import { LanguageContext } from './context'

const STORAGE_KEY = 'zwanzig-ab:lang'

function detectDefaultLanguage(): Language {
  return navigator.language.startsWith('de') ? 'de' : 'en'
}

function readStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'de' || stored === 'en' ? stored : null
  } catch {
    // Safari im privaten Modus wirft beim Lesen/Schreiben von localStorage.
    return null
  }
}

function writeStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Kein Speicherplatz oder privater Modus — ignorieren, Sprache bleibt im State.
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => readStoredLanguage() ?? detectDefaultLanguage())

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: Language) => {
    setLangState(next)
    writeStoredLanguage(next)
  }, [])

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>
}
