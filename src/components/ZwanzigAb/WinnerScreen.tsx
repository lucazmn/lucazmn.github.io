import { useT } from '../../hooks/useT'
import { replayGame } from '../../game/zwanzigAb/replay'
import type { GameSnapshot, PlayerId } from '../../game/zwanzigAb/types'
import { Icon } from './Icon'
import styles from './screen.module.css'

type WinnerScreenProps = {
  game: GameSnapshot
  /** Bei Gleichstand vom Tisch nachgereicht: wer zuerst auf 0 war. */
  firstToZero: PlayerId | null
  onPickFirst: (id: PlayerId) => void
  onPlayAgain: () => void
  onToMenu: () => void
  onOpenHistory: () => void
}

export function WinnerScreen({
  game,
  firstToZero,
  onPickFirst,
  onPlayAgain,
  onToMenu,
  onOpenHistory,
}: WinnerScreenProps) {
  const { t } = useT()

  const { winnerIds, scores } = replayGame(game)
  const tied = game.players.filter((player) => winnerIds.includes(player.id))
  // Wer zuerst auf 0 war, lässt sich aus den Rundendaten nicht ableiten — die App kennt
  // nur die Stichzahl der ganzen Runde, nicht die Reihenfolge der einzelnen Stiche.
  const needsTieBreak = tied.length > 1 && firstToZero === null
  const winners = firstToZero ? tied.filter((player) => player.id === firstToZero) : tied

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <span />
        <button type="button" className={styles.ghost} onClick={onOpenHistory}>
          <Icon name="history" />
          {t('history.heading')}
        </button>
      </div>

      {needsTieBreak ? (
        <div className={styles.content}>
          <h1 className={styles.title}>{t('end.tieHeading')}</h1>
          <p className={styles.note}>{t('end.tieQuestion')}</p>
          <ul className={styles.grid}>
            {tied.map((player) => (
              <li key={player.id}>
                <button
                  type="button"
                  className={styles.choice}
                  onClick={() => onPickFirst(player.id)}
                >
                  <Icon name="trophy" />
                  <span>{player.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className={styles.content}>
            <div className={styles.stack}>
              <div className={styles.trumpHead}>
                <span className={styles.winnerIcon}>
                  <Icon name="trophy" />
                </span>
                <h1 className={styles.title}>
                  {winners.map((player) => player.name).join(', ')}
                </h1>
              </div>
              <p className={styles.meta}>
                {winners.length === 1 ? t('end.winner') : t('end.winners')}
              </p>
            </div>

            <section className={styles.section}>
              <p className={styles.label}>{t('end.heading')}</p>
              <ul className={styles.grid}>
                {game.players.map((player) => (
                  <li key={player.id} className={styles.row}>
                    <div className={styles.rowHead}>
                      <span className={styles.score}>{scores[player.id]}</span>
                      <span className={styles.name}>{player.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className={styles.actions}>
            <div className={`${styles.actionsInner} ${styles.stack}`}>
              <button type="button" className={styles.primary} onClick={onPlayAgain}>
                {t('end.playAgain')}
              </button>
              <button type="button" className={styles.secondary} onClick={onToMenu}>
                {t('end.toMenu')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
