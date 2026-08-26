import type { Translation } from '../types'

// Fachbegriffe (Eichel, Grün, Schellen, Herz, Herz-Blind, Vorhand, Ansager, Stich)
// bleiben unübersetzt — das sind die Wörter, die am Tisch fallen.
export const en: Translation = {
  'nav.back': 'Back',
  'nav.menuConfirm': 'Back to the main menu?',
  'nav.stepBack': 'One step back',
  'nav.title': 'Zwanzig ab',

  'game.turn': '{player} is up',
  'game.dealer': '{player} deals',
  'game.next': 'Continue',

  'dialog.confirm': 'Yes',
  'dialog.cancel': 'Cancel',
  'home.ranking': 'Ranking',
  'ranking.heading': 'Ranking',
  'ranking.empty': 'No game finished yet.',
  'ranking.wins': { one: '{count} win', other: '{count} wins' },
  'ranking.games': 'Finished games',
  'ranking.playedWith': 'with {players}',
  'home.startGame': 'Start game',
  'home.settings': 'Settings',

  'setup.heading': 'New game',
  'setup.playerName': 'Name',
  'setup.playerNamePlaceholder': 'Player name',
  'setup.addPlayer': 'Add player',
  'setup.note':
    'Changes apply from the next game you start. A running game keeps the rule it began with.',
  'setup.zeroRule': 'When do you win?',
  'setup.zeroRuleExact': 'Exactly 0 — or go negative',
  'setup.zeroRuleExactHint':
    'Deductions always apply in full, even below 0. Only landing exactly on 0 wins — the only way out of the minus is penalty points.',
  'setup.zeroRuleSkip': 'Exactly 0 — or nothing happens',
  'setup.zeroRuleSkipHint':
    'If a deduction would overshoot 0, it is dropped entirely and the score stays as it was. Landing exactly on 0 wins.',
  'setup.zeroRuleCap': 'Overshooting counts',
  'setup.zeroRuleCapHint':
    'Reaching or overshooting 0 wins immediately. The excess deduction is lost and the score never goes negative.',
  'setup.deletePlayer': 'Delete player',
  'setup.deleteConfirm': 'Delete {name}? All wins under this name disappear from the ranking.',
  'setup.language': 'Language',
  'setup.pool': 'Choose players',
  'setup.errorDuplicateName': 'That name already exists.',
  'setup.start': 'Start game',
  'setup.errorPlayerCount': 'Between {min} and {max} players are required.',

  'round.blind': 'Blind',
  'round.trump': 'Trump',
  'round.tricks': 'Tricks',
  'round.trickSum': '{sum} / {total}',
  'round.mustPlay': 'must play',
  'round.noExchange': 'no exchanging',

  'history.heading': 'History',
  'history.empty': 'No rounds played yet.',
  'history.round': 'Round',
  'history.trump': 'Trump',
  'history.declarer': 'Ansager',
  'history.passedShort': '—',

  'end.heading': 'Game over',
  'end.winner': 'Winner',
  'end.winners': 'Winners',
  'end.tieHeading': 'Tie',
  'end.tieQuestion':
    'Several players landed on 0 in the same round. Who got there first? The app cannot know — it only sees the tricks of the whole round.',
  'end.playAgain': 'Play again',
  'end.toMenu': 'Back to main menu',

  'error.trickSumMismatch': 'The tricks must add up to {expected}, currently they add up to {sum}.',
  'error.negativeTricks': '{player} cannot have a negative number of tricks.',
  'error.unknownDeclarer': 'The declarer is unknown.',
  'error.declarerNotParticipating': 'The declarer must also participate.',
  'error.tooFewParticipants': 'At least {min} players must participate.',
  'error.eichelRequiresAll': 'With Eichel, all players must participate.',
  'error.passerHasTricks': '{player} passed and cannot have any tricks.',
} as const
