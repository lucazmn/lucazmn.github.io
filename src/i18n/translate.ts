// Reine Übersetzungsfunktion, kein React.
import type { Language } from './context'
import type { PluralForms, Translation, TranslationKey } from './types'

export type TranslateParams = Record<string, string | number> & { count?: number }

function isPluralForms(value: string | PluralForms): value is PluralForms {
  return typeof value !== 'string'
}

function interpolate(text: string, params?: TranslateParams): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}

export function translate(
  dict: Translation,
  lang: Language,
  key: TranslationKey,
  params?: TranslateParams,
): string {
  const entry = dict[key]
  if (entry === undefined) return key

  if (isPluralForms(entry)) {
    if (params?.count === undefined) return interpolate(entry.other, params)
    const form = new Intl.PluralRules(lang).select(params.count)
    const text = form === 'one' ? entry.one : entry.other
    return interpolate(text, params)
  }

  return interpolate(entry, params)
}
