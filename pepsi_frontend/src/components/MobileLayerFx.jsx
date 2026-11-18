import flow1 from '../assets/images/home/layers mobile screen 2/1.png'
import flow2 from '../assets/images/home/layers mobile screen 2/2.png'
import flow3 from '../assets/images/home/layers mobile screen 2/3.png'
import flow4 from '../assets/images/home/layers mobile screen 2/4.png'
import flow5 from '../assets/images/home/layers mobile screen 2/5.png'
import flow6 from '../assets/images/home/layers mobile screen 2/6.png'
import flow7 from '../assets/images/home/layers mobile screen 2/7.png'
import home1 from '../assets/images/home/layers mobile screen 1/1.png'
import home2 from '../assets/images/home/layers mobile screen 1/2.png'
import home3 from '../assets/images/home/layers mobile screen 1/3.png'
import home4 from '../assets/images/home/layers mobile screen 1/4.png'
import home5 from '../assets/images/home/layers mobile screen 1/5.png'
import home6 from '../assets/images/home/layers mobile screen 1/6.png'
import home7 from '../assets/images/home/layers mobile screen 1/7.png'
import webFlow1 from '../assets/images/home/layers web screen 2/1.png'
import webFlow2 from '../assets/images/home/layers web screen 2/2.png'
import webFlow3 from '../assets/images/home/layers web screen 2/3.png'
import webFlow4 from '../assets/images/home/layers web screen 2/4.png'
import webFlow5 from '../assets/images/home/layers web screen 2/5.png'
import webFlow6 from '../assets/images/home/layers web screen 2/6.png'
import webHome1 from '../assets/images/home/layers web screen 1/1.png'
import webHome2 from '../assets/images/home/layers web screen 1/2.png'
import webHome3 from '../assets/images/home/layers web screen 1/3.png'
import webHome4 from '../assets/images/home/layers web screen 1/4.png'
import webHome5 from '../assets/images/home/layers web screen 1/5.png'
import webHome6 from '../assets/images/home/layers web screen 1/6.png'
import webHome7 from '../assets/images/home/layers web screen 1/7.png'
import './MobileLayerFx.css'

const FLOW_MOBILE = [flow1, flow2, flow3, flow4, flow5, flow6, flow7]
const HOME_MOBILE = [home1, home2, home3, home4, home5, home6, home7]
const FLOW_WEB = [webFlow1, webFlow2, webFlow3, webFlow4, webFlow5, webFlow6]
const HOME_WEB = [webHome1, webHome2, webHome3, webHome4, webHome5, webHome6, webHome7]

function LayerStack({ layers, className, imgClass }) {
  return (
    <div className={className} aria-hidden="true">
      {layers.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={imgClass}
          style={{ '--i': i }}
        />
      ))}
    </div>
  )
}

/**
 * Layered ring FX:
 * - home: mobile screen 1 + tablet/desktop web screen 1
 * - flow: mobile screen 2 + tablet/desktop web screen 2
 * All viewports: continuous breathe — opacity + scale up, then gradual scale down
 */
export default function MobileLayerFx({ variant = 'flow' }) {
  const mobile = variant === 'home' ? HOME_MOBILE : FLOW_MOBILE
  const web = variant === 'home' ? HOME_WEB : FLOW_WEB

  const webClass =
    variant === 'home' ? 'web-layer-fx web-layer-fx--home' : 'web-layer-fx'

  return (
    <>
      <LayerStack
        layers={mobile}
        className="mobile-layer-fx"
        imgClass="mobile-layer-fx__img"
      />
      <LayerStack layers={web} className={webClass} imgClass="web-layer-fx__img" />
    </>
  )
}
