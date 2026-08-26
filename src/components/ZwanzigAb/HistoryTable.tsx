import { useT } from '../../hooks/useT'
import { replayGame } from '../../game/zwanzigAb/replay'
import { TRUMP_LABEL } from '../../game/zwanzigAb/types'
import type { GameSnapshot } from '../../game/zwanzigAb/types'
import { Icon } from './Icon'
import styles from './screen.module.css'

type HistoryTableProps = {
  game: GameSnapshot
  onBack: () => void
}

export function HistoryTable({ game, onBack }: HistoryTableProps) {
  const { t } = useT()
  const { history } = replayGame(game)

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.ghost} onClick={onBack}>
          <Icon name="back" />
          {t('nav.back')}
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('history.heading')}</h1>

        {history.length === 0 ? (
          <p className={styles.note}>{t('history.empty')}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">{t('history.round')}</th>
                  <th scope="col">{t('history.trump')}</th>
                  <th scope="col">{t('history.declarer')}</th>
                  {game.players.map((player) => (
                    <th key={player.id} scope="col">
                      {player.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((round, index) => {
                  const declarer = game.players.find((p) => p.id === round.input.declarerId)
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{TRUMP_LABEL[round.input.trump]}</td>
                      <td>{declarer?.name ?? ''}</td>
                      {game.players.map((player) => {
                        const passed = !round.input.participantIds.includes(player.id)
                        return (
                          <td key={player.id}>
                            {/* Der Stand ist die Zahl, die man sucht — er steht vorn und
                            kräftig. Die Stiche belegen ihn nur und stehen klein dahinter.
                            Gepasst wird als "—" gezeigt: null Stiche kosten Strafpunkte,
                            passen dagegen nicht — das darf man nicht verwechseln. */}
                            <span className={styles.cellScore}>
                              {round.scoresAfter[player.id]}
                            </span>
                            <span className={styles.cellTricks}>
                              (
                              {passed
                                ? t('history.passedShort')
                                : (round.input.tricks[player.id] ?? 0)}
                              )
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
