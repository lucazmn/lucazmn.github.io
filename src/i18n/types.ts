// Typen für das Mini-i18n-Modul. de.ts ist die Referenz — alle anderen Sprachen
// werden von ihrer Form (Struktur + Plural/String je Key) abgeleitet.
import type { de } from './locales/de'

export type PluralForms = { one: string; other: string }

export type TranslationKey = keyof typeof de

// Pro Key exakt die Form von de übernehmen: hat de dort PluralForms, muss die
// Übersetzung ebenfalls PluralForms sein (nicht bloß string), und umgekehrt.
// Fehlt ein Key oder ist einer zu viel, meckert tsc.
export type Translation = { [K in TranslationKey]: (typeof de)[K] extends PluralForms ? PluralForms : string }
