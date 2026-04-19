function EditProfileModal({ isOpen, user, onClose, onSave }) {
  const [formData, setFormData] = React.useState(user);
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    setFormData(user);
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((currentData) => ({
        ...currentData,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  }

  return (
    <div className="auth-modal-backdrop" role="presentation">
      <section className="auth-modal edit-profile-modal" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close edit profile modal">
          x
        </button>

        <div className="auth-modal-header">
          <span className="auth-kicker">Profile settings</span>
          <h2 id="edit-profile-title">Edit Profile</h2>
          <p>Update your studio details and profile picture.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="image-upload-row">
            <div className="profile-avatar edit-avatar-preview">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile preview" className="profile-avatar-image" />
              ) : (
                (formData.fullName || "User")
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              )}
            </div>
            <label className="upload-button">
              Upload photo
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>

          <label className="form-field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
            />
            {errors.fullName && <small className="field-error">{errors.fullName}</small>}
          </label>

          <label className="form-field">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label className="form-field">
            <span>Location</span>
            <input
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Kathmandu, Nepal"
            />
          </label>

          <div className="modal-action-row">
            <button className="cancel-button" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="auth-submit-button" type="submit">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
