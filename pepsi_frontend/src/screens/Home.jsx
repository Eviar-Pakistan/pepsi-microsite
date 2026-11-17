import CtaButton from '../components/CtaButton'
import youngStunnersWeb from '../assets/images/home/web/young-stunners.png'
import xMark from '../assets/images/home/x.png'
import pepsiWordmark from '../assets/images/home/pepsi-wordmark.png'
import artistsWeb from '../assets/images/home/web/ys.png'
import cassetteWeb from '../assets/images/home/web/cassette.png'
import headphoneWeb from '../assets/images/home/web/headphone.png'
import music1Web from '../assets/images/home/web/music-1.png'
import music2Web from '../assets/images/home/web/music-2.png'
import mobileCircles from '../assets/images/home/mobile/circles.png'
import webCircle2 from '../assets/images/home/web/Web circle 2.png'
import './Home.css'

export default function Home({ onGetVideo }) {
  return (
    <section className="home">
      {/* Mobile only — pulse the circles.png asset (Background.png is on the shell) */}
      <div className="home__mobile-fx" aria-hidden="true">
        <img src={mobileCircles} alt="" className="home__mobile-fx-circles" />
      </div>

      {/* Tablet + laptop — pulse Web circle 2 over Background web.png */}
      <div className="home__web-fx" aria-hidden="true">
        <img src={webCircle2} alt="" className="home__web-fx-circles" />
      </div>

      <div className="home__top">
        <div className="home__lockup">
          <img
            src={youngStunnersWeb}
            alt="Young Stunners"
            className="home__ys-logo"
          />
          <img src={xMark} alt="" className="home__x" />
          <img src={pepsiWordmark} alt="Pepsi" className="home__pepsi-word" />
        </div>

        <h1 className="home__headline home__headline--mobile">
          <span>YOUR NAME</span>
          <span>IN A</span>
          <span>YOUNG STUNNERS</span>
          <span>RAP SONG</span>
        </h1>

        <h1 className="home__headline home__headline--web">
          <span>WANNA HEAR</span>
          <span>YOUNG STUNNERS</span>
          <span>RAP YOUR NAME?</span>
        </h1>

        <p className="home__support">
          Scan the QR code from the box, enter the pack code & your details to get a custom rap video from Young Stunners
        </p>

        <div className="home__cta">
          <CtaButton className="home__cta-btn--mobile" onClick={onGetVideo}>
            GET STARTED
          </CtaButton>
          <CtaButton className="home__cta-btn--web" onClick={onGetVideo} />
        </div>
      </div>

      <div className="home__stage" aria-hidden="true">
        <img src={cassetteWeb} alt="" className="home__sticker home__sticker--cassette" />
        <img src={music1Web} alt="" className="home__sticker home__sticker--music-a" />
        <img src={music1Web} alt="" className="home__sticker home__sticker--music-b" />
        <img src={music2Web} alt="" className="home__sticker home__sticker--music-2" />
        <img src={headphoneWeb} alt="" className="home__sticker home__sticker--headphones" />
        <div className="home__artists-wrap">
          <img src={artistsWeb} alt="Young Stunners" className="home__artists" />
          {/* Diagonal sheen over blue glasses lenses */}
          <span className="home__lens-shine home__lens-shine--ll" aria-hidden="true" />
          <span className="home__lens-shine home__lens-shine--lr" aria-hidden="true" />
          <span className="home__lens-shine home__lens-shine--rl" aria-hidden="true" />
          <span className="home__lens-shine home__lens-shine--rr" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
