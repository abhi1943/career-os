import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CareerOS Job Server is running 🚀",
  });
});

// Test jobs route
app.get("/api/jobs", (req, res) => {
  res.json({
    success: true,
    jobs: [],
    message: "Jobs API is working",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CareerOS Job Server running on http://localhost:${PORT}`);
});