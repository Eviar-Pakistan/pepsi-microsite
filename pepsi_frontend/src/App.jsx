import { useState } from 'react'
import Header from './components/Header'
import LegalModal from './components/LegalModal'
import Home from './screens/Home'
import FormScreen from './screens/FormScreen'
import Loading from './screens/Loading'
import HowItWorks from './screens/HowItWorks'
import Result from './screens/Result'
import TermsConditions from './screens/TermsConditions'
import PrivacyNotice from './screens/PrivacyNotice'
import { createVideo } from './api/videos'
import webBg1 from './assets/images/home/web/bg-1.png'
import webBackground from './assets/images/home/web/Background web.png'
import mobileBg2 from './assets/images/home/mobile/bg-2.png'
import mobileBackground from './assets/images/home/mobile/Background.png'
import './App.css'

function shellBgClass(screen) {
  if (screen === 'home') return ' phone-shell--bg-home'
  if (screen === 'loading') return ' phone-shell--bg-loading'
  if (screen === 'form' || screen === 'result' || screen === 'how-it-works') {
    return ' phone-shell--bg-flow'
  }
  return ''
}

export default function App() {
  const [screen, setScreen] = useState('home')
  const [orderId, setOrderId] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [flowError, setFlowError] = useState('')
  const [legalModal, setLegalModal] = useState(null)
  const bgClass = shellBgClass(screen)
  const useAltBg = Boolean(bgClass)

  const handleNavigate = (next) => {
    if (next === 'tcs') {
      setLegalModal('terms')
      return
    }
    setScreen(next)
  }

  const handleGetVideo = () => {
    setFlowError('')
    setOrderId(null)
    setVideoUrl(null)
    setScreen('form')
  }

  const handleFormSubmit = async (values) => {
    setFlowError('')
    const response = await createVideo(values)
    setOrderId(response.orderId)
    setScreen('loading')
  }

  const handleVideoReady = (job) => {
    setVideoUrl(job.videoUrl)
    setOrderId(job.orderId || orderId)
    setScreen('result')
  }

  const handleVideoError = (message) => {
    setFlowError(message)
    setScreen('form')
  }

  const handleAgain = () => {
    setOrderId(null)
    setVideoUrl(null)
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
        <Header activeScreen={screen} onNavigate={handleNavigate} />
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
          {screen === 'loading' && (
            <Loading orderId={orderId} onReady={handleVideoReady} onError={handleVideoError} />
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
