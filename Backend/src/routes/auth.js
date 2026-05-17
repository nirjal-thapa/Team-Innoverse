const router = require("express").Router();
const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");
const { auth } = require("../middleware/auth");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

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
      const token = user._id;
      return res.status(201).json({ user, token });
    }

    const allowedRoles = ["user", "photographer"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const { data: authUserData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: userRole },
    });
    if (authError) {
      if (authError.message?.includes("already registered") || authError.message?.includes("duplicate")) {
        return res.status(409).json({ message: "Email already registered" });
      }
      return res.status(500).json({ message: authError.message });
    }

    const authUser = authUserData?.user;
    if (!authUser) {
      return res.status(500).json({ message: "Unable to create Supabase user" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const profile = {
      id: authUser.id,
      name,
      email,
      hashed_password: hashedPassword,
      role: userRole,
      plan_tier: "free",
      is_active: true,
    };

    const { error: profileError } = await supabase.from("users").insert(profile);
    if (profileError) return res.status(500).json({ message: profileError.message });

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !signInData.session) {
      return res.status(500).json({ message: signInError?.message || "Unable to sign in after registration" });
    }

    res.status(201).json({ user: profile, token: signInData.session.access_token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    if (runtime.useLocalSeed) {
      const user = localSeed.findUserByEmail(email);
      if (!user || !(await localSeed.comparePassword(user, password))) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.banned) return res.status(403).json({ message: "Account banned" });

      const token = user._id;
      return res.json({ user: localSeed.cleanUser(user), token });
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !signInData.session) {
      return res.status(401).json({ message: signInError?.message || "Invalid email or password" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", signInData.user.id)
      .single();
    if (profileError || !profile) {
      return res.status(500).json({ message: profileError?.message || "User profile not found" });
    }
    if (profile.banned || profile.is_active === false || profile.is_active === false) return res.status(403).json({ message: "Account banned" });

    res.json({ user: profile, token: signInData.session.access_token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", auth, (req, res) => res.json(req.user));

module.exports = router;
