import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";

// GET /api/appointments/my -> list appointments for the authenticated user (patient)
export const listMyAppointments = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const appts = await Appointment.find({ patient: userId })
      .populate("doctor", "name specialty clinic city phone photoUrl")
      .sort({ scheduledAt: 1 })
      .lean();

    return res.json({ appointments: appts });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET /api/appointments/provider -> list appointments for provider's patients (if provider has id)
export const listProviderAppointments = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    // require provider role
    if (user.role !== "provider")
      return res.status(403).json({ message: "Forbidden" });

    // find appointments where doctor is any doctor assigned to this provider (optional); for now return all appointments
    const appts = await Appointment.find()
      .populate("doctor", "name specialty clinic city")
      .populate("patient", "name age")
      .sort({ scheduledAt: 1 })
      .lean();

    return res.json({ appointments: appts });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
