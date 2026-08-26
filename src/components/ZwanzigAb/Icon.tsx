import styles from './screen.module.css'

// Inline-SVGs statt Icon-Paket: kein zusätzlicher Request, keine Abhängigkeit, und
// dank stroke="currentColor" drehen die Symbole bei invertierten Buttons automatisch mit.

export type IconName =
  | 'eichel'
  | 'gruen'
  | 'schellen'
  | 'herz'
  | 'blind'
  | 'back'
  | 'history'
  | 'play'
  | 'settings'
  | 'plus'
  | 'trophy'
  | 'noExchange'
  | 'mustPlay'
  | 'trash'

const PATHS: Record<IconName, string[]> = {
  // Eichel: Kappe, Frucht, Stiel.
  eichel: [
    'M12 4.5v1.5',
    'M5.5 8.5c0-1.4 2.9-2.5 6.5-2.5s6.5 1.1 6.5 2.5-2.9 2.5-6.5 2.5S5.5 9.9 5.5 8.5z',
    'M7 11c0 4.4 2.2 8 5 8s5-3.6 5-8',
  ],
  // Grün: Blatt mit Mittelrippe.
  gruen: ['M4.5 19.5C4.5 11 10 5.5 19.5 4.5c1 9.5-4.5 15-13 15z', 'M4.5 19.5 13 11'],
  // Schellen: Glocke mit Klöppel.
  schellen: [
    'M18.5 16.5h-13l1.5-2.5V11a5 5 0 0 1 10 0v3z',
    'M10 19.5a2.2 2.2 0 0 0 4 0',
    'M12 4V6',
  ],
  herz: ['M12 20s-7.5-4.8-7.5-10A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7.5 2c0 5.2-7.5 10-7.5 10z'],
  // Blind: durchgestrichenes Auge.
  blind: ['M3 12s3.6-6 9-6 9 6 9 6-3.6 6-9 6-9-6-9-6z', 'M12 9.5a2.5 2.5 0 0 0 0 5', 'M4 20 20 4'],
  back: ['M15 18.5 8.5 12 15 5.5'],
  // table von Lucide (MIT). Das Rechteck steht als Pfad da, weil die Komponente
  // ausschließlich <path> zeichnet.
  history: [
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'M3 9h18',
    'M3 15h18',
    'M12 3v18',
  ],
  play: ['M8 5.5 18 12 8 18.5z'],
  settings: [
    'M4 8h10m3 0h3',
    'M4 16h3m3 0h10',
    'M15.5 8a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
    'M7.5 16a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0',
  ],
  plus: ['M12 5.5v13', 'M5.5 12h13'],
  // trash-2 von Lucide (MIT).
  trash: [
    'M3 6h18',
    'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
    'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
    'M10 11v6',
    'M14 11v6',
  ],
  // log-out von Lucide (MIT), durchgestrichen: aussteigen ist nicht erlaubt.
  mustPlay: [
    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
    'm16 17 5-5-5-5',
    'M21 12H9',
    'M2 2l20 20',
  ],
  // refresh-cw-off von Lucide (MIT).
  noExchange: [
    'M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47',
    'M8 16H3v5',
    'M3 12C3 9.51 4 7.26 5.64 5.64',
    'm3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64',
    'M21 12c0 1-.16 1.97-.47 2.87',
    'M21 3v5h-5',
    'M2 2l20 20',
  ],
  trophy: [
    'M7 4h10v5a5 5 0 0 1-10 0z',
    'M7 5.5H4.5V7a3 3 0 0 0 3 3',
    'M17 5.5h2.5V7a3 3 0 0 1-3 3',
    'M12 14v3.5',
    'M8.5 20h7',
  ],
}

/** Die vier Farben kommen als Bilddateien, alles andere bleibt gezeichnet. */
const IMAGES: Partial<Record<IconName, string>> = {
  eichel: '/icons/acorns.png',
  gruen: '/icons/leaves.png',
  schellen: '/icons/bells.png',
  herz: '/icons/hearts.png',
}

type IconProps = {
  name: IconName
}

/** Größe folgt der Schriftgröße (1em), Farbe der Textfarbe. */
export function Icon({ name }: IconProps) {
  const image = IMAGES[name]
  if (image) {
    // Die Farbbilder liegen in public/icons und werden unverändert ausgeliefert.
    // Die Größe steckt bewusst in der CSS-Klasse, nicht inline — sonst könnten die
    // Seiten sie nicht überschreiben.
    return <img className={styles.icon} src={image} alt="" aria-hidden="true" />
  }

  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
