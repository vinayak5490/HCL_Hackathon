import express from "express";
import {
  listDoctors,
  createAppointment,
  listDoctorSlots,
} from "../controllers/doctorController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// GET /api/doctors/ -> list all doctors
router.get("/", listDoctors);

// GET /api/doctors/:id/slots -> list available slots for a doctor
router.get("/:id/slots", listDoctorSlots);

// POST /api/doctors/appointments -> create appointment (protected)
router.post("/appointments", auth, createAppointment);

export default router;
