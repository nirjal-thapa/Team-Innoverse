function Navbar({ currentPage, studioName, onChangePage, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const pages = [
    { id: "home", label: "Home" },
    { id: "finder", label: "AI Photo Finder" },
    { id: "packages", label: "Packages" },
    { id: "contact", label: "Contact Us" },
    { id: "about", label: "About Us" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <img
          src="src/assets/photofly-logo.png"
          alt="PhotoFly logo"
          className="logo-image"
        />
        <span className="studio-badge">by Innoverse Studio</span>
      </div>

      <nav className="nav-links" aria-label="Main navigation">
        {pages.map((page) => (
          <button
            key={page.id}
            className={currentPage === page.id ? "nav-link active" : "nav-link"}
            onClick={() => onChangePage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </nav>

      <div className="navbar-actions">
        <button className="icon-button" aria-label="Notifications">
          <span className="notification-dot"></span>
          !
        </button>

        <div className="profile-area">
          <button
            className="profile-button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <span className="avatar">S</span>
            <span>Profile</span>
            <span className="dropdown-arrow">v</span>
          </button>

          {isProfileOpen && (
            <div className="profile-menu">
              <p className="profile-name">{studioName}</p>
              <p className="profile-email">studio@photofly.com</p>
            </div>
          )}
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
