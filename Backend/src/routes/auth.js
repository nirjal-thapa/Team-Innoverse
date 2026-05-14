const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || "photo-fly-local-seed-secret", { expiresIn: "7d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    if (runtime.useLocalSeed) {
      const exists = localSeed.findUserByEmail(email);
      if (exists) return res.status(409).json({ message: "Email already registered" });

      const allowedRoles = ["user", "photographer"];
      const user = await localSeed.createUser({
        name,
        email,
        password,
        role: allowedRoles.includes(role) ? role : "user",
      });
      const token = signToken(user._id);
      return res.status(201).json({ user, token });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const allowedRoles = ["user", "photographer"];
    const user = await User.create({ name, email, password, role: allowedRoles.includes(role) ? role : "user" });
    const token = signToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (runtime.useLocalSeed) {
      const user = localSeed.findUserByEmail(email);
      if (!user || !(await localSeed.comparePassword(user, password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.banned) return res.status(403).json({ message: "Account banned" });

      const token = signToken(user._id);
      return res.json({ user: localSeed.cleanUser(user), token });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.banned) return res.status(403).json({ message: "Account banned" });

    const token = signToken(user._id);
    res.json({ user: user.toJSON(), token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, (req, res) => res.json(req.user));

module.exports = router;
