import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/authRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/provider", providerRoutes);

// health
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("DB connect error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
