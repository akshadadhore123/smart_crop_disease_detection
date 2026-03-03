 const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Prediction = require("../models/Prediction");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Treatment info
const treatmentData = {
  "Leaf Spot": { cause: "Fungal infection due to high humidity", organicTreatment: "Use Neem oil spray every 7 days", chemicalTreatment: "Spray Mancozeb 75% WP" },
  "Blight": { cause: "Bacterial infection in wet conditions", organicTreatment: "Remove infected leaves", chemicalTreatment: "Use Copper-based fungicide" },
  "Rust": { cause: "Fungal disease affecting leaves", organicTreatment: "Apply Sulfur-based solution", chemicalTreatment: "Use Fungicide B 50%" },
  "Healthy": { cause: "No disease detected", organicTreatment: "N/A", chemicalTreatment: "N/A" }
};

// POST /predict
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

    const crop = req.body.crop;

    // Dummy AI logic for demo
    const cropDiseases = {
      tomato: ["Healthy", "Leaf Spot", "Blight"],
      potato: ["Healthy", "Leaf Spot", "Blight"],
      wheat: ["Healthy", "Rust", "Leaf Spot"],
      rice: ["Healthy", "Leaf Spot", "Blight"]
    };

    const diseases = cropDiseases[crop] || ["Healthy"];
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const randomConfidence = (Math.random() * (99 - 80) + 80).toFixed(2);

    // Save prediction in MongoDB
    const prediction = new Prediction({
      image: req.file.filename,
      crop: crop,
      disease: randomDisease,
      confidence: randomConfidence + "%"
    });
    await prediction.save();

    const treatment = treatmentData[randomDisease];

    res.status(200).json({
      success: true,
      disease: randomDisease,
      confidence: randomConfidence + "%",
      cause: treatment.cause,
      organicTreatment: treatment.organicTreatment,
      chemicalTreatment: treatment.chemicalTreatment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error! Check backend & MongoDB connection." });
  }
});

module.exports = router;