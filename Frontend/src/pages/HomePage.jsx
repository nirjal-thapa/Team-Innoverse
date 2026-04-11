function HomePage({ title }) {
  return (
    <main>
      <section className="welcome-section">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>{title}</h2>
          <p className="welcome-text">
            Here you can manage events, check photo delivery updates, and start
            building the PhotoFly dashboard section by section.
          </p>
        </div>

        <div className="welcome-card">
          <p className="card-label">Today</p>
          <strong>12 new notifications</strong>
          <span>3 events need review</span>
        </div>
      </section>
    </main>
  );
}
