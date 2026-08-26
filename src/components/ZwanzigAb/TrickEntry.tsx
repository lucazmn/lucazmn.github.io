import { useState } from 'react'
import { useT } from '../../hooks/useT'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from './Icon'
import { PlayerBadges } from './PlayerBadges'
import styles from './screen.module.css'
import { replayGame } from '../../game/zwanzigAb/replay'
import { mustPlay, validateRound } from '../../game/zwanzigAb/rules'
import type { ValidationError } from '../../game/zwanzigAb/rules'
import type { TranslationKey } from '../../i18n/types'
import {
  FORCED_TRUMP,
  MIN_PLAYERS,
  TRICKS_PER_ROUND,
  TRUMP_LABEL,
} from '../../game/zwanzigAb/types'
import type { GameSnapshot, PlayerId, RoundInput, TrumpKind } from '../../game/zwanzigAb/types'

type TrickEntryProps = {
  game: GameSnapshot
  trump: TrumpKind
  /** Bereits eingetragene Runde, damit ein Zurück die Eingaben nicht wegwirft. */
  draft: RoundInput | null
  onNext: (input: RoundInput) => void
  /** Kopfzeile: verlässt den Flow ins Hauptmenü. */
  onMenu: () => void
  /** Pfeil: zurück zur Trumpfwahl, mit den bisherigen Eingaben. */
  onStepBack: (input: RoundInput) => void
  onOpenHistory: () => void
}

