function StudioDashboard({ user, onChangePage }) {
  const defaultCover =
    "https://images.pexels.com/photos/3812639/pexels-photo-3812639.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop";
  const eventsStorageKey = `photoFly_events_${user?.email || "guest"}`;
  const initialEvents = [
    {
      id: "wedding-gala-2026",
      name: "Shrestha Wedding Gala",
      date: "May 18, 2026",
      photoCount: 1840,
      status: "AI sorting",
      progress: 72,
      shareCode: "PF-SWG-72A9",
      cover:
        "https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    },
    {
      id: "brand-launch-2026",
      name: "Everest Brand Launch",
      date: "May 27, 2026",
      photoCount: 960,
      status: "Ready to share",
      progress: 100,
      shareCode: "PF-EBL-4C18",
      cover:
        "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    },
    {
      id: "portrait-weekend-2026",
      name: "Portrait Weekend",
      date: "June 3, 2026",
      photoCount: 420,
      status: "Upload pending",
      progress: 28,
      shareCode: "PF-PWE-9F30",
      cover:
        "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop",
    },
  ];
  const emptyForm = {
    id: "",
    name: "",
    date: "",
    photoCount: 0,
    status: "Upload pending",
    progress: 0,
    shareCode: "",
    cover: "",
  };

  const [events, setEvents] = React.useState(() => {
    const savedEvents = localStorage.getItem(eventsStorageKey);
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });
  const [eventForm, setEventForm] = React.useState(emptyForm);
  const [formErrors, setFormErrors] = React.useState({});
  const [editingEventId, setEditingEventId] = React.useState(null);
  const [sharingEvent, setSharingEvent] = React.useState(null);
  const [copyMessage, setCopyMessage] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem(eventsStorageKey, JSON.stringify(events));
  }, [events, eventsStorageKey]);

  const totalEvents = events.length;
  const activeEvents = events.filter((event) => event.progress < 100).length;
  const totalPhotos = events.reduce((sum, event) => sum + event.photoCount, 0);
  const storageUsed = "47.2 GB";
  const isEditingEvent = Boolean(editingEventId);
  const statCards = [
    {
      label: "Total Events",
      value: totalEvents,
      note: "+2 this month",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <path d="M3 9h18" />
          <path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
          <path d="M8 13h.01" />
          <path d="M12 13h.01" />
          <path d="M16 13h.01" />
          <path d="M8 17h.01" />
          <path d="M12 17h.01" />
        </svg>
      ),
      tone: "amber",
    },
    {
      label: "Active Events",
      value: activeEvents,
      note: "Live & sharing",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h3l2.4-5 3.2 10L16 12h3" />
          <path d="M19 5v14" />
        </svg>
      ),
      tone: "green",
    },
    {
      label: "Total Photos Uploaded",
      value: totalPhotos.toLocaleString(),
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
          <path d="m4 16 4.4-4.4a2 2 0 0 1 2.8 0L16 16" />
          <path d="m14 14 1.4-1.4a2 2 0 0 1 2.8 0L21 15.4" />
          <path d="M8 9h.01" />
        </svg>
      ),
      tone: "blue",
    },
    {
      label: "Storage Used",
      value: storageUsed,
      progress: 47,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z" />
          <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
          <path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      ),
      tone: "orange",
    },
  ];

  function generateShareCode(name) {
    const initials = (name || "Event")
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
    return `PF-${initials}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function getShareLink(event) {
    return `${window.location.origin}${window.location.pathname}?gallery=${event.shareCode}`;
  }

  function getQrUrl(event) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(getShareLink(event))}`;
  }

  function openNewEventForm() {
    setEventForm({
      ...emptyForm,
      id: `event-${Date.now()}`,
      shareCode: "",
    });
    setEditingEventId(null);
    setFormErrors({});
  }

  function openEditEventForm(event) {
    setEventForm(event);
    setEditingEventId(event.id);
    setFormErrors({});
  }

  function closeEventForm() {
    setEventForm(emptyForm);
    setEditingEventId(null);
    setFormErrors({});
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setEventForm((currentForm) => ({
      ...currentForm,
      [name]: name === "photoCount" || name === "progress" ? Number(value) : value,
    }));
  }

  function validateEventForm() {
    const nextErrors = {};

    if (!eventForm.name.trim()) {
      nextErrors.name = "Event name is required.";
    }

    if (!eventForm.date.trim()) {
      nextErrors.date = "Event date is required.";
    }

    if (eventForm.photoCount < 0) {
      nextErrors.photoCount = "Photo count cannot be negative.";
    }

    if (eventForm.progress < 0 || eventForm.progress > 100) {
      nextErrors.progress = "Progress must be between 0 and 100.";
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function saveEvent(event) {
    event.preventDefault();

    if (!validateEventForm()) {
      return;
    }

    const eventToSave = {
      ...eventForm,
      name: eventForm.name.trim(),
      date: eventForm.date.trim(),
      cover: eventForm.cover.trim() || defaultCover,
      shareCode: eventForm.shareCode || generateShareCode(eventForm.name),
      photoCount: Number(eventForm.photoCount) || 0,
      progress: Math.min(100, Math.max(0, Number(eventForm.progress) || 0)),
    };

    setEvents((currentEvents) =>
      isEditingEvent
        ? currentEvents.map((currentEvent) =>
            currentEvent.id === editingEventId ? eventToSave : currentEvent
          )
        : [eventToSave, ...currentEvents]
    );
    closeEventForm();
  }

  function openShareEvent(event) {
    setSharingEvent(event);
    setCopyMessage("");
  }

  function copyShareText(event) {
    const shareText = `Gallery code: ${event.shareCode}\nGallery link: ${getShareLink(event)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => setCopyMessage("Copied share details."));
    } else {
      setCopyMessage("Copy this code and link from the box.");
    }
  }

  return (
    <main className="studio-dashboard">
      <section className="dashboard-header">
        <div>
          <span className="section-badge">Studio Control</span>
          <h1>Studio Home</h1>
          <p>
            Welcome back, {user?.fullName || "Studio Admin"}. Manage events,
            AI processing, and gallery delivery from one place.
          </p>
        </div>

        <button className="dashboard-primary-button" type="button" onClick={openNewEventForm}>
          <span aria-hidden="true">+</span>
          New Event + Upload
        </button>
      </section>

      <section className="dashboard-stats" aria-label="Studio overview">
        {statCards.map((stat) => (
          <article key={stat.label}>
            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.note && <small className={stat.noteTone || ""}>{stat.note}</small>}
              {stat.progress && (
                <div className="storage-progress" aria-hidden="true">
                  <span style={{ width: `${stat.progress}%` }}></span>
                </div>
              )}
            </div>
            <span className={`dashboard-stat-icon ${stat.tone}`}>{stat.icon}</span>
          </article>
        ))}
      </section>

      <section className="dashboard-event-list" aria-label="Event list">
        {events.map((event) => (
          <article className="dashboard-event-card" key={event.id}>
            <img src={event.cover} alt="" />

            <div className="dashboard-event-content">
              <div className="dashboard-event-title-row">
                <div>
                  <h2>{event.name}</h2>
                  <p>
                    {event.date} | {event.photoCount.toLocaleString()} photos
                  </p>
                </div>
                <span className="event-status-pill">{event.status}</span>
              </div>

              <div className="event-progress-row">
                <span>Processing</span>
                <strong>{event.progress}%</strong>
              </div>
              <div className="event-progress-track" aria-hidden="true">
                <span style={{ width: `${event.progress}%` }}></span>
              </div>

              <div className="dashboard-event-actions">
                <button type="button" onClick={() => onChangePage("finder")}>
                  View Event Page
                </button>
                <button type="button" onClick={() => openShareEvent(event)}>
                  Share Gallery
                </button>
                <button type="button" onClick={() => openEditEventForm(event)}>
                  Edit Event
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-insight">
        <div className="insight-icon" aria-hidden="true">
          AI
        </div>
        <div>
          <strong>AI Studio Insights: +42% client satisfaction after using PhotoFly</strong>
          <p>Facial recognition reduces manual sorting by 30+ hours per event.</p>
        </div>
      </section>

      {(eventForm.id || editingEventId) && (
        <div className="auth-modal-backdrop" role="presentation">
          <section className="auth-modal dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="event-form-title">
            <button className="modal-close-button" type="button" onClick={closeEventForm} aria-label="Close event form">
              x
            </button>

            <div className="auth-modal-header">
              <span className="auth-kicker">{isEditingEvent ? "Edit event" : "New event"}</span>
              <h2 id="event-form-title">{isEditingEvent ? "Update Event" : "Create Event"}</h2>
              <p>Save the event details your clients will see in the gallery.</p>
            </div>

            <form className="auth-form" onSubmit={saveEvent} noValidate>
              <label className="form-field">
                <span>Event name</span>
                <input
                  type="text"
                  name="name"
                  value={eventForm.name}
                  onChange={handleFormChange}
                  placeholder="Client wedding or brand shoot"
                />
                {formErrors.name && <small className="field-error">{formErrors.name}</small>}
              </label>

              <label className="form-field">
                <span>Event date</span>
                <input
                  type="text"
                  name="date"
                  value={eventForm.date}
                  onChange={handleFormChange}
                  placeholder="June 14, 2026"
                />
                {formErrors.date && <small className="field-error">{formErrors.date}</small>}
              </label>

              <div className="dashboard-form-grid">
                <label className="form-field">
                  <span>Photos</span>
                  <input
                    type="number"
                    name="photoCount"
                    min="0"
                    value={eventForm.photoCount}
                    onChange={handleFormChange}
                  />
                  {formErrors.photoCount && <small className="field-error">{formErrors.photoCount}</small>}
                </label>

                <label className="form-field">
                  <span>Progress</span>
                  <input
                    type="number"
                    name="progress"
                    min="0"
                    max="100"
                    value={eventForm.progress}
                    onChange={handleFormChange}
                  />
                  {formErrors.progress && <small className="field-error">{formErrors.progress}</small>}
                </label>
              </div>

              <label className="form-field">
                <span>Status</span>
                <select name="status" value={eventForm.status} onChange={handleFormChange}>
                  <option>Upload pending</option>
                  <option>AI sorting</option>
                  <option>Ready to share</option>
                </select>
              </label>

              <label className="form-field">
                <span>Cover image URL</span>
                <input
                  type="url"
                  name="cover"
                  value={eventForm.cover}
                  onChange={handleFormChange}
                  placeholder="https://..."
                />
              </label>

              <div className="modal-action-row">
                <button className="cancel-button" type="button" onClick={closeEventForm}>
                  Cancel
                </button>
                <button className="auth-submit-button" type="submit">
                  {isEditingEvent ? "Save Event" : "Add Event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {sharingEvent && (
        <div className="auth-modal-backdrop" role="presentation">
          <section className="auth-modal share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
            <button
              className="modal-close-button"
              type="button"
              onClick={() => setSharingEvent(null)}
              aria-label="Close share dialog"
            >
              x
            </button>

            <div className="auth-modal-header">
              <span className="auth-kicker">Share gallery</span>
              <h2 id="share-title">{sharingEvent.name}</h2>
              <p>Send clients the gallery code or let them scan the QR.</p>
            </div>

            <div className="share-panel">
              <img src={getQrUrl(sharingEvent)} alt={`QR code for ${sharingEvent.name}`} />

              <div className="share-details">
                <label className="form-field">
                  <span>Gallery code</span>
                  <input type="text" value={sharingEvent.shareCode} readOnly />
                </label>

                <label className="form-field">
                  <span>Gallery link</span>
                  <input type="text" value={getShareLink(sharingEvent)} readOnly />
                </label>

                <button className="auth-submit-button" type="button" onClick={() => copyShareText(sharingEvent)}>
                  Copy Share Details
                </button>
                {copyMessage && <small className="share-copy-message">{copyMessage}</small>}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
