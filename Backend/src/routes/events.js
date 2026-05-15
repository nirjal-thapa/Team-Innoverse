const router = require("express").Router();
const Event = require("../models/Event");
const { auth, requireRole } = require("../middleware/auth");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

// GET /api/events/code/:code - public lookup by code
router.get("/code/:code", async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      const event = localSeed.findEventByCode(req.params.code);
      if (!event) return res.status(404).json({ message: "Event not found" });
      return res.json(event);
    }

    const event = await Event.findOne({ code: req.params.code.toUpperCase(), isActive: true })
      .select("name date code coverImage");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events - photographer's events
router.get("/", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      return res.json({ events: localSeed.listEventsForUser(req.user) });
    }

    const filter = req.user.role === "admin" ? {} : { photographerId: req.user._id };
    const limit = parseInt(req.query.limit) || 50;
    const events = await Event.find(filter).sort({ createdAt: -1 }).limit(limit);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id
router.get("/:id", auth, async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      const event = localSeed.findEventById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      return res.json(event);
    }

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events
router.post("/", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      return res.status(201).json(localSeed.createEvent(req.user, req.body));
    }

    const { name, date, description, code, coverImage, photoCount, status, progress } = req.body;
    if (!name || !date) return res.status(400).json({ message: "Event name and date are required" });

    const event = await Event.create({
      name,
      date,
      description,
      code,
      coverImage,
      photoCount,
      status,
      progress,
      photographerId: req.user._id,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/events/:id
router.patch("/:id", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      const event = localSeed.updateEvent(req.params.id, req.user, req.body);
      if (!event) return res.status(404).json({ message: "Event not found" });
      return res.json(event);
    }

    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, photographerId: req.user._id };
    const event = await Event.findOneAndUpdate(
      filter,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/events/:id
router.delete("/:id", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      const deleted = localSeed.deleteEvent(req.params.id, req.user);
      if (!deleted) return res.status(404).json({ message: "Event not found" });
      return res.json({ message: "Event deleted" });
    }

    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, photographerId: req.user._id };
    const event = await Event.findOneAndDelete(filter);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
