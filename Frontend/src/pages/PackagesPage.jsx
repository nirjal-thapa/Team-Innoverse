function PackagesPage() {
  const packages = [
    {
      name: "Freelance",
      price: "$29",
      features: ["10 events/month", "100GB storage", "AI face recognition"],
      buttonText: "Start trial",
    },
    {
      name: "Studio Pro",
      price: "$79",
      features: ["Unlimited events", "1TB storage", "Advanced AI + analytics"],
      buttonText: "Get Pro ->",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      features: ["Unlimited + API", "5TB storage", "Dedicated support"],
      buttonText: "Contact sales",
    },
  ];

  return (
    <main className="packages-page">
      <section className="packages-header">
        <span className="packages-badge">Plans for every studio</span>
        <h2>Simple pricing, no hidden fees</h2>
        <p>Start free, scale as you grow. Made for Nepali & global studios.</p>
      </section>

      <section className="pricing-grid">
        {packages.map((item) => (
          <article
            key={item.name}
            className={item.popular ? "pricing-card popular-card" : "pricing-card"}
          >
            {item.popular && <span className="popular-badge">MOST POPULAR</span>}

            <h3>{item.name}</h3>

            <p className="price">
              {item.price}
              <span>/month</span>
            </p>

            <ul className="feature-list">
              {item.features.map((feature) => (
                <li key={feature}>
                  <span className="check-mark" aria-hidden="true"></span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className={item.popular ? "package-button filled" : "package-button"}>
              {item.buttonText}
            </button>
          </article>
        ))}
      </section>

      <p className="pricing-note">
        *Pay-per-event also available: $49/event, no subscription required.
      </p>
    </main>
  );
}
