import type { CSSProperties } from 'react'
import { useClock } from '../../hooks/useClock'
import { useCursorPosition } from '../../hooks/useCursorPosition'
import { useScrollPercent } from '../../hooks/useScrollPercent'
import { useTypedName } from '../../hooks/useTypedName'
import { useWeather } from '../../hooks/useWeather'
import styles from './Portfolio.module.css'

const FULL_NAME = 'Luca Zimmermann'

type CursorVars = CSSProperties & { '--cursor-x': string; '--cursor-y': string }

export function Portfolio() {
  const typedName = useTypedName(FULL_NAME)
  const { x: cursorX, y: cursorY } = useCursorPosition()
  const scrollPct = useScrollPercent()
  const clock = useClock()
  const weather = useWeather()

  const glowStyle: CursorVars = {
    '--cursor-x': `${cursorX}px`,
    '--cursor-y': `${cursorY}px`,
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.glow} style={glowStyle} />

      <div className={styles.topbar}>
        <span>luca.zimmermann</span>
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
      </section>

      <div className={styles.bottombar}>
        <span>
          x:{cursorX} y:{cursorY}
        </span>
        <span>scroll:{scrollPct}%</span>
      </div>
    </div>
  )
}
