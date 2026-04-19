function AboutPage() {
  return (
    <main className="simple-page">
      <section className="simple-page-hero about-page-hero">
        <div className="simple-page-content">
          <span className="simple-page-badge">About Us</span>
          <h1>Built by Team Innoverse for modern photo studios</h1>
          <p>
            PhotoFly helps studios deliver event photos faster using AI face
            matching, organized galleries, and a cleaner client experience.
          </p>
        </div>
      </section>

      <section className="about-story">
        <article>
          <h2>Our Mission</h2>
          <p>
            We want every event guest to find their memories without scrolling
            through thousands of images.
          </p>
        </article>
        <article>
          <h2>Our Focus</h2>
          <p>
            Simple studio tools, fast photo discovery, and a polished sharing
            experience for clients.
          </p>
        </article>
      </section>
    </main>
  );
}
