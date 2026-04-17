function Footer({ onChangePage }) {
  const quickLinks = [
    { id: "home", label: "Home" },
    { id: "finder", label: "AI Photo Finder" },
    { id: "packages", label: "Packages" },
    { id: "contact", label: "Contact Us" },
    { id: "about", label: "About Us" },
  ];

  const supportLinks = ["Help Center", "Privacy Policy", "Terms & Conditions"];

  function handleFooterLink(pageId) {
    onChangePage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          {supportLinks.map((link) => (
            <button key={link} type="button">
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
