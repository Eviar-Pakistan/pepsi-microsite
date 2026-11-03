import { PRIVACY_URL } from './TermsConditions'
import './TermsConditions.css'

export default function PrivacyNotice() {
  return (
    <section className="terms terms--modal">
      <p className="terms__lead">
        Pepsi-Cola International Pvt Ltd respects your privacy. This notice explains how we use
        personal data you submit on this microsite.
      </p>

      <h2 className="terms__heading">What we collect</h2>
      <p>
        When you request a personalized video we collect your name, email address, mobile number,
        pack code, and the consent choices you select.
      </p>

      <h2 className="terms__heading">How we use it</h2>
      <p>
        We use this information to create and deliver your Young Stunners personalized video, to
        operate the Activity, and only if you opt in to send product information and promotional
        offers from PepsiCo by email, SMS, or WhatsApp.
      </p>

      <h2 className="terms__heading">Sharing</h2>
      <p>
        We may share data with service providers who help run the Activity (including video
        generation partners), strictly for delivering the service. We do not sell your personal
        data.
      </p>

      <h2 className="terms__heading">Your choices</h2>
      <p>
        Marketing consent is optional. You may opt out of promotional messages at any time using
        the instructions in those messages or by contacting us through PepsiCo Pakistan support
        channels.
      </p>

      <h2 className="terms__heading">Full policy</h2>
      <p>
        For the complete PepsiCo Privacy Policy, please read:{' '}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
          PepsiCo Privacy Policy
        </a>
        .
      </p>
    </section>
  )
}
