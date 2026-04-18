function LoginModal({ isOpen = true, onClose = () => {}, onLogin = () => {}, onForgotPassword = () => {} }) {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState({});

  if (!isOpen) {
    return null;
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateForm() {
    const nextErrors = {};

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      onLogin(formData);
    }
  }

  return (
    <div className="auth-modal-backdrop" role="presentation">
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close login modal">
          x
        </button>

        <div className="auth-modal-header">
          <span className="auth-kicker">Welcome back</span>
          <h2 id="login-title">Login to PhotoFly</h2>
          <p>Access your studio dashboard and AI photo galleries.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
              placeholder="Enter your password"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <div className="auth-form-row">
            <label className="checkbox-field">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <button className="text-link-button" type="button" onClick={onForgotPassword}>
              Forgot password?
            </button>
          </div>

          <button className="auth-submit-button" type="submit">
            Login
          </button>
        </form>
      </section>
    </div>
  );
}
