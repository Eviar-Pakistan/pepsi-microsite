import { useState } from 'react'
import CtaButton from '../components/CtaButton'
import cassetteWeb from '../assets/images/home/web/cassette.png'
import headphoneWeb from '../assets/images/home/web/headphone.png'
import music1Web from '../assets/images/home/web/music-1.png'
import music2Web from '../assets/images/home/web/music-2.png'
import MobileLayerFx from '../components/MobileLayerFx'
import './FormScreen.css'

const PHONE_RE = /^\+92[0-9]{10}$/
/** ASCII / English email only — no non-English scripts */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
/** Single English word only; max 10 characters; no spaces */
const NAME_MAX = 10
const NAME_RE = /^[A-Za-z]+$/

function sanitizeName(value) {
  return value.replace(/[^A-Za-z]/g, '').slice(0, NAME_MAX)
}

function sanitizeEmail(value) {
  return value.replace(/[^A-Za-z0-9.@_%+-]/g, '').slice(0, 254)
}

const PACK_MAX = 5
const PACK_RE = /^[A-Za-z0-9]{5}$/

function sanitizePackCode(value) {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, PACK_MAX)
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
  const [openTip, setOpenTip] = useState(null)
  const [touched, setTouched] = useState({ phone: false, packCode: false })

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

    if (name === 'email') {
      setValues((prev) => ({ ...prev, email: sanitizeEmail(value) }))
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

    if (name === 'packCode') {
      setValues((prev) => ({ ...prev, packCode: sanitizePackCode(value) }))
      return
    }

    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const nameTrimmed = values.name.trim()
  const isNameValid =
    nameTrimmed.length > 0 &&
    nameTrimmed.length <= NAME_MAX &&
    NAME_RE.test(nameTrimmed)

  const phoneDigits = values.phone.replace(/\D/g, '').slice(2)
  const isPhoneValid = PHONE_RE.test(values.phone.trim())
  const phoneTipMessage = !isPhoneValid
    ? phoneDigits.length < 10
      ? `Needs 10 digits after +92 (${phoneDigits.length}/10).`
      : 'Enter a valid Pakistani mobile, e.g. +923001234567.'
    : null

  const pack = values.packCode.trim()
  const isPackValid = PACK_RE.test(pack)
  const packTipMessage = !isPackValid
    ? !pack
      ? 'Enter a 5-character pack code.'
      : `Pack code needs 5 characters (${pack.length}/5).`
    : null

  /* Show ! only after blur, if still invalid */
  const showPhoneTip = touched.phone && Boolean(phoneTipMessage)
  const showPackTip = touched.packCode && Boolean(packTipMessage)

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const isFormReady =
    isNameValid &&
    EMAIL_RE.test(values.email.trim()) &&
    isPhoneValid &&
    isPackValid &&
    values.privacyConsent === true &&
    values.ageConfirmed === true

  const toggleTip = (id) => {
    setOpenTip((prev) => (prev === id ? null : id))
  }

  const validateName = (value) => {
    if (!value) {
      setError('Please enter your name.')
      return false
    }
    if (value.length > NAME_MAX) {
      setError(`Name must be ${NAME_MAX} characters or fewer.`)
      return false
    }
    if (!NAME_RE.test(value)) {
      setError('Name must be a single word using English letters only (no spaces).')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || !isFormReady) return

    if (!validateName(nameTrimmed)) return
    if (!EMAIL_RE.test(values.email.trim())) {
      setError('Enter a valid English email address (letters, numbers, and @ . _ % + - only).')
      return
    }
    if (!PHONE_RE.test(values.phone.trim())) {
      setError('Enter a valid Pakistani mobile number, e.g. +923001234567.')
      return
    }
    if (!PACK_RE.test(values.packCode.trim())) {
      setError('Enter a valid 5-character pack code.')
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
      await onSubmit({
        ...values,
        name: nameTrimmed,
      })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-screen">
      <MobileLayerFx />
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
                autoComplete="given-name"
                maxLength={NAME_MAX}
                pattern="[A-Za-z]+"
                title="One English word only, up to 10 characters, no spaces"
                placeholder="Ahmad"
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
                maxLength={254}
                inputMode="email"
                title="English letters and numbers only"
                placeholder="example@mail.com"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field">
              <span className="form-field__label">PHONE NUMBER:</span>
              <div className="form-field__control">
                <input
                  className={`form-field__input${showPhoneTip ? ' form-field__input--with-tip' : ''}`}
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={() => markTouched('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+923001234567"
                  required
                  disabled={isSubmitting}
                />
                {showPhoneTip ? (
                  <button
                    type="button"
                    className={`form-field__tip-btn${openTip === 'phone' ? ' is-open' : ''}`}
                    aria-label="Phone number help"
                    aria-expanded={openTip === 'phone'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleTip('phone')
                    }}
                  >
                    !
                    <span className="form-field__tip" role="tooltip">
                      {phoneTipMessage}
                    </span>
                  </button>
                ) : null}
              </div>
            </label>

            <label className="form-field">
              <span className="form-field__label">ENTER PACK CODE:</span>
              <div className="form-field__control">
                <input
                  className={`form-field__input${showPackTip ? ' form-field__input--with-tip' : ''}`}
                  type="text"
                  name="packCode"
                  value={values.packCode}
                  onChange={handleChange}
                  onBlur={() => markTouched('packCode')}
                  maxLength={5}
                  inputMode="text"
                  autoCapitalize="characters"
                  placeholder="XXXXX"
                  title="5-character pack code"
                  required
                  disabled={isSubmitting}
                />
                {showPackTip ? (
                  <button
                    type="button"
                    className={`form-field__tip-btn${openTip === 'pack' ? ' is-open' : ''}`}
                    aria-label="Pack code help"
                    aria-expanded={openTip === 'pack'}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault()
                      toggleTip('pack')
                    }}
                  >
                    !
                    <span className="form-field__tip" role="tooltip">
                      {packTipMessage}
                    </span>
                  </button>
                ) : null}
              </div>
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
