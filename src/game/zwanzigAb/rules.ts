// Regel-Engine für "Zwanzig ab" — reine Funktionen, keine React-/Window-Abhängigkeit.

import {
  DECLARER_NO_TRICK_BASE,
  FORCED_TRUMP,
  MIN_PLAYERS,
  MUST_PLAY_AT_OR_BELOW,
  NO_EXCHANGE_AT_OR_BELOW,
  NO_TRICK_BASE,
  TRICK_MULTIPLIER,
  TRICKS_PER_ROUND,
} from './types'
import type { Player, PlayerId, RoundInput, Settings, TrumpKind } from './types'

export type ValidationCode =
  | 'trickSumMismatch'
  | 'negativeTricks'
  | 'unknownDeclarer'
  | 'declarerNotParticipating'
  | 'tooFewParticipants'
  | 'eichelRequiresAll'
  | 'passerHasTricks'

export type ValidationError = {
  code: ValidationCode
  playerId?: PlayerId
  params?: Record<string, number>
}

/**
 * Prüft eine Rundeneingabe gegen die Spielregeln. Sammelt alle zutreffenden Fehler,
 * bricht nicht beim ersten ab. Leeres Array = gültig.
 *
 * Entscheidung: participantIds kann Ids enthalten, die nicht in players stehen — solche
 * Ids werden bei allen Berechnungen (Summe, Teilnehmerzahl, Eichel-Zwang) ignoriert, lösen
 * aber keinen eigenen Fehlercode aus (die UI kann das ohnehin nicht erzeugen).
 */
export function validateRound(input: RoundInput, players: Player[]): ValidationError[] {
  const errors: ValidationError[] = []
  const knownIds = new Set(players.map((p) => p.id))
  const knownParticipantIds = input.participantIds.filter((id) => knownIds.has(id))

  let sum = 0
  for (const id of knownParticipantIds) {
    const value = input.tricks[id]
    if (value === undefined) continue
    sum += value
    if (value < 0 || !Number.isInteger(value)) {
      errors.push({ code: 'negativeTricks', playerId: id })
    }
  }
  if (sum !== TRICKS_PER_ROUND) {
    errors.push({ code: 'trickSumMismatch', params: { sum, expected: TRICKS_PER_ROUND } })
  }

  if (!knownIds.has(input.declarerId)) {
    errors.push({ code: 'unknownDeclarer' })
  } else if (!input.participantIds.includes(input.declarerId)) {
    errors.push({ code: 'declarerNotParticipating' })
  }

  if (knownParticipantIds.length < MIN_PLAYERS) {
    errors.push({ code: 'tooFewParticipants', params: { min: MIN_PLAYERS } })
  }

  if (input.trump === FORCED_TRUMP && !players.every((p) => input.participantIds.includes(p.id))) {
    errors.push({ code: 'eichelRequiresAll' })
  }

  for (const player of players) {
    if (!input.participantIds.includes(player.id) && (input.tricks[player.id] ?? 0) > 0) {
      errors.push({ code: 'passerHasTricks', playerId: player.id })
    }
  }

  return errors
}

type PlayerDeltaArgs = {
  tricks: number
  isParticipant: boolean
  isDeclarer: boolean
  trump: TrumpKind
  scoreBefore: number
  settings: Settings
}

/** Berechnet das Punkte-Delta eines einzelnen Spielers für eine Runde. */
export function playerDelta(args: PlayerDeltaArgs): number {
  const m = TRICK_MULTIPLIER[args.trump]

  if (!args.isParticipant) return 0

  if (args.tricks === 0) {
    return (args.isDeclarer ? DECLARER_NO_TRICK_BASE : NO_TRICK_BASE) * m
  }

  const raw = args.tricks * m

  // 'cap': höchstens bis auf 0, der Überschuss verfällt — das gewinnt.
  if (args.settings.zeroRule === 'cap') {
    return -Math.min(raw, args.scoreBefore)
  }
  // 'skip': passt der Abzug nicht genau, verfällt er ganz und der Stand bleibt.
  if (args.settings.zeroRule === 'skip') {
    return args.scoreBefore - raw >= 0 ? -raw : 0
  }
  // 'exact': es wird immer voll abgezogen, auch unter 0 hinaus. Gewonnen hat nur, wer
  // genau auf 0 landet — aus dem Minus kommt man ausschließlich über Strafpunkte heraus.
  return -raw
}

/** Wendet eine Runde auf alle Spieler an. scoreBefore ist je Spieler der Stand vor der Runde. */
export function applyRound(
  scores: Record<PlayerId, number>,
  input: RoundInput,
  players: Player[],
  settings: Settings,
): { delta: Record<PlayerId, number>; scoresAfter: Record<PlayerId, number> } {
  const delta: Record<PlayerId, number> = {}
  const scoresAfter: Record<PlayerId, number> = {}

  for (const player of players) {
    const scoreBefore = scores[player.id] ?? 0
    const d = playerDelta({
      tricks: input.tricks[player.id] ?? 0,
      isParticipant: input.participantIds.includes(player.id),
      isDeclarer: player.id === input.declarerId,
      trump: input.trump,
      scoreBefore,
      settings,
    })
    delta[player.id] = d
    scoresAfter[player.id] = scoreBefore + d
  }

  return { delta, scoresAfter }
}

/**
 * Index der Vorhand in players für die gegebene Rundennummer. Robust gegen playerCount <= 0.
 *
 * In Runde 0 teilt der erste Spieler aus — die Eingabereihenfolge der Namen ist die
 * Sitzreihenfolge im Uhrzeigersinn, und ausgeteilt wird an den Nachbarn zur Rechten.
 * Vorhand ist deshalb der zweite Spieler, und beide rücken mit jeder Runde einen weiter.
 */
export function vorhandIndex(roundNumber: number, playerCount: number): number {
  if (playerCount <= 0) return 0
  return (roundNumber + 1) % playerCount
}

/**
 * Sonderregeln nach Punktestand. Beide hängen allein am Stand des Spielers, nicht am
 * Rundenverlauf — deshalb stehen sie hier und nicht in einer einzelnen Seite: Trumpfwahl
 * und Stiche-Eingabe zeigen dieselben Symbole und müssen dieselbe Schwelle benutzen.
 * Ein fehlender Stand zählt als 0, also als strengster Fall.
 */
export function mustPlay(score: number | undefined): boolean {
  return (score ?? 0) <= MUST_PLAY_AT_OR_BELOW
}

export function noExchange(score: number | undefined): boolean {
  return (score ?? 0) <= NO_EXCHANGE_AT_OR_BELOW
}
