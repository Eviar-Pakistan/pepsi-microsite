import PulseBg from '../components/PulseBg'
import cassetteWeb from '../assets/images/home/web/cassette.png'
import headphoneWeb from '../assets/images/home/web/headphone.png'
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
      <PulseBg className="hiw__pulse" />
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
        {STEPS.map((step, index) => (
          <article
            key={step.title}
            className="hiw-card"
            style={{ '--hiw-float-delay': `${index * 0.35}s` }}
          >
            <h2 className="hiw-card__title">{step.title}</h2>
            <img src={step.icon} alt="" className="hiw-card__icon" />
            <p className="hiw-card__text">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
