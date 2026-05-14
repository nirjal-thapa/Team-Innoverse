function StudioDashboard({ user, authToken = "", onChangePage }) {
  const defaultCover =
    "https://images.pexels.com/photos/3812639/pexels-photo-3812639.jpeg?auto=compress&cs=tinysrgb&w=900&h=620&fit=crop";
  const eventsStorageKey = `photoFly_events_${user?.email || "guest"}`;
  const photosStorageKey = `photoFly_uploadedPhotos_${user?.email || "guest"}`;
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

  function formatDisplayDate(dateValue) {
    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) {
      return dateValue || "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function eventFromApi(apiEvent) {
    return {
      id: apiEvent._id || apiEvent.id,
      name: apiEvent.name,
      date: formatDisplayDate(apiEvent.date),
      photoCount: Number(apiEvent.photoCount) || 0,
      status: apiEvent.status || (apiEvent.progress >= 100 ? "Ready to share" : "Upload pending"),
      progress: Math.min(100, Math.max(0, Number(apiEvent.progress) || 0)),
      shareCode: apiEvent.code || apiEvent.shareCode || "",
      cover: apiEvent.coverImage || apiEvent.cover || defaultCover,
    };
  }

  function eventToApiPayload(event) {
    return {
      name: event.name,
      date: event.date,
      photoCount: Number(event.photoCount) || 0,
      status: event.status,
      progress: Math.min(100, Math.max(0, Number(event.progress) || 0)),
      code: event.shareCode,
      coverImage: event.cover,
    };
  }

  function normalizePhotoUrl(url) {
    if (!url) {
      return defaultCover;
    }

    if (url.startsWith("http") || url.startsWith("data:") || url.startsWith("blob:")) {
      return url;
    }

    return `${window.PhotoFlyApi.baseUrl}${url}`;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const [events, setEvents] = React.useState(() => {
    const savedEvents = localStorage.getItem(eventsStorageKey);
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });
  const [localPhotosByEvent, setLocalPhotosByEvent] = React.useState(() => {
    const savedPhotos = localStorage.getItem(photosStorageKey);
    return savedPhotos ? JSON.parse(savedPhotos) : {};
  });
  const [eventForm, setEventForm] = React.useState(emptyForm);
  const [formErrors, setFormErrors] = React.useState({});
  const [editingEventId, setEditingEventId] = React.useState(null);
  const [sharingEvent, setSharingEvent] = React.useState(null);
  const [copyMessage, setCopyMessage] = React.useState("");
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [dataMode, setDataMode] = React.useState(authToken ? "syncing" : "local");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [uploadEvent, setUploadEvent] = React.useState(null);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const [eventPhotos, setEventPhotos] = React.useState([]);
  const [uploadMessage, setUploadMessage] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    if (!authToken) {
      return;
    }

    let isActive = true;
    setIsSyncing(true);

    window.PhotoFlyApi.getEvents(authToken)
      .then((data) => {
        if (isActive) {
          setEvents((data.events || []).map(eventFromApi));
          setDataMode("backend");
        }
      })
      .catch((error) => {
        console.error(error.message);
        if (isActive) {
          setDataMode("local");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsSyncing(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [authToken]);

  React.useEffect(() => {
    localStorage.setItem(eventsStorageKey, JSON.stringify(events));
  }, [events, eventsStorageKey]);

  React.useEffect(() => {
    localStorage.setItem(photosStorageKey, JSON.stringify(localPhotosByEvent));
  }, [localPhotosByEvent, photosStorageKey]);

  const totalEvents = events.length;
  const activeEvents = events.filter((event) => event.progress < 100).length;
  const totalPhotos = events.reduce((sum, event) => sum + event.photoCount, 0);
  const readyEvents = events.filter((event) => event.progress >= 100).length;
  const avgProgress = totalEvents
    ? Math.round(events.reduce((sum, event) => sum + event.progress, 0) / totalEvents)
    : 0;
  const storageUsed = `${Math.max(1, (totalPhotos * 0.003).toFixed(1))} GB`;
  const isEditingEvent = Boolean(editingEventId);
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
      || event.shareCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
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
      label: "Ready Galleries",
      value: readyEvents,
      note: `${avgProgress}% avg progress`,
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
          <path d="M15 6h5v5" />
        </svg>
      ),
      tone: "purple",
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

  async function saveEvent(event) {
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

    if (authToken) {
      let savedToBackend = false;

      try {
        setIsSyncing(true);
        const savedEvent = isEditingEvent
          ? await window.PhotoFlyApi.updateEvent(authToken, editingEventId, eventToApiPayload(eventToSave))
          : await window.PhotoFlyApi.createEvent(authToken, eventToApiPayload(eventToSave));
        const syncedEvent = eventFromApi(savedEvent);

        setEvents((currentEvents) =>
          isEditingEvent
            ? currentEvents.map((currentEvent) =>
                currentEvent.id === editingEventId ? syncedEvent : currentEvent
              )
            : [syncedEvent, ...currentEvents]
        );
        closeEventForm();
        savedToBackend = true;
      } catch (error) {
        console.error(error.message);
        setDataMode("local");
      } finally {
        setIsSyncing(false);
      }

      if (savedToBackend) {
        return;
      }
    }

    setEvents((currentEvents) =>
      isEditingEvent
        ? currentEvents.map((currentEvent) =>
            currentEvent.id === editingEventId ? eventToSave : currentEvent
          )
        : [eventToSave, ...currentEvents]
    );
    setDataMode("local");
    closeEventForm();
  }

  function deleteEvent(eventId) {
    const eventToDelete = events.find((event) => event.id === eventId);
    if (!eventToDelete) {
      return;
    }

    if (!window.confirm(`Delete ${eventToDelete.name}?`)) {
      return;
    }

    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
    setDataMode("local");
  }

  function resetLocalEvents() {
    if (!window.confirm("Reset dashboard to local seed events?")) {
      return;
    }

    setEvents(initialEvents);
    setSearchTerm("");
    setStatusFilter("All");
    localStorage.setItem(eventsStorageKey, JSON.stringify(initialEvents));
    setDataMode("local");
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

  function updateEventPhotoCount(eventId, change) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? { ...event, photoCount: Math.max(0, Number(event.photoCount || 0) + change) }
          : event
      )
    );
  }

  function openUploadEvent(event) {
    setUploadEvent(event);
    setSelectedFiles([]);
    setUploadMessage("");
    setEventPhotos(localPhotosByEvent[event.id] || []);

    if (!authToken) {
      return;
    }

    setIsUploading(true);
    window.PhotoFlyApi.getPhotos(authToken, event.id)
      .then((data) => {
        setEventPhotos((data.photos || []).map((photo) => ({
          id: photo._id || photo.id,
          name: photo.publicId || "Uploaded photo",
          url: normalizePhotoUrl(photo.thumbnailUrl || photo.url),
          fullUrl: normalizePhotoUrl(photo.url),
          isLocal: false,
        })));
        setDataMode("backend");
      })
      .catch((error) => {
        console.error(error.message);
        setDataMode("local");
      })
      .finally(() => setIsUploading(false));
  }

  function closeUploadEvent() {
    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setUploadEvent(null);
    setSelectedFiles([]);
    setEventPhotos([]);
    setUploadMessage("");
  }

  function handleUploadFileChange(event) {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setSelectedFiles(imageFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    })));
    setUploadMessage(imageFiles.length === files.length ? "" : "Some non-image files were ignored.");
    event.target.value = "";
  }

  function removeSelectedFile(fileName) {
    setSelectedFiles((currentFiles) => {
      const fileToRemove = currentFiles.find((item) => item.name === fileName);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return currentFiles.filter((item) => item.name !== fileName);
    });
  }

  async function saveUploadsLocally() {
    const localPhotos = await Promise.all(selectedFiles.map(async (item) => ({
      id: `local-photo-${Date.now()}-${Math.random()}`,
      name: item.name,
      url: await readFileAsDataUrl(item.file),
      fullUrl: "",
      isLocal: true,
      createdAt: new Date().toISOString(),
    })));

    const nextPhotos = [...localPhotos, ...(localPhotosByEvent[uploadEvent.id] || [])];
    setLocalPhotosByEvent((currentPhotos) => ({
      ...currentPhotos,
      [uploadEvent.id]: nextPhotos,
    }));
    setEventPhotos((currentPhotos) => [...localPhotos, ...currentPhotos]);
    updateEventPhotoCount(uploadEvent.id, localPhotos.length);
    setDataMode("local");
    setUploadMessage(`${localPhotos.length} photo${localPhotos.length === 1 ? "" : "s"} saved locally.`);
  }

  async function uploadSelectedPhotos() {
    if (!uploadEvent || !selectedFiles.length) {
      setUploadMessage("Choose at least one image to upload.");
      return;
    }

    setIsUploading(true);
    setUploadMessage("");

    if (authToken) {
      try {
        const result = await window.PhotoFlyApi.uploadPhotos(
          authToken,
          uploadEvent.id,
          selectedFiles.map((item) => item.file)
        );
        const uploadedPhotos = (result.photos || []).map((photo) => ({
          id: photo._id || photo.id,
          name: photo.publicId || "Uploaded photo",
          url: normalizePhotoUrl(photo.thumbnailUrl || photo.url),
          fullUrl: normalizePhotoUrl(photo.url),
          isLocal: false,
        }));

        setEventPhotos((currentPhotos) => [...uploadedPhotos, ...currentPhotos]);
        updateEventPhotoCount(uploadEvent.id, uploadedPhotos.length);
        setDataMode("backend");
        setUploadMessage(`${uploadedPhotos.length} photo${uploadedPhotos.length === 1 ? "" : "s"} uploaded.`);
        selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
        setSelectedFiles([]);
        setIsUploading(false);
        return;
      } catch (error) {
        console.error(error.message);
        setUploadMessage("Backend upload failed, saving photos locally.");
      }
    }

    try {
      await saveUploadsLocally();
      selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setSelectedFiles([]);
    } catch (error) {
      console.error(error.message);
      setUploadMessage("Could not save these photos locally.");
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteUploadedPhoto(photo) {
    if (!uploadEvent) {
      return;
    }

    if (authToken && !photo.isLocal) {
      try {
        await window.PhotoFlyApi.deletePhoto(authToken, photo.id);
      } catch (error) {
        console.error(error.message);
        setUploadMessage("Backend delete failed, removing it from this view.");
      }
    }

    setEventPhotos((currentPhotos) => currentPhotos.filter((item) => item.id !== photo.id));
    setLocalPhotosByEvent((currentPhotos) => ({
      ...currentPhotos,
      [uploadEvent.id]: (currentPhotos[uploadEvent.id] || []).filter((item) => item.id !== photo.id),
    }));
    updateEventPhotoCount(uploadEvent.id, -1);
  }

  return (
    <main className="studio-dashboard">
      <section className="dashboard-header">
        <div>
          <span className="section-badge">Studio Control</span>
          <h1>Studio Dashboard</h1>
          <p>
            Welcome back, {user?.fullName || "Studio Admin"}. Manage events,
            AI processing, and gallery delivery from one place.
          </p>
          <div className="dashboard-mode-row">
            <span className={`dashboard-mode-pill ${dataMode}`}>
              {dataMode === "backend" ? "Backend synced" : dataMode === "syncing" ? "Syncing data" : "Local data mode"}
            </span>
            <button type="button" onClick={resetLocalEvents}>Reset local data</button>
          </div>
        </div>

        <button className="dashboard-primary-button" type="button" onClick={openNewEventForm} disabled={isSyncing}>
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

      <section className="dashboard-toolbar" aria-label="Dashboard tools">
        <label className="dashboard-search-field">
          <span>Search events</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Event name or gallery code"
          />
        </label>

        <label className="dashboard-filter-field">
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>All</option>
            <option>Upload pending</option>
            <option>AI sorting</option>
            <option>Ready to share</option>
          </select>
        </label>
      </section>

      <section className="dashboard-event-list" aria-label="Event list">
        {filteredEvents.map((event) => (
          <article className="dashboard-event-card" key={event.id}>
            <img src={event.cover} alt="" />

            <div className="dashboard-event-content">
              <div className="dashboard-event-title-row">
                <div>
                  <h2>{event.name}</h2>
                  <p>
                    {event.date} | {event.photoCount.toLocaleString()} photos
                  </p>
                  <small className="event-code-line">Gallery code: {event.shareCode}</small>
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
                <button type="button" onClick={() => openUploadEvent(event)}>
                  Upload Photos
                </button>
                <button type="button" onClick={() => openShareEvent(event)}>
                  Share Gallery
                </button>
                <button type="button" onClick={() => openEditEventForm(event)}>
                  Edit Event
                </button>
                <button type="button" onClick={() => deleteEvent(event.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
        {!filteredEvents.length && (
          <div className="dashboard-empty-state">
            <strong>No events found</strong>
            <p>Try another search or reset local data to restore sample events.</p>
          </div>
        )}
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
                  {isSyncing ? "Saving..." : isEditingEvent ? "Save Event" : "Add Event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {uploadEvent && (
        <div className="auth-modal-backdrop" role="presentation">
          <section className="auth-modal upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title">
            <button className="modal-close-button" type="button" onClick={closeUploadEvent} aria-label="Close upload dialog">
              x
            </button>

            <div className="auth-modal-header">
              <span className="auth-kicker">Image upload</span>
              <h2 id="upload-title">{uploadEvent.name}</h2>
              <p>Add event photos to the gallery. Images sync with backend when available, otherwise they stay in local data.</p>
            </div>

            <div className="upload-dropzone">
              <input
                id="event-photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleUploadFileChange}
              />
              <label htmlFor="event-photo-upload">
                <strong>Choose images</strong>
                <span>JPG, PNG, WEBP, or GIF up to 20MB each</span>
              </label>
            </div>

            {selectedFiles.length > 0 && (
              <section className="upload-preview-panel" aria-label="Selected photos">
                <div className="upload-panel-header">
                  <strong>{selectedFiles.length} selected</strong>
                  <button type="button" onClick={() => {
                    selectedFiles.forEach((item) => URL.revokeObjectURL(item.previewUrl));
                    setSelectedFiles([]);
                  }}>
                    Clear
                  </button>
                </div>
                <div className="upload-preview-grid">
                  {selectedFiles.map((item) => (
                    <article key={`${item.name}-${item.size}`}>
                      <img src={item.previewUrl} alt="" />
                      <button type="button" onClick={() => removeSelectedFile(item.name)} aria-label={`Remove ${item.name}`}>
                        x
                      </button>
                      <span>{item.name}</span>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <div className="upload-action-row">
              <button className="cancel-button" type="button" onClick={closeUploadEvent}>
                Close
              </button>
              <button className="auth-submit-button" type="button" onClick={uploadSelectedPhotos} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Photos"}
              </button>
            </div>

            {uploadMessage && <small className="upload-message">{uploadMessage}</small>}

            <section className="event-gallery-panel" aria-label="Uploaded event photos">
              <div className="upload-panel-header">
                <strong>Gallery photos</strong>
                <span>{eventPhotos.length} photos</span>
              </div>

              {eventPhotos.length > 0 ? (
                <div className="event-gallery-grid">
                  {eventPhotos.map((photo) => (
                    <article key={photo.id}>
                      <img src={photo.url} alt={photo.name || ""} />
                      <button type="button" onClick={() => deleteUploadedPhoto(photo)} aria-label="Delete uploaded photo">
                        Delete
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="dashboard-empty-state compact">
                  <strong>No photos yet</strong>
                  <p>Upload a few images to start this event gallery.</p>
                </div>
              )}
            </section>
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
