import { useState } from 'react'
import CtaButton from '../components/CtaButton'
import vinyl from '../assets/images/home/vinyl.png'
import playIcon from '../assets/images/home/play-icon.png'
import headphone from '../assets/images/home/headphone.png'
import music from '../assets/images/home/music.png'
import './FormScreen.css'

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  address: '',
  packCode: '',
  city: '',
  purchaseType: 'online',
}

const DECOS = [
  { src: vinyl, className: 'vinyl' },
  { src: playIcon, className: 'play' },
  { src: headphone, className: 'headphones' },
  { src: music, className: 'music' },
]

export default function FormScreen({ onSubmit }) {
  const [values, setValues] = useState(INITIAL)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

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

            <label className="form-field form-field--desktop-only">
              <span className="form-field__label">PHONE NUMBER:</span>
              <input
                className="form-field__input"
                type="tel"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field form-field--desktop-only">
              <span className="form-field__label">ADDRESS:</span>
              <input
                className="form-field__input"
                type="text"
                name="address"
                value={values.address}
                onChange={handleChange}
                autoComplete="street-address"
                disabled={isSubmitting}
              />
            </label>

            <label className="form-field form-field--desktop-only">
              <span className="form-field__label">ENTER PACK CODE:</span>
              <input
                className="form-field__input"
                type="text"
                name="packCode"
                value={values.packCode}
                onChange={handleChange}
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

          <fieldset className="form-purchase" disabled={isSubmitting}>
            <legend className="form-purchase__legend">PURCHASE TYPE:</legend>
            <div className="form-purchase__options">
              <label className="form-purchase__option">
                <input
                  type="radio"
                  name="purchaseType"
                  value="online"
                  checked={values.purchaseType === 'online'}
                  onChange={handleChange}
                />
                <span className="form-purchase__radio" />
                <span>ONLINE</span>
              </label>
              <label className="form-purchase__option">
                <input
                  type="radio"
                  name="purchaseType"
                  value="in-store"
                  checked={values.purchaseType === 'in-store'}
                  onChange={handleChange}
                />
                <span className="form-purchase__radio" />
                <span>IN STORE</span>
              </label>
            </div>
          </fieldset>

          {error ? <p className="form-panel__error">{error}</p> : null}

          <div className="form-panel__cta">
            <CtaButton type="submit" disabled={isSubmitting} />
          </div>
        </form>
      </div>
    </section>
  )
}
