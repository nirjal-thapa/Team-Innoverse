const jwt = require("jsonwebtoken");
const User = require("../models/User");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

const jwtSecret = () => process.env.JWT_SECRET || "photo-fly-local-seed-secret";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, jwtSecret());
    const user = runtime.useLocalSeed
      ? localSeed.findUserById(decoded.id)
      : await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    if (user.banned) return res.status(403).json({ message: "Account banned" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
};

module.exports = { auth, requireRole };
