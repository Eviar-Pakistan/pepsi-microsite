import './CtaButton.css'

export default function CtaButton({
  children = 'GET MY VIDEO',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  return (
    <button
      type={type}
      className={`cta-btn${className ? ` ${className}` : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="cta-btn__label">{children}</span>
      <span className="cta-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
          <path
            d="M5 12h12M13 6l6 6-6 6"
            stroke="#0a0a2e"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  )
}
