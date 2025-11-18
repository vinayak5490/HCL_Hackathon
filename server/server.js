require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
const authRoutes = require("./routes/authRoutes");
const goalRoutes = require("./routes/goalRoutes");
const publicRoutes = require("./routes/publicRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/public", publicRoutes);

// health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB connect error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
