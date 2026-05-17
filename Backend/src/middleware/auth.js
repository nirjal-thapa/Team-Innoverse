const supabase = require("../config/supabase");
const runtime = require("../config/runtime");
const localSeed = require("../data/localSeed");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });

    if (runtime.useLocalSeed) {
      const decoded = token;
      const user = localSeed.findUserById(decoded);
      if (!user) return res.status(401).json({ message: "User not found" });
      if (user.banned) return res.status(403).json({ message: "Account banned" });

      req.user = user;
      return next();
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ message: "Invalid token" });

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(401).json({ message: "User profile not found" });
    }
    if (profile.banned || profile.is_active === false) return res.status(403).json({ message: "Account banned" });

    req.user = profile;
    next();
  } catch (err) {
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
