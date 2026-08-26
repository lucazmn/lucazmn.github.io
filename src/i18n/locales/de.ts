// Referenzsprache. Der Typ aller Übersetzungen wird aus diesem Objekt abgeleitet
// (siehe types.ts) — hier fehlt oder überzählt zu haben, bricht den Build für en.ts.
export const de = {
  'nav.back': 'Zurück',
  'nav.menuConfirm': 'Zurück zum Hauptmenü?',
  'nav.stepBack': 'Einen Schritt zurück',
  'nav.title': 'Zwanzig ab',

  'game.turn': '{player} ist dran',
  'game.dealer': '{player} teilt aus',
  'game.next': 'Weiter',

  'dialog.confirm': 'Ja',
  'dialog.cancel': 'Abbrechen',
  'home.ranking': 'Bilanz',
  'ranking.heading': 'Bilanz',
  'ranking.empty': 'Noch kein Spiel zu Ende gespielt.',
  'ranking.wins': { one: '{count} Sieg', other: '{count} Siege' },
  'ranking.games': 'Beendete Spiele',
  'ranking.playedWith': 'mit {players}',
  'home.startGame': 'Spiel starten',
  'home.settings': 'Einstellungen',

  'setup.heading': 'Neues Spiel',
  'setup.playerName': 'Name',
  'setup.playerNamePlaceholder': 'Spielername',
  'setup.addPlayer': 'Spieler hinzufügen',
  'setup.note':
    'Änderungen gelten ab dem nächsten gestarteten Spiel. Ein laufendes Spiel behält die Regel, mit der es begonnen hat.',
  'setup.zeroRule': 'Wann hat man gewonnen?',
  'setup.zeroRuleExact': 'Genau 0 — sonst ins Minus',
  'setup.zeroRuleExactHint':
    'Es wird immer voll abgezogen, auch ins Minus. Gewonnen hat nur, wer genau auf 0 landet — aus dem Minus kommt man nur über Strafpunkte wieder heraus.',
  'setup.zeroRuleSkip': 'Genau 0 — sonst bleibt alles',
  'setup.zeroRuleSkipHint':
    'Schießt ein Abzug über die 0 hinaus, verfällt er ganz und der Punktestand bleibt unverändert. Gewonnen hat, wer genau auf 0 landet.',
  'setup.zeroRuleCap': 'Auch mit Überschuss',
  'setup.zeroRuleCapHint':
    'Wer 0 erreicht oder überschießt, gewinnt sofort. Der überschüssige Abzug verfällt, das Konto wird nie negativ.',
  'setup.deletePlayer': 'Spieler löschen',
  'setup.deleteConfirm': '{name} löschen? Alle Siege dieses Namens verschwinden aus der Bilanz.',
  'setup.language': 'Sprache',
  'setup.pool': 'Spieler auswählen',
  'setup.errorDuplicateName': 'Diesen Namen gibt es schon.',
  'setup.start': 'Spiel starten',
  'setup.errorPlayerCount': 'Es müssen zwischen {min} und {max} Spieler teilnehmen.',

  'round.blind': 'Blind',
  'round.trump': 'Trumpf',
  'round.tricks': 'Stiche',
  'round.trickSum': '{sum} / {total}',
  'round.mustPlay': 'muss mitspielen',
  'round.noExchange': 'darf nicht tauschen',

  'history.heading': 'Verlauf',
  'history.empty': 'Noch keine Runden gespielt.',
  'history.round': 'Runde',
  'history.trump': 'Trumpf',
  'history.declarer': 'Ansager',
  'history.passedShort': '—',

  'end.heading': 'Spiel beendet',
  'end.winner': 'Gewinner',
  'end.winners': 'Gewinner',
  'end.tieHeading': 'Gleichstand',
  'end.tieQuestion':
    'Mehrere sind in derselben Runde auf 0 gelandet. Wer war zuerst da? Das kann die App nicht wissen — sie kennt nur die Stiche der ganzen Runde.',
  'end.playAgain': 'Nochmal spielen',
  'end.toMenu': 'Zurück zum Hauptmenü',

  'error.trickSumMismatch': 'Die Stiche müssen zusammen {expected} ergeben, aktuell sind es {sum}.',
  'error.negativeTricks': '{player} kann keine negative Anzahl an Stichen haben.',
  'error.unknownDeclarer': 'Der Ansager ist unbekannt.',
  'error.declarerNotParticipating': 'Der Ansager muss auch mitspielen.',
  'error.tooFewParticipants': 'Es müssen mindestens {min} Spieler mitspielen.',
  'error.eichelRequiresAll': 'Bei Eichel müssen alle Spieler mitspielen.',
  'error.passerHasTricks': '{player} hat gepasst und darf keine Stiche haben.',
} as const
