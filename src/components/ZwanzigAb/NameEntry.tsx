import { useState } from 'react'
import type { FormEvent } from 'react'
import { useT } from '../../hooks/useT'
import { ConfirmDialog } from './ConfirmDialog'
import { Icon } from './Icon'
import styles from './screen.module.css'
import { loadNames, saveNames } from '../../game/zwanzigAb/players'
import { forgetPlayer } from '../../game/zwanzigAb/results'
import { MAX_PLAYERS, MIN_PLAYERS } from '../../game/zwanzigAb/types'

// Wie viele Namen der Pool höchstens fasst.
const POOL_LIMIT = 8

type PoolEntry = {
  name: string
  /** ISO-Zeitpunkt des letzten Spiels; neu angelegte Namen zählen als gerade eben. */
  lastPlayed: string
}

const normalize = (name: string) => name.trim().toLowerCase()

/**
 * Neueste zuerst, bei gleichem Zeitpunkt alphabetisch. Was hinten überhängt, fällt raus —
 * neue Namen verdrängen also die am längsten nicht mehr benutzten.
 */
function rankPool(entries: PoolEntry[]): PoolEntry[] {
  return [...entries]
    .sort((a, b) =>
      a.lastPlayed === b.lastPlayed
        ? a.name.localeCompare(b.name)
        : a.lastPlayed < b.lastPlayed
          ? 1
          : -1,
    )
    .slice(0, POOL_LIMIT)
}

/** Gespeicherte Namen, je Name der jüngste Zeitpunkt. */
function readStoredPool(): PoolEntry[] {
  const byName = new Map<string, PoolEntry>()

  for (const entry of loadNames()) {
    const key = normalize(entry.name)
    if (key === '') continue
    const known = byName.get(key)
    if (!known || known.lastPlayed < entry.lastPlayed) {
      byName.set(key, {
        name: entry.name.trim(),
        lastPlayed: entry.lastPlayed,
      })
    }
  }

  return rankPool([...byName.values()])
}

type NameEntryProps = {
  /** Spieler eines noch nicht gespielten Spiels — bleiben ausgewählt, wenn man zurückkommt. */
  initialNames: string[]
  onStart: (names: string[]) => void
  onBack: () => void
}

export function NameEntry({ initialNames, onStart, onBack }: NameEntryProps) {
  const { t } = useT()

  const [pool, setPool] = useState<PoolEntry[]>(() => {
    const now = new Date().toISOString()
    const seeded = initialNames.map((name) => ({ name, lastPlayed: now }))
    // Diese Namen stehen womöglich noch in keinem Archiv, gehören aber trotzdem in den Pool.
    const rest = readStoredPool().filter(
      (entry) => !seeded.some((s) => normalize(s.name) === normalize(entry.name)),
    )
    return rankPool([...seeded, ...rest])
  })
  const [draft, setDraft] = useState('')
  // Reihenfolge der Auswahl = spätere Sitzreihenfolge, deshalb ein Array statt eines Sets.
  const [selected, setSelected] = useState<string[]>(initialNames)

  const trimmedDraft = draft.trim()
  const isDuplicate =
    trimmedDraft !== '' && pool.some((entry) => normalize(entry.name) === normalize(trimmedDraft))
  const canAdd = trimmedDraft !== '' && !isDuplicate
  const canStart = selected.length >= MIN_PLAYERS && selected.length <= MAX_PLAYERS

  function addPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canAdd) return

    const entry: PoolEntry = {
      name: trimmedDraft,
      lastPlayed: new Date().toISOString(),
    }
    const nextPool = rankPool([...pool, entry])

    setPool(nextPool)
    saveNames(nextPool)
    // Neu angelegte Namen sind für diese Runde direkt vorausgewählt.
    if (selected.length < MAX_PLAYERS) setSelected((prev) => [...prev, entry.name])
    setDraft('')
  }

  /** Mitspieler auf "gerade eben" setzen, damit sie im Pool nach vorn rücken. */
  function start() {
    const now = new Date().toISOString()
    saveNames(
      rankPool(
        pool.map((entry) =>
          selected.some((name) => normalize(name) === normalize(entry.name))
            ? { ...entry, lastPlayed: now }
            : entry,
        ),
      ),
    )
    onStart(selected)
  }

  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  /** Löscht den Namen aus dem Pool und aus der Bilanz — ein neuer Anlauf startet bei null. */
  function remove(name: string) {
    setPendingDelete(null)
    const nextPool = pool.filter((entry) => normalize(entry.name) !== normalize(name))
    setPool(nextPool)
    saveNames(nextPool)
    setSelected((prev) => prev.filter((entry) => normalize(entry) !== normalize(name)))
    forgetPlayer(name)
  }

  function toggle(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((entry) => entry !== name)
      return prev.length < MAX_PLAYERS ? [...prev, name] : prev
    })
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.ghost} onClick={onBack}>
          <Icon name="back" />
          {t('nav.back')}
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('setup.heading')}</h1>

        <form className={styles.field} onSubmit={addPlayer}>
          <label className={styles.srOnly} htmlFor="new-player">
            {t('setup.playerName')}
          </label>
          <input
            id="new-player"
            className={styles.input}
            type="text"
            value={draft}
            placeholder={t('setup.playerNamePlaceholder')}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button
            type="submit"
            className={styles.iconButton}
            disabled={!canAdd}
            aria-label={t('setup.addPlayer')}
          >
            <Icon name="plus" />
          </button>
        </form>

        {isDuplicate && <p className={styles.note}>{t('setup.errorDuplicateName')}</p>}

        <section className={styles.section}>
          <p className={styles.label}>{t('setup.pool')}</p>
          <ul className={styles.grid}>
            {pool.map((entry) => {
              const isSelected = selected.includes(entry.name)
              return (
                <li key={entry.name} className={styles.poolRow}>
                  <button
                    type="button"
                    className={styles.choice}
                    aria-pressed={isSelected}
                    disabled={!isSelected && selected.length >= MAX_PLAYERS}
                    onClick={() => toggle(entry.name)}
                  >
                    <span>{isSelected ? selected.indexOf(entry.name) + 1 : ''}</span>
                    <span>{entry.name}</span>
                  </button>

                  {/* Eigener Knopf statt im Auswahlknopf: verschachtelte Buttons wären
                      ungültiges Markup. */}
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={t('setup.deletePlayer')}
                    onClick={() => setPendingDelete(entry.name)}
                  >
                    <Icon name="trash" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {!canStart && (
          <p className={styles.note}>
            {t('setup.errorPlayerCount', {
              min: MIN_PLAYERS,
              max: MAX_PLAYERS,
            })}
          </p>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsInner}>
          <button type="button" className={styles.primary} disabled={!canStart} onClick={start}>
            {t('setup.start')}
          </button>
        </div>
      </div>

      <ConfirmDialog
        message={
          pendingDelete === null ? null : t('setup.deleteConfirm', { name: pendingDelete })
        }
        onConfirm={() => remove(pendingDelete ?? '')}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
