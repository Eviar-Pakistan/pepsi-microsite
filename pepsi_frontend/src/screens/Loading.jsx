import { useEffect, useRef, useState } from 'react'
import vinyl from '../assets/images/home/vinyl.png'
import music from '../assets/images/home/music.png'
import playIcon from '../assets/images/home/play-icon.png'
import { getVideoStatus } from '../api/videos'
import './Loading.css'

const SIZE = 220
const STROKE = 4
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const HARD_TIMEOUT_MS = 15 * 60 * 1000

export default function Loading({ orderId, onReady, onError }) {
  const [progress, setProgress] = useState(8)
  const startedAt = useRef(Date.now())
  const onReadyRef = useRef(onReady)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onReadyRef.current = onReady
    onErrorRef.current = onError
  }, [onReady, onError])

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev
        const bump = prev < 40 ? 2.2 : prev < 70 ? 1.2 : 0.5
        return Math.min(92, prev + bump)
      })
    }, 120)

    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!orderId) return undefined

    let cancelled = false
    let timeoutId

    const poll = async () => {
      if (cancelled) return

      if (Date.now() - startedAt.current > HARD_TIMEOUT_MS) {
        onErrorRef.current?.('This is taking longer than expected. Please try again later.')
        return
      }

      try {
        const job = await getVideoStatus(orderId)
        if (cancelled) return

        if (job.status === 'success' && job.videoUrl) {
          setProgress(100)
          onReadyRef.current?.(job)
          return
        }

        if (job.status === 'rejected' || job.status === 'failed') {
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
        <img src={playIcon} alt="" className="loading__deco loading__deco--play" />
        <img src={music} alt="" className="loading__deco loading__deco--music" />

        <div className="loading__ring">
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
          <img src={vinyl} alt="" className="loading__vinyl" />
        </div>
      </div>
    </section>
  )
}
