// Gemeinsamer Vertrag für "Zwanzig ab" — nur Typen und Konstanten, keine Logik.

export const TRICKS_PER_ROUND = 5
export const DEFAULT_STARTING_POINTS = 20
export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 4

export type TrumpKind = 'eichel' | 'gruen' | 'schellen' | 'herz' | 'herzBlind'

/** Die vier Farben. Herz-Blind ist eine Variante von Herz, keine eigene Farbe. */
export const TRUMP_SUITS = ['eichel', 'gruen', 'schellen', 'herz'] as const

export type TrumpSuit = (typeof TRUMP_SUITS)[number]

export const TRICK_MULTIPLIER: Record<TrumpKind, number> = {
  eichel: 1,
  gruen: 1,
  schellen: 1,
  herz: 2,
  herzBlind: 4,
}

/** Nur bei Eichel besteht Mitspielzwang. */
export const FORCED_TRUMP: TrumpKind = 'eichel'

export const TRUMP_LABEL: Record<TrumpKind, string> = {
  eichel: 'Eichel',
  gruen: 'Blatt',
  schellen: 'Schellen',
  herz: 'Herz',
  herzBlind: 'Herz-Blind',
}

/** Bei diesem Punktestand oder darunter besteht Mitspielzwang. */
export const MUST_PLAY_AT_OR_BELOW = 5

/** Bei diesem Punktestand oder darunter darf zusätzlich nicht mehr getauscht werden. */
export const NO_EXCHANGE_AT_OR_BELOW = 3

/** Strafpunkte ohne Stich, vor Multiplikator. Ansager zahlt doppelt. */
export const NO_TRICK_BASE = 5
export const DECLARER_NO_TRICK_BASE = 10

export type PlayerId = string

export type Player = {
  id: PlayerId
  name: string
}

/**
 * Was passiert, wenn ein Abzug über die 0 hinausschießt:
 * 'exact' = es wird voll abgezogen, das Konto rutscht ins Minus. Sieg nur bei genau 0.
 * 'skip'  = der Abzug verfällt komplett, der Punktestand bleibt. Sieg nur bei genau 0.
 * 'cap'   = auf 0 gedeckelt, der Überschuss verfällt — und das gewinnt.
 */
export type ZeroRule = 'exact' | 'skip' | 'cap'

export const ZERO_RULES: readonly ZeroRule[] = ['exact', 'skip', 'cap']

export type Settings = {
  startingPoints: number
  zeroRule: ZeroRule
}

export const DEFAULT_SETTINGS: Settings = {
  startingPoints: DEFAULT_STARTING_POINTS,
  zeroRule: 'exact',
}

/**
 * Eingabe einer gespielten Runde.
 * participantIds = wer mitgespielt hat (Passer fehlen hier).
 * tricks nur für Mitspieler, Summe über Mitspieler = TRICKS_PER_ROUND.
 */
export type RoundInput = {
  declarerId: PlayerId
  trump: TrumpKind
  participantIds: PlayerId[]
  tricks: Record<PlayerId, number>
}

export type RoundResult = {
  input: RoundInput
  delta: Record<PlayerId, number>
  scoresAfter: Record<PlayerId, number>
}

export type GameSnapshot = {
  players: Player[]
  settings: Settings
  rounds: RoundInput[]
}

export type GamePhase = 'playing' | 'finished'

/** Aus GameSnapshot abgeleiteter, nicht persistierter Zustand. */
export type DerivedState = {
  scores: Record<PlayerId, number>
  history: RoundResult[]
  winnerIds: PlayerId[]
  phase: GamePhase
  currentVorhandIndex: number
}
