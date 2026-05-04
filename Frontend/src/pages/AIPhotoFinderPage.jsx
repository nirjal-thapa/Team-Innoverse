function AIPhotoFinderPage() {
  const [selectedPhotos, setSelectedPhotos] = React.useState([]);
  const [isDragging, setIsDragging] = React.useState(false);

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
    </main>
  );
}
