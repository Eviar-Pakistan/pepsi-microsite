import { useState } from 'react'
import CtaButton from '../components/CtaButton'
import cassetteWeb from '../assets/images/home/web/cassette.png'
import headphoneWeb from '../assets/images/home/web/headphone.png'
import music1Web from '../assets/images/home/web/music-1.png'
import music2Web from '../assets/images/home/web/music-2.png'
import mobileCircles2 from '../assets/images/home/mobile/circles 2 mobile.png'
import webCircle1 from '../assets/images/home/web/web circle 1.png'
import './FormScreen.css'

const PHONE_RE = /^\+92[0-9]{10}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** English letters + single spaces between words; max 40 chars */
const NAME_MAX = 40
const NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/

function sanitizeName(value) {
  return value
    .replace(/[^A-Za-z ]/g, '')
    .replace(/ {2,}/g, ' ')
    .slice(0, NAME_MAX)
}

const INITIAL = {
  name: '',
  email: '',
  phone: '+92',
  packCode: '',
  privacyConsent: false,
  marketingOptIn: false,
  ageConfirmed: false,
}

/* Mobile mock: music TL, cassette TR, headphones BL, music notes BR */
const MOBILE_DECOS = [
  { src: music1Web, className: 'music-1' },
  { src: cassetteWeb, className: 'cassette' },
  { src: headphoneWeb, className: 'headphones-web' },
  { src: music2Web, className: 'music-2' },
]

const WEB_DECOS = [
  { src: music1Web, className: 'music-1' },
  { src: headphoneWeb, className: 'headphones-web' },
  { src: cassetteWeb, className: 'cassette' },
  { src: music2Web, className: 'music-2' },
]

export default function FormScreen({ onSubmit, onOpenTerms, onOpenPrivacy }) {
  const [values, setValues] = useState(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setValues((prev) => ({ ...prev, [name]: checked }))
      return
    }

    if (name === 'name') {
      setValues((prev) => ({ ...prev, name: sanitizeName(value) }))
      return
    }

    if (name === 'phone') {
      let next = value.replace(/[^\d+]/g, '')
      if (!next.startsWith('+92')) {
        next = `+92${next.replace(/^\+?92?/, '').replace(/\D/g, '')}`
      }
      const digits = next.slice(3).replace(/\D/g, '').slice(0, 10)
      setValues((prev) => ({ ...prev, phone: `+92${digits}` }))
      return
    }

    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const nameTrimmed = values.name.trim()
  const isNameValid =
    nameTrimmed.length > 0 &&
    nameTrimmed.length <= NAME_MAX &&
    NAME_RE.test(nameTrimmed)

  const isFormReady =
    isNameValid &&
    EMAIL_RE.test(values.email.trim()) &&
    PHONE_RE.test(values.phone.trim()) &&
    Boolean(values.packCode.trim()) &&
    values.privacyConsent === true &&
    values.ageConfirmed === true

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || !isFormReady) return

    if (!nameTrimmed) {
      setError('Please enter your name.')
      return
    }
    if (nameTrimmed.length > NAME_MAX) {
      setError('Name must be 40 characters or fewer.')
      return
    }
    if (!NAME_RE.test(nameTrimmed)) {
      setError('Name can only use English letters (and spaces between words).')
      return
    }
    if (!EMAIL_RE.test(values.email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (!PHONE_RE.test(values.phone.trim())) {
      setError('Enter a valid Pakistani mobile number, e.g. +923001234567.')
      return
    }
    if (!values.packCode.trim()) {
      setError('Please enter your pack code.')
      return
    }
    if (!values.privacyConsent) {
      setError('Please accept the Privacy Notice and Terms & Conditions.')
      return
    }
    if (!values.ageConfirmed) {
      setError('Please confirm you are over 18 and agree to the Terms & Conditions.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit({ ...values, name: nameTrimmed })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-screen">
      {/* Mobile only — pulse circles 2 over shell Background.png */}
      <div className="form-screen__mobile-fx" aria-hidden="true">
        <img src={mobileCircles2} alt="" className="form-screen__mobile-fx-circles" />
      </div>
      {/* Tablet + laptop — pulse web circle 1 over Background web.png */}
      <div className="form-screen__web-fx" aria-hidden="true">
        <img src={webCircle1} alt="" className="form-screen__web-fx-circles" />
      </div>
      <div className="form-stage">
        {MOBILE_DECOS.map((deco) => (
          <span
            key={`m-${deco.className}`}
            className={`form-stage__deco form-stage__deco--mobile form-stage__deco--${deco.className}`}
            aria-hidden="true"
          >
            <img src={deco.src} alt="" />
          </span>
        ))}

        {WEB_DECOS.map((deco) => (
          <span
            key={`w-${deco.className}`}
            className={`form-stage__deco form-stage__deco--web form-stage__deco--${deco.className}`}
            aria-hidden="true"
          >
            <img src={deco.src} alt="" />
          </span>
        ))}

        <form className="form-panel" onSubmit={handleSubmit}>
          <h1 className="form-panel__title">ENTER YOUR DETAILS</h1>
          <p className="form-panel__subtitle">
            Drop your details so Young Stunners can cook up your personalized video.
          </p>

          <div className="form-fields">
            <label className="form-field">
              <span className="form-field__label">NAME:</span>
              <input
                className="form-field__input"
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={NAME_MAX}
                pattern="[A-Za-z]+( [A-Za-z]+)*"
                title="English letters only, up to 40 characters"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">EMAIL ADDRESS:</span>
              <input
                className="form-field__input"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">PHONE NUMBER:</span>
              <input
                className="form-field__input"
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+923001234567"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">ENTER PACK CODE:</span>
              <input
                className="form-field__input"
                type="text"
                name="packCode"
                value={values.packCode}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </label>
          </div>

          <div className="form-consents">
            <label className="form-consent">
              <input
                type="checkbox"
                name="privacyConsent"
                checked={values.privacyConsent}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <span>
                I have read the{' '}
                <button type="button" className="form-consent__link" onClick={onOpenTerms}>
                  Ts &amp; Cs
                </button>{' '}
                and consent to the use of my personal data as per the{' '}
                <button type="button" className="form-consent__link" onClick={onOpenPrivacy}>
                  Privacy Notice
                </button>
                . I have the option to opt-out anytime.
                <span className="form-consent__required"> *</span>
              </span>
            </label>

            <label className="form-consent">
              <input
                type="checkbox"
                name="marketingOptIn"
                checked={values.marketingOptIn}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <span>
                I consent to receiving product information and promotional offers from PepsiCo,
                electronically, including SMS and WhatsApp.
              </span>
            </label>

            <label className="form-consent">
              <input
                type="checkbox"
                name="ageConfirmed"
                checked={values.ageConfirmed}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <span>
                I confirm that I am over 18 and agree to the{' '}
                <button type="button" className="form-consent__link" onClick={onOpenTerms}>
                  Terms and Conditions
                </button>{' '}
                of the activity.
                <span className="form-consent__required"> *</span>
              </span>
            </label>
          </div>

          {error ? <p className="form-panel__error">{error}</p> : null}

          <div className="form-panel__cta">
            <CtaButton
              type="submit"
              disabled={!isFormReady || isSubmitting}
              className={isFormReady && !isSubmitting ? 'cta-btn--ready' : ''}
            />
          </div>
        </form>
      </div>
    </section>
  )
}
