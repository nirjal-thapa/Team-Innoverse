function AIPhotoFinderPage() {
  return (
    <main className="simple-page">
      <section className="simple-page-hero finder-page-hero">
        <div className="simple-page-content">
          <span className="simple-page-badge">AI Photo Finder</span>
          <h1>Find every guest photo in seconds</h1>
          <p>
            Upload a selfie and let PhotoFly match faces across thousands of
            event photos. This page will become the working AI demo area.
          </p>
        </div>
      </section>

      <section className="simple-page-grid">
        <article className="simple-info-card">
          <span>1</span>
          <h2>Upload selfie</h2>
          <p>Guests add one clear face photo to start the search.</p>
        </article>
        <article className="simple-info-card">
          <span>2</span>
          <h2>AI scans gallery</h2>
          <p>PhotoFly checks the full event album for matching faces.</p>
        </article>
        <article className="simple-info-card">
          <span>3</span>
          <h2>Get personal gallery</h2>
          <p>Matched photos appear together for quick viewing and sharing.</p>
        </article>
      </section>
    </main>
  );
}
