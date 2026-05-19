function Navbar({
  currentPage,
  studioName,
  user,
  isLoggedIn,
  notifications,
  onChangePage,
  onOpenLogin,
  onOpenSignup,
  onLogout,
  onMarkAllNotificationsRead,
}) {
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pages = [
    { id: "home", label: "Home" },
    { id: "finder", label: "AI Finder" },
    { id: "packages", label: "Packages" },
    { id: "contact", label: "Contact" },
  ];

  function getInitials(name) {
    return (name || "User")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatDisplayName(name) {
    return (name || "Profile")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  function goToPage(pageId) {
    onChangePage(pageId);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  function openLogin() {
    setIsMenuOpen(false);
    onOpenLogin();
  }

  function openSignup() {
    setIsMenuOpen(false);
    onOpenSignup();
  }

  return (
    <header className={`navbar ${isMenuOpen ? "menu-open" : ""}`}>
      <div className="navbar-brand">
        <div className="brand-lockup">
          <img
            src="src/assets/photofly-logo.png"
            alt="PhotoFly logo"
            className="logo-image"
          />
          <span className="studio-sub-label">by Innoverse Studio</span>
        </div>

        <button
          className="navbar-menu-button"
          type="button"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsProfileOpen(false);
          }}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation-panel"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className="navbar-panel" id="main-navigation-panel">
        <nav className="nav-links" aria-label="Main navigation">
          {pages.map((page) => (
            <button
              key={page.id}
              className={currentPage === page.id ? "nav-link active" : "nav-link"}
              onClick={() => goToPage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>

        <div className="navbar-actions">
          {!isLoggedIn && (
            <>
              <button
                className="login-nav-button"
                type="button"
                onClick={openLogin}
                aria-label="Open login modal"
              >
                Login
              </button>
              <button
                className="signup-nav-button"
                type="button"
                onClick={openSignup}
                aria-label="Open signup modal"
              >
                Signup
              </button>
            </>
          )}

          {isLoggedIn && (
            <>
              <NotificationButton
                notifications={notifications}
                onMarkAllRead={onMarkAllNotificationsRead}
              />

              <div className="profile-area">
                <button
                  className="profile-button"
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Open profile menu"
                >
                  <span className="avatar">{getInitials(user.fullName)}</span>
                  <span className="profile-chip-name">{formatDisplayName(user.fullName)}</span>
                  <span className="dropdown-arrow">v</span>
                </button>

                {isProfileOpen && (
                  <div className="profile-menu">
                    <p className="profile-name">{user.fullName || studioName}</p>
                    <p className="profile-email">{user.email}</p>
                    <button
                      className="profile-menu-button secondary"
                      type="button"
                      onClick={() => goToPage("profile")}
                    >
                      Settings
                    </button>
                    <div className="profile-menu-divider" role="separator"></div>
                    <button
                      className="profile-menu-button danger"
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsMenuOpen(false);
                        onLogout();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
