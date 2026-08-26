import { useT } from '../../hooks/useT'
import styles from './screen.module.css'

type ConfirmDialogProps = {
  /** Text der Rückfrage; null bedeutet: kein Dialog offen. */
  message: string | null
  onConfirm: () => void
  onCancel: () => void
}

/** Rückfrage im Stil der App statt der Browser-Meldung. */
export function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  const { t } = useT()
  if (message === null) return null

  return (
    <div className={styles.dialogBackdrop} onClick={onCancel}>
      {/* Klick im Kasten soll nicht schließen, deshalb hier abfangen. */}
      <div
        className={styles.dialogBox}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.dialogText}>{message}</p>

        <div className={styles.dialogActions}>
          <button type="button" className={styles.primary} onClick={onConfirm}>
            {t('dialog.confirm')}
          </button>
          <button type="button" className={styles.secondary} onClick={onCancel}>
            {t('dialog.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