export function TrickEntry({
  game,
  trump,
  draft,
  onNext,
  onMenu,
  onStepBack,
  onOpenHistory,
}: TrickEntryProps) {
  const { t } = useT()

  // Der Weg aus dem laufenden Spiel heraus wird einmal bestätigt.
  const [askMenu, setAskMenu] = useState(false)

  const { currentVorhandIndex, scores } = replayGame(game)
  const vorhandId = game.players[currentVorhandIndex]?.id
  // Alle liegen fest, wenn Eichel Mitspielzwang erzwingt — oder wenn ohnehin nur die
  // Mindestbesetzung am Tisch sitzt, denn unter zwei Mitspieler geht es nicht.
  const allFixed = trump === FORCED_TRUMP || game.players.length <= MIN_PLAYERS

  const [participants, setParticipants] = useState<Record<PlayerId, boolean>>(() => {
    const initial: Record<PlayerId, boolean> = {}
    for (const player of game.players) {
      initial[player.id] = draft
        ? draft.participantIds.includes(player.id)
        : allFixed || player.id === vorhandId || mustPlay(scores[player.id])
    }
    return initial
  })
  const [tricks, setTricks] = useState<Record<PlayerId, number>>(() => draft?.tricks ?? {})

  // Der Ansager steht oben, danach geht es in Sitzreihenfolge weiter.
  const ordered = [
    ...game.players.slice(currentVorhandIndex),
    ...game.players.slice(0, currentVorhandIndex),
  ]

  // Wer knapp vor dem Sieg steht, muss mitspielen. Die Schwelle steckt in rules.ts,
  // damit Trumpfwahl und Stiche-Seite dieselbe benutzen.
  const isForcedToPlay = (id: PlayerId) => mustPlay(scores[id])

  const isParticipating = (id: PlayerId) =>
    allFixed || id === vorhandId || isForcedToPlay(id) || participants[id] === true
  const used = game.players.reduce((sum, player) => sum + (tricks[player.id] ?? 0), 0)
  const remaining = TRICKS_PER_ROUND - used

  function toggleParticipant(id: PlayerId, checked: boolean) {
    setParticipants((prev) => ({ ...prev, [id]: checked }))
    // Wer nicht mitspielt, kann auch keine Stiche haben.
    if (!checked) setTricks((prev) => ({ ...prev, [id]: 0 }))
  }

  function pickTricks(id: PlayerId, value: number) {
    setTricks((prev) => ({ ...prev, [id]: prev[id] === value ? 0 : value }))
  }

  // Ob die Runde gültig ist, entscheidet nicht dieser Bildschirm, sondern die Regel-Engine.
  const input: RoundInput = {
    declarerId: vorhandId ?? '',
    trump,
    participantIds: game.players.filter((p) => isParticipating(p.id)).map((p) => p.id),
    tricks: Object.fromEntries(
      game.players.map((p) => [p.id, isParticipating(p.id) ? (tricks[p.id] ?? 0) : 0]),
    ),
  }
  const errors = validateRound(input, game.players)
  const isValid = errors.length === 0

  /** Fehlercode plus Platzhalter zu einem lesbaren Satz machen. */
  function errorMessage(error: ValidationError): string {
    const playerName = error.playerId
      ? game.players.find((p) => p.id === error.playerId)?.name
      : undefined
    const params = {
      ...(error.params ?? {}),
      ...(playerName ? { player: playerName } : {}),
    }
    return t(`error.${error.code}` as TranslationKey, params)
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.ghost} onClick={() => setAskMenu(true)}>
          <Icon name="back" />
          {t('nav.back')}
        </button>
        <button type="button" className={styles.ghost} onClick={onOpenHistory}>
          <Icon name="history" />
          {t('history.heading')}
        </button>
      </div>

      <div className={styles.content}>
        <button
          type="button"
          className={styles.stepBack}
          aria-label={t('nav.stepBack')}
          onClick={() => onStepBack(input)}
        >
          <Icon name="back" />
        </button>

        <div className={styles.stack}>
          <div className={styles.trumpHead}>
            {/* Herz-Blind hat kein eigenes Bild — es ist eine Ansage auf Herz. */}
            <Icon name={trump === 'herzBlind' ? 'herz' : trump} />
            <h1 className={styles.title}>{TRUMP_LABEL[trump]}</h1>
          </div>
        </div>

        {/* Punktestand vor dieser Runde, in Sitzreihenfolge — dieselbe Reihe wie auf der
            Trumpfwahl. Die Zeilen darunter stehen dagegen in Ansagerreihenfolge und
            tragen den Stand deshalb nicht noch einmal. */}
        <ul className={styles.chips}>
          {game.players.map((player) => (
            <li key={player.id} className={styles.chip}>
              <span className={styles.chipName}>{player.name}</span>
              <span className={styles.chipBottom}>
                <span className={styles.chipScore}>{scores[player.id]}</span>
                <PlayerBadges score={scores[player.id]} />
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.label}>{t('round.tricks')}</p>

        <ul className={styles.grid}>
          {ordered.map((player) => {
            const participating = isParticipating(player.id)
            const own = tricks[player.id] ?? 0
            // Auswählbar ist 0 bis zum Rest-Kontingent — die eigene Auswahl zählt dabei mit,
            // damit man sie nach oben korrigieren kann.
            const maxSelectable = Math.min(TRICKS_PER_ROUND, remaining + own)
            const locked = allFixed || player.id === vorhandId || isForcedToPlay(player.id)

            return (
              <li key={player.id} className={styles.row}>
                <label className={styles.rowHead}>
                  <input
                    type="checkbox"
                    className={styles.check}
                    checked={participating}
                    disabled={locked}
                    onChange={(event) => toggleParticipant(player.id, event.target.checked)}
                  />
                  <span className={styles.name}>{player.name}</span>
                  <PlayerBadges score={scores[player.id]} />
                </label>

                {participating && (
                  <div className={styles.numbers}>
                    {Array.from({ length: maxSelectable + 1 }, (_, i) => i).map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={styles.num}
                        aria-pressed={own === value}
                        onClick={() => pickTricks(player.id, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {/* Sagt, warum der Weiter-Button gesperrt ist, statt ihn wortlos grau zu lassen. */}
        {errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((error, index) => (
              <li key={index} role="alert">
                {errorMessage(error)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsInner}>
          <button
            type="button"
            className={styles.primary}
            disabled={!isValid}
            onClick={() => onNext(input)}
          >
            {t('game.next')}
          </button>
        </div>
      </div>

      <ConfirmDialog
        message={askMenu ? t('nav.menuConfirm') : null}
        onConfirm={onMenu}
        onCancel={() => setAskMenu(false)}
      />
    </div>
  )
}
