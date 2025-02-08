const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, "views")));

// Supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Render the form
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission
app.post("/api/alertData", async (req, res) => {
  console.log("Received Data:", req.body);

  try {
    const { title, message } = req.body;
    const { data, error } = await supabase
      .from("alert_message_qr") // Replace with your table name
      .insert([{ title, message }]);

    if (error) throw error;

    res.status(200).json({ message: "Data saved successfully!", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the app for Vercel
module.exports = app;

// Start the server for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
