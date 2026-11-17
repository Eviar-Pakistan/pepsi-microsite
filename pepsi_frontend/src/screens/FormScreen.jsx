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
/** ASCII / English email only — no non-English scripts */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
/** English letters + single spaces between words; max 20 chars per part */
const NAME_PART_MAX = 20
const NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/

function sanitizeNamePart(value) {
  return value
    .replace(/[^A-Za-z ]/g, '')
    .replace(/ {2,}/g, ' ')
    .slice(0, NAME_PART_MAX)
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
  firstName: '',
  lastName: '',
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

    if (name === 'firstName' || name === 'lastName') {
      setValues((prev) => ({ ...prev, [name]: sanitizeNamePart(value) }))
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

  const firstNameTrimmed = values.firstName.trim()
  const lastNameTrimmed = values.lastName.trim()
  const isNamePartValid = (value) =>
    value.length > 0 && value.length <= NAME_PART_MAX && NAME_RE.test(value)

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
    isNamePartValid(firstNameTrimmed) &&
    isNamePartValid(lastNameTrimmed) &&
    EMAIL_RE.test(values.email.trim()) &&
    isPhoneValid &&
    isPackValid &&
    values.privacyConsent === true &&
    values.ageConfirmed === true

  const toggleTip = (id) => {
    setOpenTip((prev) => (prev === id ? null : id))
  }

  const validateNamePart = (value, label) => {
    if (!value) {
      setError(`Please enter your ${label}.`)
      return false
    }
    if (value.length > NAME_PART_MAX) {
      setError(`${label} must be ${NAME_PART_MAX} characters or fewer.`)
      return false
    }
    if (!NAME_RE.test(value)) {
      setError(
        `${label} can only use English letters (and spaces between words).`,
      )
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting || !isFormReady) return

    if (!validateNamePart(firstNameTrimmed, 'First name')) return
    if (!validateNamePart(lastNameTrimmed, 'Last name')) return
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
        firstName: firstNameTrimmed,
        lastName: lastNameTrimmed,
      })
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
            <div className="form-fields__names">
              <label className="form-field">
                <span className="form-field__label">FIRST NAME:</span>
                <input
                  className="form-field__input"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  maxLength={NAME_PART_MAX}
                  pattern="[A-Za-z]+( [A-Za-z]+)*"
                  title="English letters only, up to 20 characters"
                  placeholder="John"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className="form-field">
                <span className="form-field__label">LAST NAME:</span>
                <input
                  className="form-field__input"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  maxLength={NAME_PART_MAX}
                  pattern="[A-Za-z]+( [A-Za-z]+)*"
                  title="English letters only, up to 20 characters"
                  placeholder="Doe"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

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
