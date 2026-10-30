import CtaButton from '../components/CtaButton'
import { getDownloadUrl } from '../api/videos'
import './Result.css'

export default function Result({ orderId, videoUrl, onAgain }) {
  const downloadHref = orderId ? getDownloadUrl(orderId) : videoUrl

  return (
    <section className="result">
      <div className="result__copy">
        <h1 className="result__title">YOUR DROP IS READY</h1>
        <p className="result__subtitle">Play it now or download your Young Stunners video.</p>
      </div>

      <div className="result__player-wrap">
        {videoUrl ? (
          <video className="result__player" src={videoUrl} controls playsInline preload="metadata" />
        ) : (
          <p className="result__missing">Video unavailable.</p>
        )}
      </div>

      <div className="result__actions">
        <a className="result__download cta-btn" href={downloadHref} download={`pepsi-video-${orderId || 'clip'}.mp4`}>
          <span className="cta-btn__label">DOWNLOAD</span>
          <span className="cta-btn__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
              <path
                d="M12 4v12M6 12l6 6 6-6M5 20h14"
                stroke="#0a0a2e"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
        <CtaButton type="button" onClick={onAgain}>
          MAKE ANOTHER
        </CtaButton>
      </div>
    </section>
  )
}
