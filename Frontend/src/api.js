const PhotoFlyApi = (() => {
  const baseUrl = window.PHOTOFLY_API_URL || "http://localhost:5000";

  async function request(path, options = {}) {
    const headers = {
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    };

    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Backend request failed");
    }
    return data;
  }

  return {
    baseUrl,
    register(payload) {
      return request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    login(payload) {
      return request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    me(token) {
      return request("/api/auth/me", { token });
    },
    getEvents(token) {
      return request("/api/events", { token });
    },
    createEvent(token, payload) {
      return request("/api/events", {
        method: "POST",
        token,
        body: JSON.stringify(payload),
      });
    },
    updateEvent(token, id, payload) {
      return request(`/api/events/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify(payload),
      });
    },
    getPhotos(token, eventId) {
      return request(`/api/photos?eventId=${encodeURIComponent(eventId)}`, { token });
    },
    uploadPhotos(token, eventId, files) {
      const formData = new FormData();
      formData.append("eventId", eventId);
      Array.from(files).forEach((file) => formData.append("photos", file));

      return request("/api/photos/upload", {
        method: "POST",
        token,
        body: formData,
      });
    },
    deletePhoto(token, photoId) {
      return request(`/api/photos/${photoId}`, {
        method: "DELETE",
        token,
      });
    },
  };
})();

window.PhotoFlyApi = PhotoFlyApi;
