import playIcon from '../assets/images/home/play-icon.png'
import music from '../assets/images/home/music.png'
import step1 from '../assets/images/how-it-works/step-1.png'
import step2 from '../assets/images/how-it-works/step-2.png'
import step3 from '../assets/images/how-it-works/step-3.png'
import step4 from '../assets/images/how-it-works/step-4.png'
import './HowItWorks.css'

const STEPS = [
  {
    title: '1. GET IN',
    icon: step1,
    text: 'YOUR QR IS WAITING INSIDE THE BOX.',
  },
  {
    title: '2. DROP YOUR NAME',
    icon: step2,
    text: "TELL US WHO WE'RE MAKING THIS FOR.",
  },
  {
    title: '3. PRESS PLAY',
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
      <div className="hiw__heading">
        <img src={playIcon} alt="" className="hiw__heading-icon hiw__heading-icon--play" />
        <div className="hiw__heading-copy">
          <h1 className="hiw__title">HOW IT WORKS</h1>
          <p className="hiw__subtitle">
            Four quick steps from your Pepsi pack to your Young Stunners drop.
          </p>
        </div>
        <img src={music} alt="" className="hiw__heading-icon hiw__heading-icon--music" />
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
