// Ergebnisse beendeter Spiele. Bewusst schmal: nur was Bilanz und Historie brauchen,
// nicht der ganze Spielverlauf.

const RESULTS_KEY = 'zwanzig-ab:results'
const MAX_RESULTS = 200

export type GameResult = {
  /** ISO-Zeitpunkt, an dem das Spiel beendet wurde. */
  finishedAt: string
  winnerNames: string[]
  playerNames: string[]
}

function isResult(value: unknown): value is GameResult {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Record<string, unknown>
  return (
    typeof entry.finishedAt === 'string' &&
    Array.isArray(entry.winnerNames) &&
    entry.winnerNames.every((name) => typeof name === 'string') &&
    Array.isArray(entry.playerNames) &&
    entry.playerNames.every((name) => typeof name === 'string')
  )
}

/** Nie werfen: fehlender Speicher oder kaputte Daten ergeben eine leere Liste. */
export function loadResults(): GameResult[] {
  try {
    const raw = globalThis.localStorage?.getItem(RESULTS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isResult) : []
  } catch {
    return []
  }
}

/** Neuestes zuerst, ältestes fällt hinten raus. */
export function saveResult(result: GameResult): void {
  try {
    const next = [result, ...loadResults()].slice(0, MAX_RESULTS)
    globalThis.localStorage?.setItem(RESULTS_KEY, JSON.stringify(next))
  } catch {
    // Ohne Speicher bleibt die Bilanz eben leer.
  }
}

/**
 * Streicht einen Spieler aus allen Ergebnissen. Der Name wird aus Sieger- und
 * Teilnehmerlisten entfernt; Einträge ohne verbleibenden Sieger fallen ganz weg.
 * Andere Spieler behalten dadurch ihre Siege aus denselben Partien.
 */
export function forgetPlayer(name: string): void {
  const key = name.trim().toLowerCase()
  const keep = (entry: string) => entry.trim().toLowerCase() !== key

  try {
    const next = loadResults()
      .map((result) => ({
        ...result,
        winnerNames: result.winnerNames.filter(keep),
        playerNames: result.playerNames.filter(keep),
      }))
      .filter((result) => result.winnerNames.length > 0)
    globalThis.localStorage?.setItem(RESULTS_KEY, JSON.stringify(next))
  } catch {
    // Ohne Speicher gibt es auch nichts zu vergessen.
  }
}

export type RankingEntry = {
  name: string
  wins: number
}

/**
 * Siege je Name. Zusammengefasst wird über den normalisierten Namen, weil es keine
 * dauerhafte Spielerverwaltung gibt — "Max" und "max" sind derselbe Spieler.
 */
export function winRanking(results: GameResult[]): RankingEntry[] {
  const byName = new Map<string, RankingEntry>()

  for (const result of results) {
    for (const name of result.winnerNames) {
      const key = name.trim().toLowerCase()
      if (key === '') continue
      const known = byName.get(key)
      if (known) known.wins += 1
      else byName.set(key, { name: name.trim(), wins: 1 })
    }
  }

  return [...byName.values()].sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name))
}
