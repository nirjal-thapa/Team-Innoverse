function App() {
  const userStorageKey = "photoFly_savedUser";
  const sessionStorageKey = "photoFly_isLoggedIn";
  const notificationsStorageKey = "photoFly_notifications";
  const studioName = "Innoverse Studio";
  const [currentPage, setCurrentPage] = React.useState("home");
  const [activeAuthModal, setActiveAuthModal] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);

  // Load saved user and notifications when the app starts.
  React.useEffect(() => {
    const savedUser = localStorage.getItem(userStorageKey);
    const savedSession = localStorage.getItem(sessionStorageKey);
    const savedNotifications = localStorage.getItem(notificationsStorageKey);

    if (savedUser && savedSession === "true") {
      setCurrentUser(JSON.parse(savedUser));
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const isLoggedIn = Boolean(currentUser);

  function saveUser(userData) {
    setCurrentUser(userData);
    localStorage.setItem(userStorageKey, JSON.stringify(userData));
    localStorage.setItem(sessionStorageKey, "true");
  }

  function createActivity(text) {
    return {
      id: `${Date.now()}-${Math.random()}`,
      text,
      date: new Date().toLocaleString(),
    };
  }

  function createNotification(message) {
    return {
      id: `${Date.now()}-${Math.random()}`,
      message,
      date: new Date().toLocaleString(),
      isRead: false,
    };
  }

  function saveNotifications(nextNotifications) {
    setNotifications(nextNotifications);
    localStorage.setItem(notificationsStorageKey, JSON.stringify(nextNotifications));
  }

  function addNotifications(messages) {
    // New notifications are added to the top and start as unread.
    const newNotifications = messages.map((message) => createNotification(message));
    const nextNotifications = [...newNotifications, ...notifications];
    saveNotifications(nextNotifications);
  }

  function markAllNotificationsRead() {
    const nextNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));

    saveNotifications(nextNotifications);
  }

  function handleSignupSuccess(signupData) {
    const newUser = {
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      profileImage: "",
      location: "Kathmandu, Nepal",
      currentPlan: "Studio Pro",
      memberSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      securityStatus: "Password enabled",
      recentActivity: [createActivity("Account created successfully")],
    };

    saveUser(newUser);
    addNotifications(["Account created successfully"]);
    setActiveAuthModal(null);
    setCurrentPage("dashboard");
  }

  function handleLoginSuccess(loginData) {
    const savedUser = JSON.parse(localStorage.getItem(userStorageKey));

    if (!savedUser) {
      alert("No saved account found. Please sign up first.");
      return;
    }

    if (savedUser.email !== loginData.email || savedUser.password !== loginData.password) {
      alert("Email or password is incorrect.");
      return;
    }

    saveUser(savedUser);
    addNotifications(["You logged in successfully"]);
    setActiveAuthModal(null);
    setCurrentPage("dashboard");
  }

  function handleProfileUpdate(updatedUser) {
    const imageChanged = updatedUser.profileImage !== currentUser.profileImage;
    const newActivity = imageChanged
      ? [createActivity("Profile photo changed"), createActivity("Profile updated")]
      : [createActivity("Profile updated")];

    saveUser({
      ...updatedUser,
      recentActivity: [...newActivity, ...(currentUser.recentActivity || [])],
    });

    addNotifications(imageChanged ? ["Profile photo changed", "Profile updated"] : ["Profile updated"]);
  }

  function handleLogout() {
    // Logout only clears the active session. The saved account remains for dummy login.
    setCurrentUser(null);
    localStorage.setItem(sessionStorageKey, "false");
    setActiveAuthModal(null);
    setCurrentPage("home");
  }

  function showCurrentPage() {
    if (currentPage === "packages") {
      return <PackagesPage />;
    }

    if (currentPage === "profile") {
      return isLoggedIn ? (
        <ProfilePage user={currentUser} onUpdateUser={handleProfileUpdate} />
      ) : (
        <HomePage onChangePage={setCurrentPage} />
      );
    }

    if (currentPage === "dashboard") {
      return isLoggedIn ? (
        <StudioDashboard user={currentUser} onChangePage={setCurrentPage} />
      ) : (
        <HomePage onChangePage={setCurrentPage} />
      );
    }

    if (currentPage === "home") {
      return <HomePage onChangePage={setCurrentPage} />;
    }

    if (currentPage === "finder") {
      return <AIPhotoFinderPage />;
    }

    if (currentPage === "contact") {
      return <ContactPage />;
    }

    if (currentPage === "about") {
      return <AboutPage />;
    }

    return <HomePage onChangePage={setCurrentPage} />;
  }

  return (
    <>
      <Navbar
        currentPage={currentPage}
        studioName={studioName}
        user={currentUser}
        isLoggedIn={isLoggedIn}
        notifications={notifications}
        onChangePage={setCurrentPage}
        onOpenLogin={() => setActiveAuthModal("login")}
        onOpenSignup={() => setActiveAuthModal("signup")}
        onLogout={handleLogout}
        onMarkAllNotificationsRead={markAllNotificationsRead}
      />

      {showCurrentPage()}

      <Footer onChangePage={setCurrentPage} />

      <LoginModal
        isOpen={activeAuthModal === "login"}
        onClose={() => setActiveAuthModal(null)}
        onLogin={handleLoginSuccess}
        onForgotPassword={() => alert("Password reset flow coming soon.")}
      />

      <SignupModal
        isOpen={activeAuthModal === "signup"}
        onClose={() => setActiveAuthModal(null)}
        onSignup={handleSignupSuccess}
      />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
