import Goal from "../models/Goal.js";
import User from "../models/User.js";
import dayjs from "dayjs";

export const createOrUpdateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      date,
      steps = 0,
      water_ml = 0,
      sleep_hours = 0,
      notes = "",
    } = req.body;
    const goalDate = date || dayjs().format("YYYY-MM-DD");

    const payload = {
      user: userId,
      date: goalDate,
      steps,
      water_ml,
      sleep_hours,
      notes,
    };

    const goal = await Goal.findOneAndUpdate(
      { user: userId, date: goalDate },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ message: "Goal saved", goal });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const { from, to } = req.query;
    const filter = { user: userId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }
    const goals = await Goal.find(filter).sort({ date: -1 });
    return res.json({ goals });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getTodaySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = dayjs().format("YYYY-MM-DD");
    const goal = await Goal.findOne({ user: userId, date: today });
    // Simple derived fields: completion %
    const stepsTarget = 8000;
    const waterTarget = 2000; // ml
    const sleepTarget = 7; // hours

    const completion = {
      steps: goal
        ? Math.min(100, Math.round((goal.steps / stepsTarget) * 100))
        : 0,
      water: goal
        ? Math.min(100, Math.round((goal.water_ml / waterTarget) * 100))
        : 0,
      sleep: goal
        ? Math.min(100, Math.round((goal.sleep_hours / sleepTarget) * 100))
        : 0,
    };

    const tips = [
      "Drink at least 2L of water today.",
      "Try a 20 minute walk this afternoon.",
      "Aim for 7–8 hours of sleep tonight.",
    ];

    return res.json({
      date: today,
      goal,
      completion,
      tipOfTheDay: tips[today.length % tips.length],
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
