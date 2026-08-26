import { useState } from 'react'
import { useT } from '../../hooks/useT'
import { replayGame } from '../../game/zwanzigAb/replay'
import { TRUMP_LABEL, TRUMP_SUITS } from '../../game/zwanzigAb/types'
import type { GameSnapshot, TrumpKind } from '../../game/zwanzigAb/types'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from './Icon'
import { PlayerBadges } from './PlayerBadges'
import styles from './screen.module.css'

type GameScreenProps = {
  game: GameSnapshot
  /** Zuvor gewählter Trumpf, damit ein Zurück aus der Stiche-Seite die Auswahl behält. */
  selectedTrump: TrumpKind | null
  onNext: (trump: TrumpKind) => void
  /** Kopfzeile: verlässt den Flow ins Hauptmenü. */
  onMenu: () => void
  /** Pfeil: einen Schritt im Flow zurück. */
  onStepBack: () => void
  onOpenHistory: () => void
}

export function GameScreen({
  game,
  selectedTrump,
  onNext,
  onMenu,
  onStepBack,
  onOpenHistory,
}: GameScreenProps) {
  const { t } = useT()

  // Der Weg aus dem laufenden Spiel heraus wird einmal bestätigt.
  const [askMenu, setAskMenu] = useState(false)
  // "blind" ist kein eigener Trumpf, sondern ein Schalter für Herz.
  const [blind, setBlind] = useState(selectedTrump === 'herzBlind')

  // Die Vorhand rotiert mit jeder Runde; ohne gespielte Runde ist es der erste Spieler.
  const { currentVorhandIndex, scores } = replayGame(game)
  const count = game.players.length
  const current = game.players[currentVorhandIndex]
  // Ausgeteilt wird immer vom Sitznachbarn vor der Vorhand.
  const dealer = count > 0 ? game.players[(currentVorhandIndex - 1 + count) % count] : undefined

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
          onClick={onStepBack}
        >
          <Icon name="back" />
        </button>

        <div className={styles.stack}>
          <h1 className={styles.title}>{t('game.turn', { player: current?.name ?? '' })}</h1>
          <p className={styles.meta}>{t('game.dealer', { player: dealer?.name ?? '' })}</p>
        </div>

        {/* Punktestand vor dieser Runde, in Sitzreihenfolge. Bewusst flach und ohne
            Überschrift: die Trumpfkacheln sollen ohne Scrollen erreichbar bleiben. */}
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

        <section className={styles.section}>
          <p className={styles.label}>{t('round.trump')}</p>
          <ul className={styles.boxes}>
            {TRUMP_SUITS.map((suit) => {
              const isHeart = suit === 'herz'
              return (
                <li key={suit} className={styles.boxCell}>
                  {/* Der Tipp auf die Kachel ist zugleich die Bestätigung. Bei Herz
                      entscheidet die Checkbox, welche der beiden Ansagen es wird — sie
                      selbst leitet nicht weiter. */}
                  <button
                    type="button"
                    className={styles.box}
                    aria-pressed={selectedTrump === suit}
                    aria-label={TRUMP_LABEL[suit]}
                    onClick={() => onNext(isHeart && blind ? 'herzBlind' : suit)}
                  >
                    <Icon name={suit} />
                  </button>

                  {isHeart && (
                    <label className={styles.boxToggle}>
                      <input
                        type="checkbox"
                        className={styles.check}
                        checked={blind}
                        onChange={(event) => setBlind(event.target.checked)}
                      />
                      {t('round.blind')}
                    </label>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <ConfirmDialog
        message={askMenu ? t('nav.menuConfirm') : null}
        onConfirm={onMenu}
        onCancel={() => setAskMenu(false)}
      />
    </div>
  )
}
