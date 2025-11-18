import express from "express";
import auth from "../middlewares/auth.js";
import requireRole from "../middlewares/requireRole.js";
import {
  listAssignedPatients,
  getPatientDetail,
  getPatientGoals,
} from "../controllers/providerController.js";

const router = express.Router();

// Provider-only routes
router.get("/patients", auth, requireRole("provider"), listAssignedPatients);
router.get("/patients/:id", auth, requireRole("provider"), getPatientDetail);
router.get(
  "/patients/:id/goals",
  auth,
  requireRole("provider"),
  getPatientGoals
);

export default router;
