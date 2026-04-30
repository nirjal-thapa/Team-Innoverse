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
