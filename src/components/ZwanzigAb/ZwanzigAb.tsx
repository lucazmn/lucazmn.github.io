import { useT } from '../../hooks/useT'
import { Icon } from './Icon'
import styles from './screen.module.css'

type ZwanzigAbProps = {
  onStartGame: () => void
  onRanking: () => void
  onSettings: () => void
}

export function ZwanzigAb({ onStartGame, onRanking, onSettings }: ZwanzigAbProps) {
  const { t } = useT()

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('nav.title')}</h1>

        <ul className={styles.grid}>
          <li>
            <button type="button" className={styles.choice} onClick={onStartGame}>
              <Icon name="play" />
              <span>{t('home.startGame')}</span>
            </button>
          </li>
          <li>
            <button type="button" className={styles.choice} onClick={onRanking}>
              <Icon name="history" />
              <span>{t('home.ranking')}</span>
            </button>
          </li>
          <li>
            <button type="button" className={styles.choice} onClick={onSettings}>
              <Icon name="settings" />
              <span>{t('home.settings')}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
