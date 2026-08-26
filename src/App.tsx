import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { Portfolio } from './components/Portfolio/Portfolio'
import { Subpage } from './components/Subpage/Subpage'
import { GameScreen } from './components/ZwanzigAb/GameScreen'
import { NameEntry } from './components/ZwanzigAb/NameEntry'
import { Ranking } from './components/ZwanzigAb/Ranking'
import { SettingsScreen } from './components/ZwanzigAb/SettingsScreen'
import { TrickEntry } from './components/ZwanzigAb/TrickEntry'
import { HistoryTable } from './components/ZwanzigAb/HistoryTable'
import { WinnerScreen } from './components/ZwanzigAb/WinnerScreen'
import { replayGame } from './game/zwanzigAb/replay'
import { ZwanzigAb } from './components/ZwanzigAb/ZwanzigAb'
import { saveResult } from './game/zwanzigAb/results'
import { loadSettings, saveSettings } from './game/zwanzigAb/settings'
import type {
  GameSnapshot,
  PlayerId,
  RoundInput,
  Settings,
  TrumpKind,
} from './game/zwanzigAb/types'
import { LanguageProvider } from './i18n/LanguageProvider'
import { useHashRoute } from './hooks/useHashRoute'
import type { Route } from './hooks/useHashRoute'

// crypto.randomUUID gibt es nur in sicheren Kontexten — beim Testen über die LAN-IP nicht.
function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)
}

