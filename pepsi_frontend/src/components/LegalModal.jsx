import { useEffect } from 'react'
import './LegalModal.css'

export default function LegalModal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="legal-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="legal-modal__backdrop" aria-label="Close" onClick={onClose} />
      <div className="legal-modal__panel">
        <div className="legal-modal__header">
          <h2 className="legal-modal__title">{title}</h2>
          <button type="button" className="legal-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="legal-modal__body">{children}</div>
      </div>
    </div>
  )
}
