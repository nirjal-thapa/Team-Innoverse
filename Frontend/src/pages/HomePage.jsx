function HomePage({ onChangePage }) {
  const workflowSteps = [
    {
      number: "1",
      title: "Studio Uploads",
      text: "Wedding and event photos are uploaded from local storage or cloud drives.",
      image:
        "https://images.pexels.com/photos/6941300/pexels-photo-6941300.jpeg?auto=compress&cs=tinysrgb&w=500&h=320&fit=crop",
    },
    {
      number: "2",
      title: "AI Recognizes Faces",
      text: "Face matching scans every image and prepares personal photo results.",
      image:
        "https://images.pexels.com/photos/573299/pexels-photo-573299.jpeg?auto=compress&cs=tinysrgb&w=500&h=320&fit=crop",
    },
    {
      number: "3",
      title: "Client Gets Gallery",
      text: "Guests upload a selfie and instantly receive their own photo gallery.",
      image:
        "https://images.pexels.com/photos/3812639/pexels-photo-3812639.jpeg?auto=compress&cs=tinysrgb&w=500&h=320&fit=crop",
    },
  ];

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-container hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">Built by Team Innoverse - Nepal</span>
            <h1>
              AI finds <span>your photo</span> from thousands of files. Instant
              delivery.
            </h1>
            <p>
              PhotoFly uses facial recognition to scan entire event galleries
              and pick out every single photo of each guest. No more scrolling
              through 5000 images, just your face and your memories.
            </p>

            <div className="hero-actions">
              <button
                className="primary-hero-button"
                onClick={() => onChangePage("finder")}
              >
                Try AI Demo
              </button>
              <button
                className="secondary-hero-button"
                onClick={() =>
                  window.open("https://youtu.be/OA-p2Xw14Bw", "_blank")
                }
              >
                Watch Video
              </button>
            </div>

            <div className="hero-stats" aria-label="PhotoFly highlights">
              <span>
                <strong>98.7%</strong> face match
              </span>
              <span>
                <strong>5K photos</strong> in 12 min
              </span>
              <span>
                <strong>500+ guests</strong> personal galleries
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=900&h=680&fit=crop"
              alt="Wedding photo gallery"
            />
            <div className="ai-floating-card">
              <span className="ai-icon">AI</span>
              <div>
                <strong>AI finds YOU</strong>
                <small>from 4000+ photos</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison-section" id="solution">
        <div className="home-container">
          <div className="section-heading">
            <span className="section-badge">The old way vs PhotoFly AI</span>
            <h2>
              From endless scrolling <span>to one-click find</span>
            </h2>
            <p>
              Manually searching through thousands of wedding photos is painful.
              PhotoFly turns that workflow into a personal gallery experience.
            </p>
          </div>

          <div className="comparison-grid">
            <article className="comparison-panel traditional-panel">
              <span className="panel-icon negative">X</span>
              <h3>Traditional Workflow</h3>
              <ul>
                <li>Hours of manual sorting per event</li>
                <li>Clients repeatedly ask where their photos are</li>
                <li>Generic drives with no personalization</li>
                <li>Studios lose upsell and delivery opportunities</li>
              </ul>
            </article>

            <article className="comparison-panel ai-panel">
              <span className="panel-icon positive">OK</span>
              <h3>PhotoFly AI Magic</h3>
              <ul>
                <li>AI picks each face from every single photo</li>
                <li>Client uploads selfie and gets an instant gallery</li>
                <li>5000 photos processed in under 15 minutes</li>
                <li>Higher studio efficiency and happier clients</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="home-container">
          <div className="section-heading">
            <span className="section-badge">Three steps to happy clients</span>
            <h2>From upload to personalized gallery</h2>
          </div>

          <div className="steps-grid">
            {workflowSteps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <img src={step.image} alt={step.title} />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
