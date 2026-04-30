function ContactPage() {
  return (
    <main className="contact-page">
      <section className="simple-page-hero">
        <div className="simple-page-content">
          <span className="simple-page-badge">Contact Us</span>
          <h1>Talk to the PhotoFly team</h1>
          <p>
            Have questions about events, AI photo matching, or studio plans?
            Reach out and Team Innoverse will help you get started.
          </p>
        </div>
      </section>

      <section className="contact-layout">
        <article className="contact-card">
          <h2>Email</h2>
          <p>support@photofly.com</p>
        </article>
        <article className="contact-card">
          <h2>Location</h2>
          <p>Kathmandu, Nepal</p>
        </article>
        <article className="contact-card">
          <h2>Studio Support</h2>
          <p>Available for wedding, event, and photography studio workflows.</p>
        </article>
      </section>
    </main>
  );
}
