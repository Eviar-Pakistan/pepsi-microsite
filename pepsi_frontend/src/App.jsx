import { useEffect, useState } from 'react'
import Header from './components/Header'
import LegalModal from './components/LegalModal'
import Home from './screens/Home'
import FormScreen from './screens/FormScreen'
import Loading from './screens/Loading'
import HowItWorks from './screens/HowItWorks'
import Result from './screens/Result'
import TermsConditions from './screens/TermsConditions'
import PrivacyNotice from './screens/PrivacyNotice'
import { createVideo, getVideoStatus } from './api/videos'
import webBg1 from './assets/images/home/web/bg-1.png'
import webBackground from './assets/images/home/web/Background web.png'
import mobileBg2 from './assets/images/home/mobile/bg-2.png'
import mobileBackground from './assets/images/home/mobile/Background.png'
import './App.css'

const JOB_STORAGE_KEY = 'pepsi_active_job'
const LEGACY_ORDER_KEY = 'pepsi_active_order_id'

function readStoredJob() {
  try {
    const raw = localStorage.getItem(JOB_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const orderId = typeof parsed?.orderId === 'string' ? parsed.orderId : null
      const startedAt = Number(parsed?.startedAt)
      if (orderId?.startsWith('pepsi-') && Number.isFinite(startedAt) && startedAt > 0) {
        return { orderId, startedAt }
      }
    }

    // Migrate older order-id-only storage
    const legacy = localStorage.getItem(LEGACY_ORDER_KEY)
    if (legacy?.startsWith('pepsi-')) {
      const job = { orderId: legacy, startedAt: Date.now() }
      localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(job))
      localStorage.removeItem(LEGACY_ORDER_KEY)
      return job
    }
  } catch {
    // ignore
  }
  return null
}

function storeJob(job) {
  try {
    if (job?.orderId) {
      localStorage.setItem(
        JOB_STORAGE_KEY,
        JSON.stringify({
          orderId: job.orderId,
          startedAt: job.startedAt || Date.now(),
        }),
      )
      localStorage.removeItem(LEGACY_ORDER_KEY)
    } else {
      localStorage.removeItem(JOB_STORAGE_KEY)
      localStorage.removeItem(LEGACY_ORDER_KEY)
    }
  } catch {
    // ignore quota / private mode
  }
}

function shellBgClass(screen) {
  if (screen === 'home') return ' phone-shell--bg-home'
  if (screen === 'loading') return ' phone-shell--bg-loading'
  if (screen === 'form' || screen === 'result' || screen === 'how-it-works') {
    return ' phone-shell--bg-flow'
  }
  return ''
}