function App() {
  const { route, navigate } = useHashRoute()
  const [game, setGame] = useState<GameSnapshot | null>(null)
  const [trump, setTrump] = useState<TrumpKind | null>(null)
  // Angefangene, noch nicht festgeschriebene Runde — überlebt das Hin und Her zwischen
  // Trumpfwahl und Stiche-Seite und wird beim Aufmachen einer Runde wieder gefüllt.
  const [draft, setDraft] = useState<RoundInput | null>(null)
  // Gelten für das nächste gestartete Spiel; ein laufendes behält seine eigenen.
  const [settings, setSettings] = useState<Settings>(loadSettings)
  // Landen mehrere in derselben Runde auf 0, entscheidet der Tisch, wer zuerst da war.
  const [firstToZero, setFirstToZero] = useState<PlayerId | null>(null)

  const toHome = useCallback(() => navigate('/'), [navigate])
  const toZwanzigAb = useCallback(() => navigate('/zwanzig-ab'), [navigate])
  const toNewGame = useCallback(() => navigate('/zwanzig-ab/neu'), [navigate])

  // Die Auswahlreihenfolge der Namen ist die Sitzreihenfolge am Tisch.
  const startGame = useCallback(
    (names: string[]) => {
      setGame({
        players: names.map((name) => ({ id: createId(), name })),
        settings,
        rounds: [],
      })
      setFirstToZero(null)
      navigate('/zwanzig-ab/spiel')
    },
    [navigate, settings],
  )

  const chooseTrump = useCallback(
    (kind: TrumpKind) => {
      setTrump(kind)
      navigate('/zwanzig-ab/stiche')
    },
    [navigate],
  )

  // Runde festschreiben, Trumpf für die nächste Runde zurücksetzen und weiterleiten:
  // steht jemand auf 0, ist Schluss, sonst geht es zur nächsten Trumpfwahl.
  const finishRound = useCallback(
    (input: RoundInput) => {
      if (!game) return
      const next: GameSnapshot = { ...game, rounds: [...game.rounds, input] }
      setGame(next)
      setTrump(null)
      setDraft(null)
      setFirstToZero(null)
      navigate(replayGame(next).phase === 'finished' ? '/zwanzig-ab/ende' : '/zwanzig-ab/spiel')
    },
    [game, navigate],
  )

  /**
   * Hält das Ergebnis eines beendeten Spiels fest. Bewusst erst beim Verlassen des
   * Siegesbildschirms — bis dahin lässt sich die letzte Runde noch zurücknehmen.
   */
  const recordResult = useCallback(() => {
    if (!game) return
    const { winnerIds, phase } = replayGame(game)
    if (phase !== 'finished') return
    const ids = firstToZero ? [firstToZero] : winnerIds
    saveResult({
      finishedAt: new Date().toISOString(),
      winnerNames: game.players.filter((p) => ids.includes(p.id)).map((p) => p.name),
      playerNames: game.players.map((p) => p.name),
    })
  }, [game, firstToZero])

  const toRanking = useCallback(() => navigate('/zwanzig-ab/bilanz'), [navigate])

  // Revanche: dieselben Spieler in derselben Sitzreihenfolge, Runden auf null.
  const playAgain = useCallback(() => {
    if (!game) return
    recordResult()
    setGame({ ...game, rounds: [] })
    setTrump(null)
    setDraft(null)
    setFirstToZero(null)
    navigate('/zwanzig-ab/spiel')
  }, [game, navigate, recordResult])

  // Verlässt den Flow, behält das Spiel aber im Speicher — ein Fehltipp auf "Zurück"
  // soll keine gespielten Runden kosten.
  const toMenuKeepGame = useCallback(() => navigate('/zwanzig-ab'), [navigate])

  const toMenu = useCallback(() => {
    // Greift nur, wenn gerade ein beendetes Spiel verlassen wird.
    recordResult()
    setGame(null)
    setTrump(null)
    setDraft(null)
    setFirstToZero(null)
    navigate('/zwanzig-ab')
  }, [navigate, recordResult])

  // Zurück zur Trumpfwahl: eingetragene Stiche mitnehmen, damit sie beim Vorwärtsgehen
  // wieder dastehen.
  const toTrump = useCallback(
    (input: RoundInput) => {
      setDraft(input)
      navigate('/zwanzig-ab/spiel')
    },
    [navigate],
  )

  /**
   * Ein Schritt zurück von der Trumpfwahl. Die Schrittfolge ist
   * Namen → Trumpf → Stiche → Trumpf → Stiche → …, der vorige Schritt ist also die
   * Stiche-Seite der letzten Runde: sie wird wieder aufgemacht, samt Trumpf, Mitspielern
   * und Stichen. Gibt es noch keine Runde, ist der vorige Schritt die Namensauswahl.
   */
  const undoLastRound = useCallback(() => {
    if (!game) return
    if (game.rounds.length === 0) {
      navigate('/zwanzig-ab/neu')
      return
    }
    const last = game.rounds[game.rounds.length - 1]
    setGame({ ...game, rounds: game.rounds.slice(0, -1) })
    setTrump(last?.trump ?? null)
    setDraft(last ?? null)
    setFirstToZero(null)
    navigate('/zwanzig-ab/stiche')
  }, [game, navigate])

  const toSettings = useCallback(() => navigate('/zwanzig-ab/einstellungen'), [navigate])

  const changeSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      saveSettings(next)
      return next
    })
  }, [])

  const toHistory = useCallback(() => navigate('/zwanzig-ab/verlauf'), [navigate])

  // Zurück aus dem Verlauf führt dorthin, wo das Spiel gerade steht.
  const fromHistory = useCallback(() => {
    if (game && replayGame(game).phase === 'finished') navigate('/zwanzig-ab/ende')
    else navigate(trump ? '/zwanzig-ab/stiche' : '/zwanzig-ab/spiel')
  }, [game, trump, navigate])

  // Solange keine Runde gespielt ist, sind die Spieler nur ein Entwurf und bleiben in der
  // Namensauswahl stehen. Ein laufendes Spiel setzt die Auswahl dagegen nicht neu.
  const draftNames = game && game.rounds.length === 0 ? game.players.map((p) => p.name) : []

  const pages: Record<Route, ReactNode> = {
    '/': <Portfolio onOpenZwanzigAb={toZwanzigAb} />,
    '/test': <Subpage onBack={toHome} />,
    '/zwanzig-ab': <ZwanzigAb onStartGame={toNewGame} onRanking={toRanking} onSettings={toSettings} />,
    '/zwanzig-ab/bilanz': <Ranking onBack={toMenu} />,
    '/zwanzig-ab/einstellungen': (
      <SettingsScreen settings={settings} onChange={changeSettings} onBack={toMenu} />
    ),
    '/zwanzig-ab/neu': <NameEntry initialNames={draftNames} onStart={startGame} onBack={toMenu} />,
    // Ohne laufendes Spiel (Direktaufruf, Reload) zurück zur Namensauswahl.
    '/zwanzig-ab/spiel': game ? (
      <GameScreen
        game={game}
        selectedTrump={trump}
        onNext={chooseTrump}
        onMenu={toMenuKeepGame}
        onStepBack={undoLastRound}
        onOpenHistory={toHistory}
      />
    ) : (
      <NameEntry initialNames={draftNames} onStart={startGame} onBack={toMenu} />
    ),
    '/zwanzig-ab/stiche':
      game && trump ? (
        <TrickEntry
          game={game}
          trump={trump}
          draft={draft}
          onNext={finishRound}
          onMenu={toMenuKeepGame}
          onStepBack={toTrump}
          onOpenHistory={toHistory}
        />
      ) : (
        <NameEntry initialNames={draftNames} onStart={startGame} onBack={toMenu} />
      ),
    '/zwanzig-ab/verlauf': game ? (
      <HistoryTable game={game} onBack={fromHistory} />
    ) : (
      <NameEntry initialNames={draftNames} onStart={startGame} onBack={toMenu} />
    ),
    '/zwanzig-ab/ende': game ? (
      <WinnerScreen
        game={game}
        firstToZero={firstToZero}
        onPickFirst={setFirstToZero}
        onPlayAgain={playAgain}
        onToMenu={toMenu}
        onOpenHistory={toHistory}
      />
    ) : (
      <NameEntry initialNames={draftNames} onStart={startGame} onBack={toMenu} />
    ),
  }

  return <LanguageProvider>{pages[route] ?? pages['/']}</LanguageProvider>
}

export default App
