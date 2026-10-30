import CtaButton from '../components/CtaButton'
import stunnersLogo from '../assets/images/home/stunners-logo.png'
import xMark from '../assets/images/home/x.png'
import pepsiWordmark from '../assets/images/home/pepsi-wordmark.png'
import artists from '../assets/images/home/artists.png'
import vinyl from '../assets/images/home/vinyl.png'
import speakerLeft from '../assets/images/home/speaker-left.png'
import speakerRight from '../assets/images/home/speaker-right.png'
import headphone from '../assets/images/home/headphone.png'
import music from '../assets/images/home/music.png'
import playIcon from '../assets/images/home/play-icon.png'
import './Home.css'

export default function Home({ onGetVideo }) {
  return (
    <section className="home">
      <div className="home__top">
        <div className="home__lockup">
          <img src={stunnersLogo} alt="Young Stunners" className="home__ys-logo" />
          <img src={xMark} alt="" className="home__x" />
          <img src={pepsiWordmark} alt="Pepsi" className="home__pepsi-word" />
        </div>

        <h1 className="home__headline">
          <span>WANNA HEAR</span>
          <span>YOUNG STUNNERS</span>
          <span>RAP YOUR NAME?</span>
        </h1>

        <p className="home__support">
          Scan the code from the box or enter your details to get a custom rap video.
        </p>

        <div className="home__cta">
          <CtaButton onClick={onGetVideo} />
        </div>
      </div>

      <div className="home__stage" aria-hidden="true">
        <img src={vinyl} alt="" className="home__prop home__prop--vinyl" />
        <img src={speakerLeft} alt="" className="home__prop home__prop--speaker-l" />
        <img src={speakerRight} alt="" className="home__prop home__prop--speaker-r" />
        <img src={headphone} alt="" className="home__prop home__prop--headphones" />
        <img src={artists} alt="Young Stunners" className="home__artists" />
        <img src={music} alt="" className="home__prop home__prop--music" />
        <img src={playIcon} alt="" className="home__prop home__prop--play" />
      </div>
    </section>
  )
}
