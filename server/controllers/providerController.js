import User from "../models/User.js";
import Log from "../models/Log.js";
import Goal from "../models/Goal.js";
import dayjs from "dayjs";

export const listAssignedPatients = async (req, res) => {
  try {
    const providerId = req.user.id;
    // find users who have assignedProvider == providerId
    // pagination
    const page = parseInt(req.query.page || "1");
    const limit = Math.min(parseInt(req.query.limit || "20"), 100);
    const skip = (page - 1) * limit;

    const filter = { assignedProvider: providerId };
    const total = await User.countDocuments(filter);
    const patients = await User.find(filter)
      .select("name email age weight consent")
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    // compute simple compliance status for each patient based on their latest goal
    const enhancedPatients = await Promise.all(
      patients.map(async (p) => {
        const latest = await Goal.findOne({ user: p._id })
          .sort({ date: -1 })
          .lean();
        let complianceStatus = "No Data";
        let latestDate = null;
        let completion = null;
        if (!latest) {
          complianceStatus = "Missed Preventive Checkup";
        } else {
          latestDate = latest.date;
          const stepsTarget = 8000;
          const waterTarget = 2000;
          const sleepTarget = 7;

          const stepsPct = latest.steps
            ? Math.min(100, Math.round((latest.steps / stepsTarget) * 100))
            : 0;
          const waterPct = latest.water_ml
            ? Math.min(100, Math.round((latest.water_ml / waterTarget) * 100))
            : 0;
          const sleepPct = latest.sleep_hours
            ? Math.min(
                100,
                Math.round((latest.sleep_hours / sleepTarget) * 100)
              )
            : 0;
          completion = { stepsPct, waterPct, sleepPct };

          const daysAgo = dayjs().diff(dayjs(latest.date), "day");
          if (daysAgo > 7) {
            complianceStatus = "Missed Preventive Checkup";
          } else if (stepsPct >= 80 && waterPct >= 80 && sleepPct >= 80) {
            complianceStatus = "Goal Met";
          } else if (stepsPct >= 50 || waterPct >= 50 || sleepPct >= 50) {
            complianceStatus = "Partial";
          } else {
            complianceStatus = "At Risk";
          }
        }

        const obj = p.toObject ? p.toObject() : p;
        obj.complianceStatus = complianceStatus;
        obj.latestGoalDate = latestDate;
        obj.completion = completion;
        return obj;
      })
    );

    // audit log
    await Log.create({
      user: providerId,
      action: "list_assigned_patients",
      target: providerId,
      ip: req.ip,
      meta: { page, limit },
    });

    return res.json({ patients: enhancedPatients, page, limit, total });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getPatientDetail = async (req, res) => {
  try {
    const providerId = req.user.id;
    const patientId = req.params.id;

    const patient = await User.findOne({
      _id: patientId,
      assignedProvider: providerId,
    }).select("-password");
    if (!patient)
      return res
        .status(404)
        .json({ message: "Patient not found or not assigned to you" });

    await Log.create({
      user: providerId,
      action: "view_patient",
      target: patientId,
      ip: req.ip,
    });

    return res.json({ patient });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const getPatientGoals = async (req, res) => {
  try {
    const providerId = req.user.id;
    const patientId = req.params.id;

    // ensure the patient is assigned to this provider
    const patient = await User.findOne({
      _id: patientId,
      assignedProvider: providerId,
    });
    if (!patient)
      return res
        .status(404)
        .json({ message: "Patient not found or not assigned to you" });

    // fetch goals for the patient (recent)
    const from = req.query.from;
    const to = req.query.to;
    const filter = { user: patientId };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const goals = await Goal.find(filter).sort({ date: -1 }).limit(90);

    await Log.create({
      user: providerId,
      action: "view_patient_goals",
      target: patientId,
      ip: req.ip,
    });

    return res.json({
      patient: { id: patient._id, name: patient.name, email: patient.email },
      goals,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
