import express from "express";
import auth from "../middlewares/auth.js";
import {
  listMyAppointments,
  listProviderAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.get("/my", auth, listMyAppointments);
router.get("/provider", auth, listProviderAppointments);

export default router;
