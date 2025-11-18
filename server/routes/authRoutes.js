import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Basic routes — validation removed (Zod) per project preference.
router.post("/register", register);
router.post("/login", login);

export default router;
