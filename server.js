const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const predictRoute = require("./routes/predictRoute");

const app = express();

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/agrovision"; // Change if using Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API route
app.use("/predict", predictRoute);

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));