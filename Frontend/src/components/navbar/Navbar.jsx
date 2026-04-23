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
  const pages = [
    { id: "home", label: "Home" },
    { id: "finder", label: "AI Photo Finder" },
    { id: "packages", label: "Packages" },
    { id: "contact", label: "Contact Us" },
    { id: "about", label: "About Us" },
  ];

  function getInitials(name) {
    return (name || "User")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

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
        {!isLoggedIn && (
          <>
            <button
              className="login-nav-button"
              type="button"
              onClick={onOpenLogin}
              aria-label="Open login modal"
            >
              Login
            </button>
            <button
              className="signup-nav-button"
              type="button"
              onClick={onOpenSignup}
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
                <span className="avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="avatar-image" />
                  ) : (
                    getInitials(user.fullName)
                  )}
                </span>
                <span>Profile</span>
                <span className="dropdown-arrow">v</span>
              </button>

              {isProfileOpen && (
                <div className="profile-menu">
                  <p className="profile-name">{user.fullName || studioName}</p>
                  <p className="profile-email">{user.email}</p>
                  <button
                    className="profile-menu-button"
                    type="button"
                    onClick={() => {
                      onChangePage("profile");
                      setIsProfileOpen(false);
                    }}
                  >
                    View profile
                  </button>
                </div>
              )}
            </div>

            <button
              className="logout-button"
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                onLogout();
              }}
              aria-label="Log out of PhotoFly"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
