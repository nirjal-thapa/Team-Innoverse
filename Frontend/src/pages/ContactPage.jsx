function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-copy">
          <span className="simple-page-badge">Contact</span>
          <h1>Let us help your studio deliver photos faster</h1>
          <p>
            Talk with Team Innoverse about events, AI photo matching, gallery delivery,
            or the right PhotoFly plan for your workflow.
          </p>
        </div>
      </section>

      <section className="contact-shell" aria-label="Contact PhotoFly">
        <div className="contact-info-panel">
          <span className="contact-panel-label">PhotoFly Support</span>
          <h2>We are here for studios, events, and client galleries.</h2>
          <p>
            Send us your question and we will help you plan uploads, AI face search,
            client sharing, or account setup.
          </p>

          <div className="contact-methods">
            <article>
              <span className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <div>
                <h3>Email</h3>
                <p>support@photofly.com</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
