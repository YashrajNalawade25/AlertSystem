const express = require("express");
const path = require("path");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = 3000;

app.listen(port, () => {
  console.log("App is listning!");
});

// Supabase connectivity...
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/alertData", async (req, res) => {
  console.log("Received Data:", req.body); // Debugging request data

  try {
    const { title, message } = req.body;

    const { data, error } = await supabase
      .from("alert_message_qr") // Table name in Supabase
      .insert([{ title, message }]);

    if (error) throw error;

    console.log("Data saved successfully", data);
    res.status(200).json({ message: "Data saved successfully!", data });
  } catch (err) {
    console.log("Data save failure:", err.message);
    res.status(500).json({ error: err.message });
  }
});
