function PhotographerDashboard({ user, onLogout }) {
  const storageKey = `photofly_photographer_events_${user?.email || "guest"}`;
  const settingsKey = `photofly_photographer_settings_${user?.email || "guest"}`;
  const blankEvent = {
    name: "",
    date: "",
    type: "",
    location: "",
    description: "",
    cover: "",
    galleryName: "",
    galleryPassword: "",
    guestUploads: true,
    watermark: false,
  };
  const seedEvents = [
    {
      id: "event-rahul-priya",
      name: "Rahul & Priya Wedding",
      date: "2026-05-28",
      type: "Wedding",
      location: "Jaipur, Rajasthan",
      description: "Three-day wedding celebration with family portraits, rituals, and reception coverage.",
      cover: "https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      galleryName: "Rahul & Priya Wedding Gallery",
      galleryPassword: "family2026",
      guestUploads: true,
      watermark: false,
      status: "Published",
      views: 426,
      photos: [
        {
          id: "photo-rp-1",
          name: "ceremony-cover.jpg",
          size: 3200000,
          url: "https://images.pexels.com/photos/1589216/pexels-photo-1589216.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
        },
        {
          id: "photo-rp-2",
          name: "couple-portrait.jpg",
          size: 2800000,
          url: "https://images.pexels.com/photos/3812639/pexels-photo-3812639.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
        },
      ],
    },
    {
      id: "event-everest-launch",
      name: "Everest Brand Launch",
      date: "2026-06-04",
      type: "Corporate",
      location: "Kathmandu, Nepal",
      description: "Launch night, team portraits, product moments, and stage coverage.",
      cover: "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      galleryName: "Everest Launch Gallery",
      galleryPassword: "",
      guestUploads: false,
      watermark: true,
      status: "Draft",
      views: 288,
      photos: [
        {
          id: "photo-el-1",
          name: "launch-stage.jpg",
          size: 4100000,
          url: "https://images.pexels.com/photos/301987/pexels-photo-301987.jpeg?auto=compress&cs=tinysrgb&w=700&h=500&fit=crop",
        },
      ],
    },
  ];

  const [activePage, setActivePage] = React.useState("overview");
  const [events, setEvents] = React.useState(() => {
    const savedEvents = localStorage.getItem(storageKey);
    return savedEvents ? JSON.parse(savedEvents) : seedEvents;
  });
  const [formData, setFormData] = React.useState(blankEvent);
  const [formErrors, setFormErrors] = React.useState({});
  const [selectedEventId, setSelectedEventId] = React.useState(() => events[0]?.id || "");
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("All");
  const [notice, setNotice] = React.useState("");
  const [settings, setSettings] = React.useState(() => {
    const savedSettings = localStorage.getItem(settingsKey);
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          displayName: user?.fullName || "Arjun",
          role: "Photographer",
          emailNotifications: true,
          autoWatermark: false,
          storagePlan: "Pro 100 GB",
        };
  });

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(events));
  }, [events, storageKey]);

  React.useEffect(() => {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }, [settings, settingsKey]);

  const selectedEvent = events.find((event) => event.id === selectedEventId) || events[0];
  const allPhotos = events.flatMap((event) =>
    (event.photos || []).map((photo) => ({
      ...photo,
      eventId: event.id,
      eventName: event.name,
      galleryName: event.galleryName,
    }))
  );
  const totalPhotos = allPhotos.length;
  const storageUsed = allPhotos.reduce((sum, photo) => sum + Number(photo.size || 0), 0) / (1024 * 1024 * 1024);
  const storagePercent = Math.min(100, Math.round((storageUsed / 100) * 100));
  const totalViews = events.reduce((sum, event) => sum + Number(event.views || 0), 0);
  const filteredEvents = events.filter((event) => {
    const searchText = `${event.name} ${event.galleryName} ${event.location} ${event.type}`.toLowerCase();
    const matchesQuery = searchText.includes(query.toLowerCase());
    const matchesType = typeFilter === "All" || event.type === typeFilter;
    return matchesQuery && matchesType;
  });
  const eventTypes = ["All", ...Array.from(new Set(events.map((event) => event.type).filter(Boolean)))];
  const monthlyData = [
    { label: "Jan", value: 18 },
    { label: "Feb", value: 28 },
    { label: "Mar", value: 22 },
    { label: "Apr", value: 44 },
    { label: "May", value: Math.max(52, events.length * 18 + totalPhotos * 3) },
    { label: "Jun", value: Math.max(34, totalViews / 10) },
  ];
  const typeCounts = events.reduce((counts, event) => {
    counts[event.type || "Other"] = (counts[event.type || "Other"] || 0) + 1;
    return counts;
  }, {});

  function formatDate(value) {
    if (!value) return "No date";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function formatSize(size) {
    const mb = Number(size || 0) / (1024 * 1024);
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${Math.max(0.1, mb).toFixed(1)} MB`;
  }

  function galleryLink(event) {
    return `${window.location.origin}/gallery/${event.id}`;
  }

  function handleFieldChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    setNotice("");
  }

  function handleCoverUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormErrors((currentErrors) => ({ ...currentErrors, cover: "Choose an image file." }));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors((currentErrors) => ({ ...currentErrors, cover: "Cover photo must be under 10MB." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((currentData) => ({ ...currentData, cover: reader.result }));
      setFormErrors((currentErrors) => ({ ...currentErrors, cover: "" }));
    };
    reader.readAsDataURL(file);
  }

  function validateEvent() {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = "Event name is required.";
    if (!formData.date) nextErrors.date = "Event date is required.";
    if (!formData.type) nextErrors.type = "Select event type.";
    if (!formData.galleryName.trim()) nextErrors.galleryName = "Gallery name is required.";
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function createEvent(event) {
    event.preventDefault();
    if (!validateEvent()) return;

    const nextEvent = {
      ...formData,
      id: `event-${Date.now()}`,
      name: formData.name.trim(),
      galleryName: formData.galleryName.trim(),
      description: formData.description.trim(),
      cover:
        formData.cover ||
        "https://images.pexels.com/photos/3812639/pexels-photo-3812639.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      status: "Draft",
      views: 0,
      photos: [],
    };

    setEvents((currentEvents) => [nextEvent, ...currentEvents]);
    setSelectedEventId(nextEvent.id);
    setFormData(blankEvent);
    setFormErrors({});
    setNotice(`${nextEvent.name} created. Add photos from the Photos page.`);
    setActivePage("events");
  }

  function deleteEvent(eventId) {
    const nextEvents = events.filter((event) => event.id !== eventId);
    setEvents(nextEvents);
    if (selectedEventId === eventId) {
      setSelectedEventId(nextEvents[0]?.id || "");
    }
  }

  function updateEvent(eventId, updates) {
    setEvents((currentEvents) =>
      currentEvents.map((event) => (event.id === eventId ? { ...event, ...updates } : event))
    );
  }

  function handlePhotoUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!selectedEvent || !files.length) return;
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      setNotice("Choose JPG, PNG, WEBP, or GIF images.");
      return;
    }

    Promise.all(
      imageFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `photo-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                url: reader.result,
              });
            reader.readAsDataURL(file);
          })
      )
    ).then((newPhotos) => {
      setEvents((currentEvents) =>
        currentEvents.map((item) =>
          item.id === selectedEvent.id ? { ...item, photos: [...newPhotos, ...(item.photos || [])] } : item
        )
      );
      setNotice(`${newPhotos.length} photo${newPhotos.length === 1 ? "" : "s"} uploaded to ${selectedEvent.name}.`);
      event.target.value = "";
    });
  }

  function deletePhoto(eventId, photoId) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId
          ? { ...event, photos: (event.photos || []).filter((photo) => photo.id !== photoId) }
          : event
      )
    );
  }

  function updateSetting(event) {
    const { name, value, type, checked } = event.target;
    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function copySelectedGallery() {
    if (!selectedEvent) return;
    const text = `Gallery: ${selectedEvent.galleryName}\nLink: ${galleryLink(selectedEvent)}\nPassword: ${selectedEvent.galleryPassword || "No password"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => setNotice("Gallery share details copied."));
    } else {
      setNotice(text);
    }
  }

  function renderIcon(name) {
    const icons = {
      overview: <><path d="M3 13h8V3H3z" /><path d="M13 21h8V11h-8z" /><path d="M13 9h8V3h-8z" /><path d="M3 21h8v-6H3z" /></>,
      create: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
      events: <><path d="M8 2v4" /><path d="M16 2v4" /><path d="M3 9h18" /><path d="M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /></>,
      photos: <><path d="M4 5h16v14H4z" /><path d="m4 16 5-5 4 4 2-2 5 5" /><path d="M8 9h.01" /></>,
      storage: <><path d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
      settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="m19.4 15-.9 1.6 1 2-2 2-2-1-.6.3-.7 2.1h-3l-.7-2.1-.6-.3-2 1-2-2 1-2-.3-.6-2.1-.7v-3l2.1-.7.3-.6-1-2 2-2 2 1 .6-.3.7-2.1h3l.7 2.1.6.3 2-1 2 2-1 2 .3.6 2.1.7v3l-2.1.7Z" /></>,
    };
    return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>;
  }

  function renderStats() {
    return (
      <section className="photographer-stat-grid" aria-label="Dashboard overview">
        <article><span>Total Events</span><strong>{events.length}</strong><small>{events.filter((event) => event.status === "Published").length} published</small></article>
        <article><span>Total Photos</span><strong>{totalPhotos.toLocaleString()}</strong><small>Across all galleries</small></article>
        <article><span>Gallery Views</span><strong>{totalViews.toLocaleString()}</strong><small>Client activity</small></article>
        <article><span>Storage Used</span><strong>{storageUsed.toFixed(2)} GB</strong><small>{storagePercent}% of 100 GB</small></article>
      </section>
    );
  }

  function renderCharts() {
    const maxValue = Math.max(1, ...monthlyData.map((item) => item.value));
    const donutOffset = 314 - (314 * storagePercent) / 100;

    return (
      <section className="photographer-chart-grid" aria-label="Reports and graphs">
        <article className="photographer-chart-card">
          <div className="photographer-card-header"><h3>Gallery Activity</h3><span>Live graph</span></div>
          <div className="bar-chart">
            {monthlyData.map((item) => (
              <div className="bar-chart-item" key={item.label}>
                <span style={{ height: `${Math.max(10, (item.value / maxValue) * 100)}%` }}></span>
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="photographer-chart-card split">
          <div className="photographer-card-header"><h3>Storage</h3><span>{settings.storagePlan}</span></div>
          <div className="storage-donut">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" />
              <circle cx="60" cy="60" r="50" style={{ strokeDashoffset: donutOffset }} />
            </svg>
            <div><strong>{storagePercent}%</strong><span>{storageUsed.toFixed(2)} GB used</span></div>
          </div>
        </article>

        <article className="photographer-chart-card">
          <div className="photographer-card-header"><h3>Event Mix</h3><span>{Object.keys(typeCounts).length} types</span></div>
          <div className="event-mix-list">
            {Object.entries(typeCounts).map(([type, count]) => (
              <div key={type}>
                <span>{type}</span>
                <strong>{count}</strong>
                <small><em style={{ width: `${Math.max(12, (count / Math.max(1, events.length)) * 100)}%` }}></em></small>
              </div>
            ))}
          </div>
        </article>
      </section>
    );
  }

  function renderCreateEvent() {
    return (
      <section className="photographer-panel photographer-create-page">
        <div className="photographer-section-heading">
          <h2>Create New Event</h2>
          <p>Build a client-ready event gallery with upload, privacy, and sharing settings.</p>
        </div>

        <form className="photographer-event-form" onSubmit={createEvent} noValidate>
          <div className="photographer-form-grid">
            <label>
              <span>Event Name <b>*</b></span>
              <input name="name" value={formData.name} onChange={handleFieldChange} placeholder="e.g. Rahul & Priya Wedding" />
              {formErrors.name && <small>{formErrors.name}</small>}
            </label>
            <label>
              <span>Event Date <b>*</b></span>
              <input type="date" name="date" value={formData.date} onChange={handleFieldChange} />
              {formErrors.date && <small>{formErrors.date}</small>}
            </label>
            <label>
              <span>Event Type <b>*</b></span>
              <select name="type" value={formData.type} onChange={handleFieldChange}>
                <option value="">Select event type</option>
                <option>Wedding</option>
                <option>Corporate</option>
                <option>Birthday</option>
                <option>Portrait</option>
                <option>Concert</option>
              </select>
              {formErrors.type && <small>{formErrors.type}</small>}
            </label>
            <label>
              <span>Location</span>
              <input name="location" value={formData.location} onChange={handleFieldChange} placeholder="e.g. Jaipur, Rajasthan" />
            </label>
          </div>

          <label className="photographer-wide-field">
            <span>Description (Optional)</span>
            <textarea name="description" value={formData.description} onChange={handleFieldChange} placeholder="Add event description..." />
          </label>

          <div className="photographer-upload-block">
            <span>Event Cover Photo</span>
            <label className={`photographer-upload-zone ${formData.cover ? "has-preview" : ""}`}>
              {formData.cover ? (
                <img src={formData.cover} alt="" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M20 16.5A4.5 4.5 0 0 1 15.5 21h-7A4.5 4.5 0 0 1 4 16.5 5.5 5.5 0 0 1 12 12a5.5 5.5 0 0 1 8 4.5Z" /></svg>
                  <strong>Upload cover Photo</strong>
                  <small>JPG, PNG or WEBP (Max. 10MB)</small>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleCoverUpload} />
              <em>{formData.cover ? "Change File" : "Choose File"}</em>
            </label>
            {formErrors.cover && <small className="photographer-field-error">{formErrors.cover}</small>}
          </div>

          <div className="photographer-section-heading compact">
            <h2>Gallery Settings</h2>
            <p>Customize access, uploads, and photo presentation.</p>
          </div>

          <div className="photographer-form-grid gallery-settings-grid">
            <label>
              <span>Gallery Name <b>*</b></span>
              <input name="galleryName" value={formData.galleryName} onChange={handleFieldChange} placeholder="e.g. Rahul & Priya Wedding Gallery" />
              {formErrors.galleryName && <small>{formErrors.galleryName}</small>}
            </label>
            <label>
              <span>Gallery Password</span>
              <input type="password" name="galleryPassword" value={formData.galleryPassword} onChange={handleFieldChange} placeholder="Set a password (Optional)" />
            </label>
            <label className="photographer-toggle-row">
              <div><span>Photo Upload by Guests</span><p>Allow guests to upload photos</p></div>
              <input type="checkbox" name="guestUploads" checked={formData.guestUploads} onChange={handleFieldChange} />
            </label>
            <label className="photographer-toggle-row">
              <div><span>Watermark</span><p>Add watermark to photos</p></div>
              <input type="checkbox" name="watermark" checked={formData.watermark} onChange={handleFieldChange} />
            </label>
          </div>

          <div className="photographer-form-actions">
            <button type="button" onClick={() => setFormData(blankEvent)}>Cancel</button>
            <button type="submit">{renderIcon("events")} Create Event</button>
          </div>
        </form>
      </section>
    );
  }

  function renderEvents() {
    return (
      <>
        <section className="photographer-panel">
          <div className="photographer-list-toolbar">
            <div>
              <h2>Events</h2>
              <p>Manage galleries, publish status, passwords, and sharing.</p>
            </div>
            <button type="button" onClick={() => setActivePage("create")}>Create Event</button>
          </div>
          <div className="photographer-filters">
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search event, gallery, location..." />
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              {eventTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>
          <div className="photographer-event-list enhanced">
            {filteredEvents.map((event) => (
              <article key={event.id} className={selectedEvent?.id === event.id ? "selected" : ""}>
                <img src={event.cover} alt="" />
                <div>
                  <strong>{event.name}</strong>
                  <span>{formatDate(event.date)} | {event.type} | {event.location || "No location"}</span>
                  <small>{(event.photos || []).length} photos | {event.views.toLocaleString()} views | {event.status}</small>
                </div>
                <div className="photographer-event-actions">
                  <button type="button" onClick={() => { setSelectedEventId(event.id); setActivePage("photos"); }}>Upload</button>
                  <button type="button" onClick={() => updateEvent(event.id, { status: event.status === "Published" ? "Draft" : "Published" })}>
                    {event.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                  <button type="button" onClick={() => deleteEvent(event.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selectedEvent && (
          <section className="photographer-panel">
            <div className="photographer-detail-hero">
              <img src={selectedEvent.cover} alt="" />
              <div>
                <span>{selectedEvent.status}</span>
                <h2>{selectedEvent.galleryName}</h2>
                <p>{selectedEvent.description || "No description added."}</p>
                <div>
                  <button type="button" onClick={copySelectedGallery}>Copy Share Details</button>
                  <button type="button" onClick={() => setActivePage("photos")}>Manage Photos</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </>
    );
  }

  function renderPhotos() {
    return (
      <>
        <section className="photographer-panel">
          <div className="photographer-list-toolbar">
            <div><h2>Photos</h2><p>Upload images into the selected event gallery.</p></div>
            <select value={selectedEvent?.id || ""} onChange={(event) => setSelectedEventId(event.target.value)}>
              {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
            </select>
          </div>

          {selectedEvent ? (
            <>
              <div className="photographer-upload-inline">
                <div>
                  <strong>{selectedEvent.name}</strong>
                  <span>{(selectedEvent.photos || []).length} photos in this gallery</span>
                </div>
                <label>
                  Upload Photos
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="photographer-photo-grid">
                {(selectedEvent.photos || []).map((photo) => (
                  <article key={photo.id}>
                    <img src={photo.url} alt={photo.name} />
                    <strong>{photo.name}</strong>
                    <span>{formatSize(photo.size)}</span>
                    <button type="button" onClick={() => deletePhoto(selectedEvent.id, photo.id)}>Delete</button>
                  </article>
                ))}
                {!(selectedEvent.photos || []).length && (
                  <div className="photographer-empty-state">No photos yet. Upload images to build this gallery.</div>
                )}
              </div>
            </>
          ) : (
            <div className="photographer-empty-state">Create an event before uploading photos.</div>
          )}
        </section>
      </>
    );
  }

  function renderStorage() {
    return (
      <>
        {renderCharts()}
        <section className="photographer-panel">
          <div className="photographer-card-header"><h3>Storage by Event</h3><span>{storageUsed.toFixed(2)} GB used</span></div>
          <div className="storage-breakdown">
            {events.map((event) => {
              const used = (event.photos || []).reduce((sum, photo) => sum + Number(photo.size || 0), 0) / (1024 * 1024 * 1024);
              return (
                <div key={event.id}>
                  <span>{event.name}</span>
                  <strong>{used.toFixed(2)} GB</strong>
                  <small><em style={{ width: `${Math.min(100, used * 12)}%` }}></em></small>
                </div>
              );
            })}
          </div>
        </section>
      </>
    );
  }

  function renderSettings() {
    return (
      <section className="photographer-panel">
        <div className="photographer-section-heading">
          <h2>Settings</h2>
          <p>Update dashboard identity and default gallery preferences.</p>
        </div>
        <div className="photographer-settings-body">
          <div className="photographer-form-grid">
            <label><span>Display Name</span><input name="displayName" value={settings.displayName} onChange={updateSetting} /></label>
            <label><span>Role</span><input name="role" value={settings.role} onChange={updateSetting} /></label>
            <label><span>Storage Plan</span><select name="storagePlan" value={settings.storagePlan} onChange={updateSetting}><option>Starter 25 GB</option><option>Pro 100 GB</option><option>Studio 1 TB</option></select></label>
            <label className="photographer-toggle-row"><div><span>Email Notifications</span><p>Receive event and storage alerts</p></div><input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={updateSetting} /></label>
            <label className="photographer-toggle-row"><div><span>Default Watermark</span><p>Enable watermark on future galleries</p></div><input type="checkbox" name="autoWatermark" checked={settings.autoWatermark} onChange={updateSetting} /></label>
          </div>
        </div>
      </section>
    );
  }

  function renderOverview() {
    return (
      <>
        {renderStats()}
        {renderCharts()}
        {notice && <p className="photographer-success">{notice}</p>}
        <section className="photographer-panel">
          <div className="photographer-list-toolbar">
            <div><h2>Recent Work</h2><p>Your latest galleries and upload status.</p></div>
            <button type="button" onClick={() => setActivePage("create")}>Create Event</button>
          </div>
          <div className="photographer-event-list enhanced">
            {events.slice(0, 4).map((event) => (
              <article key={event.id}>
                <img src={event.cover} alt="" />
                <div><strong>{event.name}</strong><span>{formatDate(event.date)} | {event.galleryName}</span><small>{(event.photos || []).length} photos | {event.status}</small></div>
                <div className="photographer-event-actions"><button type="button" onClick={() => { setSelectedEventId(event.id); setActivePage("events"); }}>Open</button></div>
              </article>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderActivePage() {
    if (activePage === "create") return renderCreateEvent();
    if (activePage === "events") return renderEvents();
    if (activePage === "photos") return renderPhotos();
    if (activePage === "storage") return renderStorage();
    if (activePage === "settings") return renderSettings();
    return renderOverview();
  }

  const navItems = [
    ["overview", "Dashboard"],
    ["create", "Create Event"],
    ["events", "Events"],
    ["photos", "Photos"],
    ["settings", "Settings"],
    ["storage", "Storage"],
  ];

  return (
    <main className="photographer-dashboard">
      <aside className="photographer-sidebar">
        <div className="photographer-brand"><img src="src/assets/photofly-logo.png" alt="Photofly" /></div>
        <nav aria-label="Photographer dashboard">
          {navItems.map(([id, label]) => (
            <button key={id} type="button" className={activePage === id ? "active" : ""} onClick={() => setActivePage(id)}>
              {renderIcon(id)}
              {label}
            </button>
          ))}
        </nav>
        <div className="photographer-storage-mini">
          <span>Storage Used</span>
          <strong>{storageUsed.toFixed(2)} GB <small>/ 100 GB</small></strong>
          <div><span style={{ width: `${storagePercent}%` }}></span></div>
          <button type="button" onClick={() => setActivePage("storage")}>Upgrade Storage</button>
        </div>
      </aside>

      <section className="photographer-main">
        <header className="photographer-topbar">
          <button type="button" className="photographer-create-button" onClick={() => setActivePage("create")}><span>+</span> Create Event</button>
          <div className="photographer-user">
            <span>{(settings.displayName || "A").slice(0, 1).toUpperCase()}</span>
            <div><strong>Welcome, {settings.displayName || user?.fullName || "Arjun"}</strong><small>{settings.role || "Photographer"}</small></div>
            <button type="button" onClick={onLogout} aria-label="Logout">v</button>
          </div>
        </header>
        <div className="photographer-content">
          {notice && activePage !== "overview" && <p className="photographer-success">{notice}</p>}
          {renderActivePage()}
          <footer className="photographer-footer">© 2024 Photofly. All rights reserved.</footer>
        </div>
      </section>
    </main>
  );
}
