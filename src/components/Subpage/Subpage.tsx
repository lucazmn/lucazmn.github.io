import { useClock } from '../../hooks/useClock'
import styles from './Subpage.module.css'

type SubpageProps = {
  onBack: () => void
}

export function Subpage({ onBack }: SubpageProps) {
  const clock = useClock()

  return (
    <div className={styles.page}>
      <div className={styles.grid} />

      <div className={styles.topbar}>
        <button type="button" className={styles.back} onClick={onBack}>
          &lt; back
        </button>
        <span>{clock}</span>
      </div>

      <section className={styles.content}>
        <div className={styles.prompt}>$ cd test</div>
        <h1 className={styles.title}>test</h1>
        <div className={styles.note}>
          <span className={styles.arrow}>&gt;</span> platz für funktionen
        </div>
      </section>
    </div>
  )
}
