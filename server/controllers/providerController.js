import User from "../models/User.js";
import Log from "../models/Log.js";
import Goal from "../models/Goal.js";

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

    // audit log
    await Log.create({
      user: providerId,
      action: "list_assigned_patients",
      target: providerId,
      ip: req.ip,
      meta: { page, limit },
    });

    return res.json({ patients, page, limit, total });
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
