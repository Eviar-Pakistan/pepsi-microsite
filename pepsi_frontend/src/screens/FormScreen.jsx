import { useState } from 'react'
import CtaButton from '../components/CtaButton'
import vinyl from '../assets/images/home/vinyl.png'
import playIcon from '../assets/images/home/play-icon.png'
import headphone from '../assets/images/home/headphone.png'
import music from '../assets/images/home/music.png'
import { PRIVACY_URL } from './TermsConditions'
import './FormScreen.css'

const INITIAL = {
  name: '',
  email: '',
  city: '',
  privacyConsent: false,
  marketingOptIn: false,
  ageConfirmed: false,
}

const DECOS = [
  { src: vinyl, className: 'vinyl' },
  { src: playIcon, className: 'play' },
  { src: headphone, className: 'headphones' },
  { src: music, className: 'music' },
]

export default function FormScreen({ onSubmit, onOpenTerms }) {
  const [values, setValues] = useState(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      setValues((prev) => ({ ...prev, [name]: checked }))
      return
    }
    const next = name === 'name' || name === 'city' ? value.replace(/\d/g, '') : value
    setValues((prev) => ({ ...prev, [name]: next }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    if (/\d/.test(values.name)) {
      setError('Name cannot contain numbers.')
      return
    }
    if (/\d/.test(values.city)) {
      setError('City cannot contain numbers.')
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
      await onSubmit(values)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-screen">
      <div className="form-stage">
        {DECOS.map((deco) => (
          <span
            key={deco.className}
            className={`form-stage__deco form-stage__deco--${deco.className}`}
            aria-hidden="true"
          >
            <span className="form-stage__deco-mask" />
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
              <span className="form-field__label">CITY:</span>
              <input
                className="form-field__input"
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange}
                autoComplete="address-level2"
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
                <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
                  Privacy Notice
                </a>
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
            <CtaButton type="submit" disabled={isSubmitting} />
          </div>
        </form>
      </div>
    </section>
  )
}
