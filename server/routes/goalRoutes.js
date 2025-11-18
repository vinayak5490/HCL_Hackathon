const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createOrUpdateGoal,
  getGoals,
  getTodaySummary,
} = require("../controllers/goalController");

router.post("/", auth, createOrUpdateGoal); // create/update goal
router.get("/", auth, getGoals); // fetch goals
router.get("/today", auth, getTodaySummary); // small summary & tip

module.exports = router;
