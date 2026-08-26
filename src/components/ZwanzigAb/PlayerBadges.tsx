import { useT } from '../../hooks/useT'
import { mustPlay, noExchange } from '../../game/zwanzigAb/rules'
import { Icon } from './Icon'
import styles from './screen.module.css'

type PlayerBadgesProps = {
  /** Punktestand vor der laufenden Runde. */
  score: number | undefined
}

/**
 * Die Sonderregeln eines Spielers als Symbole: Mitspielzwang und Tauschverbot. Beide
 * Seiten des Flows zeigen sie — die Trumpfwahl im Punktestand-Chip, die Stiche-Eingabe
 * in der Spielerzeile. Gemeinsames Bauteil, damit Symbol und Vorlesetext nicht
 * auseinanderlaufen. Trifft keine Regel zu, kommt nichts heraus.
 */
export function PlayerBadges({ score }: PlayerBadgesProps) {
  const { t } = useT()

  return (
    <>
      {mustPlay(score) && (
        <span className={styles.badgeIcon} role="img" aria-label={t('round.mustPlay')}>
          <Icon name="mustPlay" />
        </span>
      )}
      {/* Tauschverbot als Symbol statt Text — der Name bleibt so lesbar. */}
      {noExchange(score) && (
        <span className={styles.badgeIcon} role="img" aria-label={t('round.noExchange')}>
          <Icon name="noExchange" />
        </span>
      )}
    </>
  )
}
