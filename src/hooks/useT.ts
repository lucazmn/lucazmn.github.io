import { useContext } from 'react'
import { LanguageContext } from '../i18n/context'
import { de } from '../i18n/locales/de'
import { en } from '../i18n/locales/en'
import { translate } from '../i18n/translate'
import type { TranslateParams } from '../i18n/translate'
import type { TranslationKey } from '../i18n/types'

const DICTS = { de, en }

export function useT() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT() muss innerhalb eines LanguageProvider verwendet werden')
  const { lang, setLang } = ctx

  const t = (key: TranslationKey, params?: TranslateParams) => translate(DICTS[lang], lang, key, params)

  return { t, lang, setLang }
}
