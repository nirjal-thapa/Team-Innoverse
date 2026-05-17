const mongoose = require("mongoose");
const runtime = require("./runtime");

const connectDB = async () => {
  if (process.env.USE_LOCAL_SEED === "true") {
    runtime.useLocalSeed = true;
    console.log("Local seed mode active: USE_LOCAL_SEED=true");
    return;
  }

  const hasSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (hasSupabase) {
    try {
      const { createClient } = require("@supabase/supabase-js");
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });
      const { error } = await supabase.from("users").select("id").limit(1);
      if (error) throw error;

      runtime.useLocalSeed = false;
      console.log("Supabase connected");
      return;
    } catch (err) {
      runtime.useLocalSeed = true;
      console.warn(`Supabase unavailable, using local seed data: ${err.message}`);
      return;
    }
  }

  if (!process.env.MONGODB_URI) {
    runtime.useLocalSeed = true;
    console.log("Local seed mode active: no MongoDB URI and no Supabase configuration");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    runtime.useLocalSeed = false;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    runtime.useLocalSeed = true;
    console.warn(`MongoDB unavailable, using local seed data: ${err.message}`);
  }
};

module.exports = connectDB;