export default function App() {
  const initialJob = readStoredJob()
  const [screen, setScreen] = useState(initialJob ? 'loading' : 'home')
  const [orderId, setOrderId] = useState(initialJob?.orderId ?? null)
  const [jobStartedAt, setJobStartedAt] = useState(initialJob?.startedAt ?? null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [flowError, setFlowError] = useState('')
  const [legalModal, setLegalModal] = useState(null)
  const bgClass = shellBgClass(screen)
  const useAltBg = Boolean(bgClass)

  const navLocked = screen === 'loading'
  const initialOrderId = initialJob?.orderId ?? null

  // Resume in-progress (or finished) job after refresh / return
  useEffect(() => {
    if (!initialOrderId) return undefined

    let cancelled = false

    ;(async () => {
      try {
        const job = await getVideoStatus(initialOrderId)
        if (cancelled) return

        if (job.status === 'success' && job.videoUrl) {
          setOrderId(job.orderId || initialOrderId)
          setVideoUrl(job.videoUrl)
          setScreen('result')
          return
        }

        if (job.status === 'rejected' || job.status === 'failed' || job.status === 'timeout') {
          storeJob(null)
          setOrderId(null)
          setJobStartedAt(null)
          setFlowError(
            job.message || 'We couldn’t finish your video. Please try again.',
          )
          setScreen('form')
          return
        }

        setOrderId(initialOrderId)
        setScreen('loading')
      } catch {
        if (!cancelled) {
          setOrderId(initialOrderId)
          setScreen('loading')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [initialOrderId])

  const clearActiveJob = () => {
    storeJob(null)
    setOrderId(null)
    setJobStartedAt(null)
    setVideoUrl(null)
  }

  const handleNavigate = (next) => {
    if (navLocked) return
    if (next === 'tcs') {
      setLegalModal('terms')
      return
    }
    setScreen(next)
  }

  const handleGetVideo = () => {
    setFlowError('')
    clearActiveJob()
    setScreen('form')
  }

  const handleFormSubmit = async (values) => {
    setFlowError('')
    const response = await createVideo(values)
    const nextOrderId = response.orderId
    const startedAt = Date.now()
    storeJob({ orderId: nextOrderId, startedAt })
    setOrderId(nextOrderId)
    setJobStartedAt(startedAt)
    setVideoUrl(null)
    setScreen('loading')
  }

  const handleVideoReady = (job) => {
    const nextOrderId = job.orderId || orderId
    storeJob({
      orderId: nextOrderId,
      startedAt: jobStartedAt || Date.now(),
    })
    setVideoUrl(job.videoUrl)
    setOrderId(nextOrderId)
    setScreen('result')
  }

  const handleVideoError = (message) => {
    storeJob(null)
    setOrderId(null)
    setJobStartedAt(null)
    setVideoUrl(null)
    setFlowError(message)
    setScreen('form')
  }

  const handleAgain = () => {
    clearActiveJob()
    setFlowError('')
    setScreen('form')
  }

  return (
    <div className="app-root">
      <div
        className={`phone-shell${bgClass}`}
        style={
          useAltBg
            ? {
                '--shell-bg-mobile':
                  screen === 'home' ||
                  screen === 'form' ||
                  screen === 'loading' ||
                  screen === 'how-it-works' ||
                  screen === 'result'
                    ? `url(${mobileBackground})`
                    : `url(${mobileBg2})`,
                /* Tablet + laptop flow screens use Background web.png */
                '--shell-bg-desktop':
                  screen === 'home' ||
                  screen === 'form' ||
                  screen === 'how-it-works' ||
                  screen === 'loading' ||
                  screen === 'result'
                    ? `url(${webBackground})`
                    : `url(${webBg1})`,
                '--shell-bg-laptop':
                  screen === 'home' ||
                  screen === 'form' ||
                  screen === 'how-it-works' ||
                  screen === 'loading' ||
                  screen === 'result'
                    ? `url(${webBackground})`
                    : `url(${webBg1})`,
              }
            : undefined
        }
      >
        <Header activeScreen={screen} onNavigate={handleNavigate} navLocked={navLocked} />
        <main className="phone-shell__content">
          {screen === 'home' && <Home onGetVideo={handleGetVideo} />}
          {screen === 'form' && (
            <>
              {flowError ? <p className="app-flow-error">{flowError}</p> : null}
              <FormScreen
                onSubmit={handleFormSubmit}
                onOpenTerms={() => setLegalModal('terms')}
                onOpenPrivacy={() => setLegalModal('privacy')}
              />
            </>
          )}
          {screen === 'loading' && orderId && (
            <Loading
              orderId={orderId}
              startedAt={jobStartedAt}
              onReady={handleVideoReady}
              onError={handleVideoError}
            />
          )}
          {screen === 'result' && (
            <Result orderId={orderId} videoUrl={videoUrl} onAgain={handleAgain} />
          )}
          {screen === 'how-it-works' && <HowItWorks />}
        </main>
      </div>

      {legalModal === 'terms' ? (
        <LegalModal title="Terms & Conditions" onClose={() => setLegalModal(null)}>
          <TermsConditions />
        </LegalModal>
      ) : null}

      {legalModal === 'privacy' ? (
        <LegalModal title="Privacy Notice" onClose={() => setLegalModal(null)}>
          <PrivacyNotice />
        </LegalModal>
      ) : null}
    </div>
  )
}
