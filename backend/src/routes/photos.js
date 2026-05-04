const router = require("express").Router();
const Photo = require("../models/Photo");
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");
const { uploadPhoto, cloudinary } = require("../config/cloudinary");
const axios = require("axios");

// GET /api/photos?eventId=xxx
router.get("/", auth, async (req, res) => {
  try {
    const { eventId, page = 1, limit = 50 } = req.query;
    const filter = eventId ? { eventId } : {};
    const photos = await Photo.find(filter)
      .select("-faces.embedding") // don't send embeddings to client
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Photo.countDocuments(filter);
    res.json({ photos, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/photos/upload — bulk upload
router.post("/upload", auth, requireRole("photographer", "admin"), uploadPhoto.array("photos", 100), async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const photos = await Photo.insertMany(
      req.files.map((f) => ({
        eventId,
        url: f.path,
        publicId: f.filename,
        thumbnailUrl: f.path.replace("/upload/", "/upload/w_400,h_400,c_fill/"),
        width: f.width,
        height: f.height,
        uploadedBy: req.user._id,
      }))
    );

    // Update event photo count
    await Event.findByIdAndUpdate(eventId, { $inc: { photoCount: photos.length } });

    res.status(201).json({ photos, count: photos.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/photos/index/:eventId — trigger AI face indexing
router.post("/index/:eventId", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    const photos = await Photo.find({ eventId: req.params.eventId, indexed: false });
    if (!photos.length) return res.json({ message: "All photos already indexed" });

    // Send to AI microservice for async processing
    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    axios.post(`${aiUrl}/index`, {
      eventId: req.params.eventId,
      photos: photos.map(p => ({ id: p._id, url: p.url })),
    }).catch(err => console.error("AI indexing error:", err.message));

    res.json({ message: `Indexing ${photos.length} photos`, count: photos.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/photos/index-callback — called by AI service when done
router.post("/index-callback", async (req, res) => {
  try {
    const { photoId, faces, tags } = req.body;
    await Photo.findByIdAndUpdate(photoId, {
      faces,
      facesCount: faces.length,
      tags,
      indexed: true,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/photos/:id
router.delete("/:id", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });
    if (photo.publicId) await cloudinary.uploader.destroy(photo.publicId);
    await Event.findByIdAndUpdate(photo.eventId, { $inc: { photoCount: -1 } });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
