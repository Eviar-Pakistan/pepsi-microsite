import './PulseBg.css'

export default function PulseBg({ className = '' }) {
  return (
    <div className={`pulse-bg${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className="pulse-bg__ring" />
      <span className="pulse-bg__ring" />
      <span className="pulse-bg__ring" />
    </div>
  )
}
