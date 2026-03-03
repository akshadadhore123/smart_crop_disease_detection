 const Prediction = require("../models/predictionModel");
const path = require("path");

// For file upload
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST /api/predict
const predictCrop = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "Image required" });

        // 🔥 Mock AI Prediction (Replace with real AI model integration)
        const mockPrediction = {
            disease: "Leaf Spot",
            confidence: "92%"
        };

        // Save to DB
        const newPrediction = new Prediction({
            image: file.path,
            disease: mockPrediction.disease,
            confidence: mockPrediction.confidence
        });

        await newPrediction.save();

        res.json({
            image: file.path,
            disease: mockPrediction.disease,
            confidence: mockPrediction.confidence
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = { upload, predictCrop };