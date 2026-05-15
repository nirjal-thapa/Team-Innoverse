require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
].filter(Boolean));

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));

// Rate limiting
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: "Too many requests" }));
app.use("/api/search", rateLimit({ windowMs: 60 * 1000, max: 10, message: "Search rate limit exceeded" }));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") return next();
  return express.json({ limit: "10mb" })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(morgan("dev"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/photos", require("./routes/photos"));
app.use("/api/search", require("./routes/search"));
app.use("/api/photographer", require("./routes/photographer"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/payments", require("./routes/payments"));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date() }));

// Serve the frontend from the same backend origin.
const frontendPath = path.join(__dirname, "../../Frontend");
const imagesPath = path.join(__dirname, "../../images");
app.use("/images", express.static(imagesPath));
app.use(express.static(frontendPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().finally(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
