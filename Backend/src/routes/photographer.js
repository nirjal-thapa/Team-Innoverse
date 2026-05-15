const router = require("express").Router();
const Event = require("../models/Event");
const Photo = require("../models/Photo");
const SearchLog = require("../models/SearchLog");
const { auth, requireRole } = require("../middleware/auth");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

// GET /api/photographer/stats
router.get("/stats", auth, requireRole("photographer", "admin"), async (req, res) => {
  try {
    if (runtime.useLocalSeed) {
      const events = localSeed.listEventsForUser(req.user);
      return res.json({
        totalEvents: events.length,
        totalPhotos: events.reduce((sum, event) => sum + (Number(event.photoCount) || 0), 0),
        totalSearches: events.reduce((sum, event) => sum + (Number(event.searchCount) || 0), 0),
        totalDownloads: events.reduce((sum, event) => sum + (Number(event.downloadCount) || 0), 0),
      });
    }

    const photographerId = req.user._id;
    const events = await Event.find({ photographerId });
    const eventIds = events.map((e) => e._id);

    const [totalPhotos, totalSearches] = await Promise.all([
      Photo.countDocuments({ eventId: { $in: eventIds } }),
      SearchLog.countDocuments({ eventId: { $in: eventIds } }),
    ]);

    const totalDownloads = events.reduce((sum, e) => sum + (e.downloadCount || 0), 0);

    res.json({
      totalEvents: events.length,
      totalPhotos,
      totalSearches,
      totalDownloads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
