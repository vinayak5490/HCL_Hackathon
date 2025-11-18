import express from "express";
import {
  register,
  login,
  updateProfile,
} from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Basic routes — validation removed (Zod) per project preference.
router.post("/register", register);
router.post("/login", login);

// Protected profile update
router.put("/profile", auth, updateProfile);

export default router;
