const express = require("express");
const router = express.Router();

router.get("/info", (req, res) => {
  res.json({
    title: "Public Health Info",
    content:
      "Preventive care: annual blood tests, vaccinations, dental checkups. Stay hydrated, move daily, sleep well. This app is for wellness tracking and reminders.",
  });
});

module.exports = router;
