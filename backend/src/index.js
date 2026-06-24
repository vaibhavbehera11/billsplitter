require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const sessionRoutes = require("./routes/sessions");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

// Routes
app.use("/sessions", sessionRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});