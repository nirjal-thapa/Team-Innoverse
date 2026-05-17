function App() {
  const userStorageKey = "photoFly_savedUser";
  const sessionStorageKey = "photoFly_isLoggedIn";
  const tokenStorageKey = "photoFly_authToken";
  const notificationsStorageKey = "photoFly_notifications";
  const studioName = "Innoverse Studio";
  const [currentPage, setCurrentPage] = React.useState("home");
  const [activeAuthModal, setActiveAuthModal] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [authToken, setAuthToken] = React.useState("");
  const [notifications, setNotifications] = React.useState([]);

  // Load saved user and notifications when the app starts.
  React.useEffect(() => {
    const savedUser = localStorage.getItem(userStorageKey);
    const savedSession = localStorage.getItem(sessionStorageKey);
    const savedToken = localStorage.getItem(tokenStorageKey);
    const savedNotifications = localStorage.getItem(notificationsStorageKey);

    if (savedUser && savedSession === "true") {
      setCurrentUser(JSON.parse(savedUser));
    }

    if (savedToken && savedSession === "true") {
      setAuthToken(savedToken);
      window.PhotoFlyApi.me(savedToken)
        .then((apiUser) => saveUser(formatApiUser(apiUser), savedToken))
        .catch(() => {
          localStorage.setItem(sessionStorageKey, "false");
          localStorage.removeItem(tokenStorageKey);
          setCurrentUser(null);
          setAuthToken("");
        });
    }

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  const isLoggedIn = Boolean(currentUser);

  function formatApiUser(apiUser) {
    const memberDate = apiUser.createdAt ? new Date(apiUser.createdAt) : new Date();
    return {
      fullName: apiUser.name || apiUser.fullName || "Studio Admin",
      email: apiUser.email,
      profileImage: apiUser.avatar || apiUser.profileImage || "",
      location: apiUser.location || "Kathmandu, Nepal",
      currentPlan:
        apiUser.plan === "studio"
          ? "Studio Pro"
          : apiUser.plan_tier === "pro"
          ? "Pro"
          : apiUser.plan_tier === "enterprise"
          ? "Enterprise"
          : apiUser.plan || "Studio Pro",
      memberSince: memberDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      securityStatus: "Password enabled",
      role: apiUser.role || "photographer",
      recentActivity: apiUser.recentActivity || [createActivity("Connected to backend")],
    };
  }

  function saveUser(userData, token = authToken) {
    setCurrentUser(userData);
    localStorage.setItem(userStorageKey, JSON.stringify(userData));
    localStorage.setItem(sessionStorageKey, "true");
    if (token) {
      setAuthToken(token);
      localStorage.setItem(tokenStorageKey, token);
    } else if (token === "") {
      setAuthToken("");
      localStorage.removeItem(tokenStorageKey);
    }
  }

  function createLocalStudioUser(email = "studio@photofly.com") {
    return {
      fullName: "Innoverse Studio",
      email,
      profileImage: "",
      location: "Kathmandu, Nepal",
      currentPlan: "Local Studio",
      memberSince: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      securityStatus: "Local data mode",
      role: "photographer",
      recentActivity: [createActivity("Using local studio data")],
    };
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

  async function handleSignupSuccess(signupData) {
    try {
      const result = await window.PhotoFlyApi.register({
        name: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        role: "photographer",
      });
      const newUser = {
        ...formatApiUser(result.user),
        recentActivity: [createActivity("Account created successfully")],
      };

      saveUser(newUser, result.token);
      addNotifications(["Account created successfully"]);
      setActiveAuthModal(null);
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(`Signup failed: ${error.message}`);
    }
  }

  async function handleLoginSuccess(loginData) {
    try {
      const result = await window.PhotoFlyApi.login({
        email: loginData.email,
        password: loginData.password,
      });
      const loggedInUser = {
        ...formatApiUser(result.user),
        recentActivity: [createActivity("Logged in with backend"), createActivity("Connected to backend")],
      };

      saveUser(loggedInUser, result.token);
      addNotifications(["You logged in successfully"]);
      setActiveAuthModal(null);
      setCurrentPage("dashboard");
    } catch (error) {
      if (loginData.email === "studio@photofly.com" && loginData.password === "password123") {
        saveUser(createLocalStudioUser(loginData.email), "");
        addNotifications(["Backend unavailable, using local data mode"]);
        setActiveAuthModal(null);
        setCurrentPage("dashboard");
        return;
      }

      alert(error.message);
    }
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
    localStorage.removeItem(tokenStorageKey);
    setAuthToken("");
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
        <StudioDashboard user={currentUser} authToken={authToken} onChangePage={setCurrentPage} />
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
