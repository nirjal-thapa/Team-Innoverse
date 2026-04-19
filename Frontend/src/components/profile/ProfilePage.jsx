function ProfilePage({ user, onUpdateUser }) {
  const [isEditing, setIsEditing] = React.useState(false);

  function getInitials(name) {
    return (name || "User")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar" aria-label={`${user.fullName} avatar`}>
          {user.profileImage ? (
            <img src={user.profileImage} alt={`${user.fullName} profile`} className="profile-avatar-image" />
          ) : (
            getInitials(user.fullName)
          )}
        </div>

        <div className="profile-heading">
          <span className="profile-label">Studio Account</span>
          <h1>{user.fullName}</h1>
          <p>{user.email}</p>
        </div>

        <button className="edit-profile-button" type="button" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
      </section>

      <section className="profile-grid">
        <article className="profile-section">
          <h2>Personal Information</h2>
          <dl className="details-list">
            <div>
              <dt>Full name</dt>
              <dd>{user.fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{user.location || "Not added"}</dd>
            </div>
          </dl>
        </article>

        <article className="profile-section">
          <h2>Account Settings</h2>
          <dl className="details-list">
            <div>
              <dt>Current plan</dt>
              <dd>{user.currentPlan}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{user.memberSince}</dd>
            </div>
            <div>
              <dt>Security</dt>
              <dd>{user.securityStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="profile-section profile-section-wide">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {(user.recentActivity || []).map((activity) => (
              <li key={activity.id}>
                <span className="activity-dot" aria-hidden="true"></span>
                <span>
                  <strong>{activity.text}</strong>
                  <small>{activity.date}</small>
                </span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <EditProfileModal
        isOpen={isEditing}
        user={user}
        onClose={() => setIsEditing(false)}
        onSave={(updatedUser) => {
          onUpdateUser(updatedUser);
          setIsEditing(false);
        }}
      />
    </main>
  );
}
