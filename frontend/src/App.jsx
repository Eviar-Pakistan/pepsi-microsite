import { useState } from 'react'
import Header from './components/Header'
import Home from './screens/Home'
import FormScreen from './screens/FormScreen'
import Loading from './screens/Loading'
import HowItWorks from './screens/HowItWorks'
import Result from './screens/Result'
import { createVideo } from './api/videos'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [orderId, setOrderId] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [flowError, setFlowError] = useState('')

  const handleNavigate = (next) => {
    if (next === 'tcs') return
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
      <div className="phone-shell">
        <Header activeScreen={screen} onNavigate={handleNavigate} />
        <main className="phone-shell__content">
          {screen === 'home' && <Home onGetVideo={handleGetVideo} />}
          {screen === 'form' && (
            <>
              {flowError ? <p className="app-flow-error">{flowError}</p> : null}
              <FormScreen onSubmit={handleFormSubmit} />
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
    </div>
  )
}
