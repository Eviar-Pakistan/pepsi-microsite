import { useEffect, useRef, useState } from 'react'
import vinyl from '../assets/images/home/vinyl.png'
import pepsiLogo from '../assets/images/home/pepsi-logo.png'
import cassetteWeb from '../assets/images/home/web/cassette.png'
import music2Web from '../assets/images/home/web/music-2.png'
import { getVideoStatus } from '../api/videos'
import './Loading.css'

const SIZE = 220
const STROKE = 5
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const HARD_TIMEOUT_MS = 15 * 60 * 1000
/** Evenly fill the ring up to this %, then wait for API success */
const PROGRESS_CAP = 92
/** Time to reach PROGRESS_CAP evenly (ms) — leaves a gap until the job finishes */
const RAMP_MS = 90_000

export default function Loading({ orderId, onReady, onError }) {
  const [progress, setProgress] = useState(0)
  const startedAt = useRef(Date.now())
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)
  const doneRef = useRef(false)

  useEffect(() => {
    onReadyRef.current = onReady
    onErrorRef.current = onError
  }, [onReady, onError])

  useEffect(() => {
    const id = setInterval(() => {
      if (doneRef.current) return
      const elapsed = Date.now() - startedAt.current
      const next = Math.min(PROGRESS_CAP, (elapsed / RAMP_MS) * PROGRESS_CAP)
      setProgress(next)
    }, 200)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!orderId) return undefined

    let cancelled = false
    let timeoutId

    const poll = async () => {
      if (cancelled || doneRef.current) return

      if (Date.now() - startedAt.current > HARD_TIMEOUT_MS) {
        onErrorRef.current?.('This is taking longer than expected. Please try again later.')
        return
      }

      try {
        const job = await getVideoStatus(orderId)
        if (cancelled) return

        if (job.status === 'success' && job.videoUrl) {
          doneRef.current = true
          setProgress(100)
          onReadyRef.current?.(job)
          return
        }

        if (job.status === 'rejected' || job.status === 'failed') {
          doneRef.current = true
          onErrorRef.current?.(job.message || 'We couldn’t finish your video. Please try again.')
          return
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('status poll failed', error)
        }
      }

      const elapsed = Date.now() - startedAt.current
      const delay = elapsed < 5_000 ? 5_000 : elapsed < 120_000 ? 12_000 : 45_000
      timeoutId = setTimeout(poll, delay)
    }

    timeoutId = setTimeout(poll, 5_000)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [orderId])

  const offset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE

  return (
    <section className="loading">
      <div className="loading__copy">
        <h1 className="loading__title">LET THEM COOK.</h1>
        <p className="loading__subtitle">
          YOUNG STUNNERS ARE GETTING YOUR DROP READY. HANG TIGHT.
        </p>
      </div>

      <div className="loading__vinyl-wrap">
        <img
          src={music2Web}
          alt=""
          className="loading__deco loading__deco--music"
        />
        <img
          src={cassetteWeb}
          alt=""
          className="loading__deco loading__deco--cassette"
        />

        <div className="loading__ring" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <svg
            className="loading__svg"
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            aria-hidden="true"
          >
            <circle
              className="loading__track"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
            />
            <circle
              className="loading__progress"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>

          <div className="loading__disc">
            <img src={vinyl} alt="" className="loading__vinyl" />
            <img src={pepsiLogo} alt="Pepsi" className="loading__logo" />
          </div>
        </div>
      </div>
    </section>
  )
}
