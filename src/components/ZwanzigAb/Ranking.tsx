import { useT } from '../../hooks/useT'
import { loadResults, winRanking } from '../../game/zwanzigAb/results'
import { Icon } from './Icon'
import styles from './screen.module.css'

type RankingProps = {
  onBack: () => void
}

export function Ranking({ onBack }: RankingProps) {
  const { t, lang } = useT()

  const results = loadResults()
  const ranking = winRanking(results)
  const formatDate = new Intl.DateTimeFormat(lang, { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.ghost} onClick={onBack}>
          <Icon name="back" />
          {t('nav.back')}
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('ranking.heading')}</h1>

        {results.length === 0 ? (
          <p className={styles.note}>{t('ranking.empty')}</p>
        ) : (
          <>
            <ul className={styles.grid}>
              {ranking.map((entry, index) => (
                <li key={entry.name} className={styles.row}>
                  <div className={styles.rowHead}>
                    <span className={styles.score}>{index + 1}</span>
                    <span className={styles.name}>{entry.name}</span>
                    <span className={styles.meta}>
                      {t('ranking.wins', { count: entry.wins })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <section className={styles.section}>
              <p className={styles.label}>{t('ranking.games')}</p>
              <ul className={styles.grid}>
                {results.map((result) => (
                  <li key={result.finishedAt} className={styles.row}>
                    <div className={styles.rowHead}>
                      <Icon name="trophy" />
                      <span className={styles.name}>{result.winnerNames.join(', ')}</span>
                    </div>
                    <p className={styles.note}>
                      {formatDate.format(new Date(result.finishedAt))} ·{' '}
                      {t('ranking.playedWith', { players: result.playerNames.join(', ') })}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
