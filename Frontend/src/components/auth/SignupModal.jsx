function SignupModal({ isOpen = true, onClose = () => {}, onSignup = () => {} }) {
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState({});

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

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      onSignup(formData);
    }
  }

  function handleGoogleSignup() {
    // Connect Google signup/OAuth here later when backend/auth setup is ready.
    console.log("Google signup clicked");
    alert("Google signup clicked");
  }

  function handleFacebookSignup() {
    // Connect Facebook signup/OAuth here later when backend/auth setup is ready.
    console.log("Facebook signup clicked");
    alert("Facebook signup clicked");
  }

  return (
    <div className="auth-modal-backdrop" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close signup modal">
          x
        </button>

        <div className="auth-modal-header">
          <span className="auth-kicker">Create account</span>
          <h2 id="signup-title">Start using PhotoFly</h2>
          <p>Set up your studio profile and deliver smarter galleries.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field">
            <span>Full name</span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Innoverse Studio"
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
              placeholder="studio@photofly.com"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <label className="form-field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
          </label>

          <button className="auth-submit-button" type="submit">
            Signup
          </button>

          <div className="auth-divider">
            <span></span>
            <p>or continue with</p>
            <span></span>
          </div>
        </form>
      </section>
    </div>
  );
}
