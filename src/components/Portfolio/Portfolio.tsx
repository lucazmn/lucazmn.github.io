import type { CSSProperties } from 'react'
import { useClock } from '../../hooks/useClock'
import { useCursorPosition } from '../../hooks/useCursorPosition'
import { useScrollPercent } from '../../hooks/useScrollPercent'
import { useTypedName } from '../../hooks/useTypedName'
import { useViewportSize } from '../../hooks/useViewportSize'
import { useWeather } from '../../hooks/useWeather'
import styles from './Portfolio.module.css'

const FULL_NAME = 'Luca Zimmermann'

type CursorVars = CSSProperties & { '--cursor-x': string; '--cursor-y': string }

type PortfolioProps = {
  onOpenZwanzigAb: () => void
}

export function Portfolio({ onOpenZwanzigAb }: PortfolioProps) {
  const typedName = useTypedName(FULL_NAME)
  const { x: cursorX, y: cursorY } = useCursorPosition()
  const scrollPct = useScrollPercent()
  const clock = useClock()
  const weather = useWeather()
  const { width } = useViewportSize()
  const deviceLabel = width <= 640 ? 'mobile' : 'desktop'

  const glowStyle: CursorVars = {
    '--cursor-x': `${cursorX}px`,
    '--cursor-y': `${cursorY}px`,
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glow} style={glowStyle} />

      <div className={styles.topbar}>
        <span>{deviceLabel}</span>
        <span>
          {clock} · {weather}
        </span>
      </div>

      <section className={styles.hero}>
        <div className={styles.prompt}>$ whoami</div>
        <h1 className={styles.name}>
          {typedName}
          <span className={styles.typedCursor}>_</span>
        </h1>
        <div className={styles.tagline}>
          <span className={styles.arrow}>&gt;</span> personal playground for code &amp; experiments
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.next} onClick={onOpenZwanzigAb}>
            $ cd zwanzig-ab-tracker <span className={styles.arrow}>&rarr;</span>
          </button>
        </div>
      </section>

      <div className={`${styles.bottombar} ${styles.desktopOnly}`}>
        <span>
          x:{cursorX} y:{cursorY}
        </span>
        <span>scroll:{scrollPct}%</span>
      </div>
    </div>
  )
}
