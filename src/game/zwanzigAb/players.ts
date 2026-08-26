// Dauerhafter Namens-Pool: die zuletzt benutzten Spielernamen, damit man sie an einem
// Spieleabend nicht jedes Mal neu tippen muss.

const NAMES_KEY = 'zwanzig-ab:names'

export type StoredName = {
  name: string
  /** ISO-Zeitpunkt der letzten Verwendung — bestimmt die Reihenfolge im Pool. */
  lastPlayed: string
}

function isStoredName(value: unknown): value is StoredName {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return typeof entry.name === 'string' && typeof entry.lastPlayed === 'string'
}

/** Nie werfen: fehlender Storage, kaputtes JSON oder fremde Daten ergeben eine leere Liste. */
export function loadNames(): StoredName[] {
  try {
    const raw = globalThis.localStorage?.getItem(NAMES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isStoredName) : []
  } catch {
    return []
  }
}

/** Nie werfen: Safari im privaten Modus wirft schon beim Schreiben. */
export function saveNames(entries: StoredName[]): void {
  try {
    globalThis.localStorage?.setItem(NAMES_KEY, JSON.stringify(entries))
  } catch {
    // Ohne Speicher lebt der Pool eben nur bis zum Neuladen.
  }
}
