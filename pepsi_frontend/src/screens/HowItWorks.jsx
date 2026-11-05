import cassetteWeb from '../assets/images/home/web/cassette.png'
import headphoneWeb from '../assets/images/home/web/headphone.png'
import mobileCircles2 from '../assets/images/home/mobile/circles 2 mobile.png'
import webCircle1 from '../assets/images/home/web/web circle 1.png'
import step1 from '../assets/images/how-it-works/step-1.png'
import step2 from '../assets/images/how-it-works/step-2.png'
import step3 from '../assets/images/how-it-works/step-3.png'
import step4 from '../assets/images/how-it-works/step-4.png'
import './HowItWorks.css'

const STEPS = [
  {
    title: '1. SCAN',
    icon: step1,
    text: 'YOUR QR IS WAITING INSIDE THE BOX.',
  },
  {
    title: '2. DROP YOUR NAME',
    icon: step2,
    text: "TELL US WHO WE'RE MAKING THIS FOR.",
  },
  {
    title: '3. GET YOUR VIDEO',
    icon: step3,
    text: "THAT'S YOUR NAME IN THEIR BARS.",
  },
  {
    title: '4. FLEX YOUR MOMENT',
    icon: step4,
    text: 'DOWNLOAD IT AND MAKE SOME NOISE.',
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw">
      {/* Mobile only — pulse circles 2 over shell Background.png */}
      <div className="hiw__mobile-fx" aria-hidden="true">
        <img src={mobileCircles2} alt="" className="hiw__mobile-fx-circles" />
      </div>
      {/* Tablet + laptop — pulse web circle 1 over Background web.png (same as form) */}
      <div className="hiw__web-fx" aria-hidden="true">
        <img src={webCircle1} alt="" className="hiw__web-fx-circles" />
      </div>
      <div className="hiw__heading">
        <img
          src={cassetteWeb}
          alt=""
          className="hiw__heading-icon hiw__heading-icon--cassette"
        />
        <h1 className="hiw__title">HOW IT WORKS</h1>
        <img
          src={headphoneWeb}
          alt=""
          className="hiw__heading-icon hiw__heading-icon--headphones"
        />
      </div>

      <div className="hiw__grid">
        {STEPS.map((step) => (
          <article key={step.title} className="hiw-card">
            <h2 className="hiw-card__title">{step.title}</h2>
            <img src={step.icon} alt="" className="hiw-card__icon" />
            <p className="hiw-card__text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
