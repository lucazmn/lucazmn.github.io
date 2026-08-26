// Faltet die Rundenliste zu Punktestand, Historie, Sieger und Spielphase.
// Die Rundenliste (GameSnapshot.rounds) ist die einzige Quelle der Wahrheit — dieser Fold
// leitet daraus bei jedem Aufruf einen frischen DerivedState ab.

import { applyRound, vorhandIndex } from './rules'
import type { DerivedState, GameSnapshot, PlayerId, RoundResult } from './types'

export function replayGame(snapshot: GameSnapshot): DerivedState {
  const { players, settings, rounds } = snapshot

  const scores: Record<PlayerId, number> = {}
  for (const player of players) {
    scores[player.id] = settings.startingPoints
  }

  const history: RoundResult[] = []
  let roundsPlayed = 0

  for (const round of rounds) {
    const { delta, scoresAfter } = applyRound(scores, round, players, settings)
    history.push({ input: round, delta, scoresAfter })
    Object.assign(scores, scoresAfter)
    roundsPlayed += 1

    // Sobald jemand bei 0 steht, ist das Spiel vorbei — weitere Runden werden ignoriert.
    if (players.some((p) => scores[p.id] === 0)) break
  }

  const winnerIds = players.filter((p) => scores[p.id] === 0).map((p) => p.id)
  const phase = winnerIds.length > 0 ? 'finished' : 'playing'
  const currentVorhandIndex = vorhandIndex(roundsPlayed, players.length)

  return { scores, history, winnerIds, phase, currentVorhandIndex }
}
