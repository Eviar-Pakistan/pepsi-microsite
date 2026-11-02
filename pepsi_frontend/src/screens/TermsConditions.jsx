import './TermsConditions.css'

const PRIVACY_URL =
  'https://platformassets.wspprod.com/pepsiredemptionpolicy-static/privacypolicy-eng.html'

export default function TermsConditions() {
  return (
    <section className="terms">
      <h1 className="terms__title">Terms &amp; Conditions</h1>
      <p className="terms__lead">
        By entering into the activity, the participant (you, your) agrees to be bound by the
        following Terms &amp; Conditions:
      </p>

      <h2 className="terms__heading">About the Challenge</h2>
      <p>
        The Activity is operated by Pepsi-Cola International Pvt Ltd. The activity runs for the
        published campaign period. The Activity is not sponsored, endorsed, administered by or
        associated with any social media site on which it is hosted. Entries received after the
        closing date will not be processed.
      </p>

      <h2 className="terms__heading">How to enter</h2>
      <p>Entry to the Activity is voluntary. To enter into the activity, you must:</p>
      <ol className="terms__list">
        <li>Purchase the limited edition Pepsi x Young Stunners box from the Foodpanda website and application.</li>
        <li>Scan the QR code inside the purchased box.</li>
        <li>Fill out the required information on the microsite including your name, city and email.</li>
        <li>
          Once submitted, your video with your customised RAP Young Stunners will be delivered as
          described on the microsite.
        </li>
      </ol>
      <p>
        You may make one entry per purchase of Pepsi x Young Stunners; multiple entries are
        permitted for each purchase.
      </p>

      <h2 className="terms__heading">Eligibility</h2>
      <p>
        The Activity is open to individuals who are resident in Pakistan and aged 18 years and
        above holding a valid CNIC number. When entering the Activity, you must use your real name.
      </p>
      <p>
        Employees and those of our affiliates, agents or distributors (including any promotion
        partners or prize providers) and their respective immediate family and household members
        are not permitted to participate in the Activity.
      </p>
      <p>
        We reserve the right to exclude or disqualify any entry which we consider does not comply
        with these Terms &amp; Conditions or any participant who has acted in an unfair, fraudulent
        or misleading manner or otherwise in breach of these Terms &amp; Conditions.
      </p>
      <p>
        The video shall not contain any obscenity, political affiliations, nudity or any element
        against the social and cultural norms of Pakistan.
      </p>
      <p>
        You must confirm that you are 18 years &amp; above, and accept the Ts&amp;Cs. You consent to
        processing of your personal data as per PepsiCo Pakistan Privacy Notice.
      </p>

      <h2 className="terms__heading">Limitation of liability</h2>
      <p>
        Your entry or participation in the Activity is at your own risk. To the maximum extent
        permitted by law, we shall not be liable for any injury or loss arising out of your
        participation in the Activity or your inability to participate in the Activity. We accept
        no responsibility for entries not successfully completed due to a technical fault,
        malfunction or failure of any kind.
      </p>

      <h2 className="terms__heading">Ownership of entries</h2>
      <p>
        By entering the Activity or submitting any video, image, audio file or other materials
        (Content) in relation to the Activity:
      </p>
      <ul className="terms__list">
        <li>
          you agree that we can re-post, publicise and otherwise use such Content via any social
          media network or platform, including our websites;
        </li>
        <li>
          you confirm that you own and control all of the rights in the Content and you have the
          right to use and submit the same;
        </li>
        <li>
          you confirm that you have obtained appropriate consent from anyone featured or mentioned
          in the Content and that the Content (and our use of it pursuant to these Terms &amp;
          Conditions) does not and will not infringe the rights of any individual or business
          (including any intellectual property rights, moral rights, right to privacy or
          confidentiality);
        </li>
        <li>
          your entry does not violate any applicable law and does not contain anything which is
          obscene, indecent, untrue, misleading, defamatory or derogatory in any way or which would
          incite crime or public disorder.
        </li>
      </ul>

      <h2 className="terms__heading">Publicity and data protection</h2>
      <p>
        If your entry is selected, you may be required to participate in reasonable publicity. We
        may publish and use any Content and your name/username, image, likeness, voice and video
        footage in any and all media for publicity purposes during the Activity and after the
        Activity ends. You will sign an appropriate release form for this purpose if requested by
        us.
      </p>
      <p>
        All personal information that you provide to us or which we obtain during the Activity
        shall be handled by us in accordance with these Terms &amp; Conditions and the{' '}
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer">
          PepsiCo Privacy Policy
        </a>
        .
      </p>

      <h2 className="terms__heading">General</h2>
      <p>
        The Activity is subject to the laws of Pakistan and any disputes arising in connection with
        them shall be subject to the exclusive jurisdiction of the Pakistan courts.
      </p>
      <p>
        We reserve the right to hold void, suspend or cancel this Activity and/or change these
        Terms &amp; Conditions from time to time if we consider it necessary or appropriate to do
        so. It is your responsibility to review these Terms &amp; Conditions for any changes.
      </p>
    </section>
  )
}

export { PRIVACY_URL }
