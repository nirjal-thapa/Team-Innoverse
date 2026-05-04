function Footer({ onChangePage }) {
  const [activePolicy, setActivePolicy] = React.useState(null);
  const quickLinks = [
    { id: "home", label: "Home" },
    { id: "finder", label: "AI Finder" },
    { id: "packages", label: "Packages" },
    { id: "contact", label: "Contact" },
    { id: "about", label: "About Us" },
  ];

  const policyContent = {
    privacy: {
      label: "Privacy Policy",
      title: "Privacy Policy",
      intro:
        "PhotoFly respects your studio data, client galleries, and uploaded photos. This policy explains how our demo experience treats information.",
      points: [
        "We use account and contact details only to support your PhotoFly experience.",
        "Uploaded photos are used for gallery workflows and AI photo matching features.",
        "We do not sell studio, client, or gallery information to third parties.",
        "You can contact support@photofly.com for help with access, updates, or removal requests.",
      ],
    },
    terms: {
      label: "Terms & Conditions",
      title: "Terms & Conditions",
      intro:
        "By using PhotoFly, studios agree to use the platform responsibly for event photo management and client delivery.",
      points: [
        "Upload only photos you have permission to manage or share.",
        "Use AI photo finder features for legitimate event and studio workflows.",
        "Keep account access secure and notify us if something looks wrong.",
        "PhotoFly demo features may evolve as Team Innoverse improves the product.",
      ],
    },
  };

  function handleFooterLink(pageId) {
    onChangePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSupportLink(link) {
    if (link === "Help Center") {
      handleFooterLink("contact");
      return;
    }

    setActivePolicy(link === "Privacy Policy" ? "privacy" : "terms");
  }

  function closePolicyModal() {
    setActivePolicy(null);
  }

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img
            src="src/assets/photofly-logo.png"
            alt="PhotoFly logo"
            className="footer-logo"
          />
          <p className="footer-tagline">Capture. Explore. Share.</p>
          <p className="footer-description">AI-powered photo discovery by Team Innoverse.</p>
        </div>

        <nav className="footer-column" aria-label="Footer quick links">
          <h2>Quick Links</h2>
          {quickLinks.map((link) => (
            <button key={link.id} type="button" onClick={() => handleFooterLink(link.id)}>
              {link.label}
            </button>
          ))}
        </nav>

        <nav className="footer-column" aria-label="Footer support links">
          <h2>Support</h2>
          {["Help Center", policyContent.privacy.label, policyContent.terms.label].map((link) => (
            <button key={link} type="button" onClick={() => handleSupportLink(link)}>
              {link}
            </button>
          ))}
        </nav>

        <div className="footer-column footer-contact">
          <h2>Contact</h2>
          <p>
            <span>Email</span>
            support@photofly.com
          </p>
          <p>
            <span>Location</span>
            Kathmandu, Nepal
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 PhotoFly. All rights reserved.</p>
        <p>by Innoverse Studio - Nepal</p>
      </div>
    </footer>
  );
}
