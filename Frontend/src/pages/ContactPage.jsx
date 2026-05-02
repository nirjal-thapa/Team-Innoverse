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

            <article>
              <span className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <h3>Location</h3>
                <p>Kathmandu, Nepal</p>
              </div>
            </article>

            <article>
              <span className="contact-method-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 14a8 8 0 0 1 16 0" />
                  <path d="M4 14v3a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 2Z" />
                  <path d="M20 14v3a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 2Z" />
                </svg>
              </span>
              <div>
                <h3>Studio Support</h3>
                <p>Wedding, event, and photography studio workflows.</p>
              </div>
            </article>
          </div>
        </div>

        <form className="contact-form">
          <div className="contact-form-heading">
            <span>Send a Message</span>
            <h2>Tell us what you need</h2>
          </div>

          <div className="contact-form-grid">
            <label className="form-field">
              <span>Name</span>
              <input type="text" name="name" placeholder="Your name" required />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input type="email" name="email" placeholder="studio@example.com" required />
            </label>
          </div>

          <label className="form-field">
            <span>Topic</span>
            <select name="topic" defaultValue="AI photo finder">
              <option>AI photo finder</option>
              <option>Studio dashboard</option>
              <option>Packages and pricing</option>
              <option>Event gallery support</option>
            </select>
          </label>

          <label className="form-field">
            <span>Message</span>
            <textarea name="message" rows="5" placeholder="How can we help?" required></textarea>
          </label>
        </form>
      </section>
    </main>
  );
}
