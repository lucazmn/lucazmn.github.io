// Dauerhafte Einstellungen. Sie gelten für das nächste gestartete Spiel; ein laufendes
// Spiel behält die Einstellungen, mit denen es begonnen wurde.

import { DEFAULT_SETTINGS, ZERO_RULES } from './types'
import type { Settings, ZeroRule } from './types'

const SETTINGS_KEY = 'zwanzig-ab:settings'

/** Nie werfen: fehlender Storage, kaputtes JSON oder fremde Daten ergeben die Standardwerte. */
export function loadSettings(): Settings {
  try {
    const raw = globalThis.localStorage?.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_SETTINGS

    const value = parsed as Record<string, unknown>
    return {
      startingPoints:
        typeof value.startingPoints === 'number' && value.startingPoints > 0
          ? value.startingPoints
          : DEFAULT_SETTINGS.startingPoints,
      zeroRule: ZERO_RULES.includes(value.zeroRule as ZeroRule)
        ? (value.zeroRule as ZeroRule)
        : DEFAULT_SETTINGS.zeroRule,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

/** Nie werfen: Safari im privaten Modus wirft schon beim Schreiben. */
export function saveSettings(settings: Settings): void {
  try {
    globalThis.localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // Ohne Speicher gelten die Einstellungen eben nur bis zum Neuladen.
  }
}
