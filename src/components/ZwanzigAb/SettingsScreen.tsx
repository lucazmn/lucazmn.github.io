import { useT } from '../../hooks/useT'
import { ZERO_RULES } from '../../game/zwanzigAb/types'
import type { Settings } from '../../game/zwanzigAb/types'
import type { Language } from '../../i18n/context'
import { Icon } from './Icon'
import styles from './screen.module.css'

/**
 * Sprachen stehen in der eigenen Sprache, nicht übersetzt: wer die Oberfläche gerade
 * nicht lesen kann, sucht genau danach. Deshalb auch kein Eintrag im Wörterbuch.
 */
const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
]

const LABEL_KEY = {
  exact: 'setup.zeroRuleExact',
  skip: 'setup.zeroRuleSkip',
  cap: 'setup.zeroRuleCap',
} as const

const HINT_KEY = {
  exact: 'setup.zeroRuleExactHint',
  skip: 'setup.zeroRuleSkipHint',
  cap: 'setup.zeroRuleCapHint',
} as const

type SettingsScreenProps = {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onBack: () => void
}

export function SettingsScreen({ settings, onChange, onBack }: SettingsScreenProps) {
  const { t, lang, setLang } = useT()

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.ghost} onClick={onBack}>
          <Icon name="back" />
          {t('nav.back')}
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{t('home.settings')}</h1>
        <p className={styles.note}>{t('setup.note')}</p>

        {/* Die Sprache gilt für die ganze Oberfläche, nicht nur fürs nächste Spiel —
            deshalb steht sie vor den Spielregeln und wird sofort wirksam. */}
        <section className={styles.section} role="radiogroup" aria-label={t('setup.language')}>
          <p className={styles.label}>{t('setup.language')}</p>
          <ul className={styles.grid}>
            {LANGUAGES.map((language) => (
              <li key={language.code}>
                <button
                  type="button"
                  role="radio"
                  className={styles.choice}
                  lang={language.code}
                  aria-checked={lang === language.code}
                  aria-pressed={lang === language.code}
                  onClick={() => setLang(language.code)}
                >
                  <span />
                  <span>{language.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} role="radiogroup" aria-label={t('setup.zeroRule')}>
          <p className={styles.label}>{t('setup.zeroRule')}</p>
          <ul className={styles.grid}>
            {ZERO_RULES.map((rule) => (
              <li key={rule} className={styles.stack}>
                <button
                  type="button"
                  role="radio"
                  className={styles.choice}
                  aria-checked={settings.zeroRule === rule}
                  aria-pressed={settings.zeroRule === rule}
                  onClick={() => onChange({ zeroRule: rule })}
                >
                  <span />
                  <span>{t(LABEL_KEY[rule])}</span>
                </button>
                <p className={styles.note}>{t(HINT_KEY[rule])}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
