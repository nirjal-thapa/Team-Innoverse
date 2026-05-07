const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Photo = require("../models/Photo");
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");
const { uploadPhoto, cloudinary } = require("../config/cloudinary");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");
const axios = require("axios");

const localUploadDir = path.join(__dirname, "../../uploads/photos");
fs.mkdirSync(localUploadDir, { recursive: true });

const localUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, localUploadDir),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 20 * 1024 * 1024, files: 100 },
});

function runPhotoUpload(req, res, next) {
  const uploader = runtime.useLocalSeed ? localUpload : uploadPhoto;
  uploader.array("photos", 100)(req, res, next);
}

// GET /api/photos?eventId=xxx
router.get("/", auth, async (req, res) => {
  try {
    const { eventId, page = 1, limit = 50 } = req.query;

    if (runtime.useLocalSeed) {
      const photos = localSeed.listPhotosForEvent(eventId);
      return res.json({
        photos: photos.slice((page - 1) * limit, (page - 1) * limit + parseInt(limit)),
        total: photos.length,
        page: parseInt(page),
      });
    }

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
router.post("/upload", auth, requireRole("photographer", "admin"), runPhotoUpload, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ message: "eventId required" });

    if (runtime.useLocalSeed) {
      const uploadedFiles = (req.files || []).map((file) => ({
        url: `/uploads/photos/${file.filename}`,
        thumbnailUrl: `/uploads/photos/${file.filename}`,
        publicId: file.filename,
      }));
      const photos = localSeed.addPhotos(eventId, req.user, uploadedFiles);
      if (!photos) return res.status(404).json({ message: "Event not found" });
      return res.status(201).json({ photos, count: photos.length });
    }

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
    if (runtime.useLocalSeed) {
      const photo = localSeed.deletePhoto(req.params.id, req.user);
      if (!photo) return res.status(404).json({ message: "Photo not found" });
      if (photo.publicId) {
        fs.rm(path.join(localUploadDir, photo.publicId), { force: true }, () => {});
      }
      return res.json({ message: "Photo deleted" });
    }

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
