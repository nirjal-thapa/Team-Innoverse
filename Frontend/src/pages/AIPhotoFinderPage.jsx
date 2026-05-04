function AIPhotoFinderPage() {
  const [selectedPhotos, setSelectedPhotos] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const finderStats = [
    {
      label: "Total Photos Uploaded",
      value: "15,680",
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
      label: "Total Face Searches",
      value: "342",
      note: "+23% this week",
      noteTone: "blue",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
          <path d="M9 15c1.7 1.4 4.3 1.4 6 0" />
        </svg>
      ),
      tone: "purple",
    },
    {
      label: "Plan Status",
      value: "Studio Pro",
      note: "Renews April 15, 2026",
      noteTone: "orange",
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3 8 4 3 5-7 5 7 4-3-2 11H5L3 8Z" />
          <path d="M5 19h14" />
        </svg>
      ),
      tone: "amber",
    },
  ];

  function addPhotos(fileList) {
    const photos = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!photos.length) {
      return;
    }

    setSelectedPhotos((currentPhotos) => [...currentPhotos, ...photos]);
  }

  function handleDrag(event) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(event.type === "dragenter" || event.type === "dragover");
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    addPhotos(event.dataTransfer.files);
  }

  function handleFileSelect(event) {
    addPhotos(event.target.files);
  }

  return (
    <main className="ai-finder-page">
      <section className="ai-finder-header">
        <span className="ai-finder-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
            <rect x="7" y="7" width="10" height="10" rx="2" />
            <path d="M10 10h4v4h-4z" />
          </svg>
          AI Superpower
        </span>
        <h1>AI Photo Finder Demo</h1>
        <p>Upload a selfie -> AI scans thousands of photos -> You get your personal gallery.</p>
      </section>

      <section className="ai-upload-card" aria-label="Upload photos for AI finder">
        <div className="ai-upload-card-header">
          <h2>Upload Photos</h2>
          <p>Upload event photos and let AI recognize every face</p>
        </div>

        <div className="ai-upload-card-body">
          <div
            className={`ai-drop-zone ${isDragging ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <svg className="ai-upload-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 16V5" />
              <path d="m7 10 5-5 5 5" />
              <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
            </svg>
            <p>Drag & drop your photos here</p>
            <small>or</small>
            <label className="ai-select-button">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 16V5" />
                <path d="m7 10 5-5 5 5" />
                <path d="M20 16.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2.5" />
              </svg>
              Select Photos
              <input type="file" multiple accept="image/*" onChange={handleFileSelect} />
            </label>
            <span>Supports JPG, PNG, HEIC - up to 100MB each</span>
          </div>
        </div>
      </section>

      <section className="ai-finder-stats" aria-label="AI finder overview">
        {finderStats.map((stat) => (
          <article key={stat.label}>
            <div>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              {stat.note && <small className={stat.noteTone || ""}>{stat.note}</small>}
            </div>
            <span className={`dashboard-stat-icon ${stat.tone}`}>{stat.icon}</span>
          </article>
        ))}
      </section>
    </main>
  );
}
