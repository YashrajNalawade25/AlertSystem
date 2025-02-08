const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

// Supabase setup (DO NOT expose API keys publicly)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle form submission
app.post("/api/alertData", async (req, res) => {
  console.log("Received Data:", req.body);

  try {
    const { title, message } = req.body;
    const { data, error } = await supabase
      .from("alert_message_qr") // Replace with your actual table name
      .insert([{ title, message }]);

    if (error) throw error;

    res.status(200).json({ message: "Data saved successfully!", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export handler for Vercel
module.exports = app;
