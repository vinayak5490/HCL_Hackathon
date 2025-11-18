import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";

export const listDoctors = async (req, res) => {
  try {
    const { problem, slot, city, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (problem) {
      // match tag or specialty or name case-insensitive
      filter.$or = [
        { specialty: { $regex: problem, $options: "i" } },
        { name: { $regex: problem, $options: "i" } },
        { tags: { $in: [new RegExp(problem, "i")] } },
      ];
    }

    if (city) {
      filter.city = { $regex: city, $options: "i" };
    }

    if (slot) {
      const slotDate = new Date(slot);
      if (!isNaN(slotDate.getTime())) {
        // Tolerant match: allow matching slots whose start is within +/- 15 minutes
        const tolMs = 15 * 60 * 1000;
        const startMin = new Date(slotDate.getTime() - tolMs);
        const startMax = new Date(slotDate.getTime() + tolMs);
        filter.availableSlots = {
          $elemMatch: { start: { $gte: startMin, $lte: startMax } },
        };
      }
    }

    const pageNum = Math.max(1, parseInt(page || 1, 10));
    const perPage = Math.min(100, Math.max(5, parseInt(limit || 20, 10)));

    const total = await Doctor.countDocuments(filter);
    const docs = await Doctor.find(filter)
      .sort({ name: 1 })
      .skip((pageNum - 1) * perPage)
      .limit(perPage)
      .lean();

    // add nextAvailableSlots summary (limit to 3)
    const now = new Date();
    const doctors = docs.map((d) => {
      const upcoming = (d.availableSlots || [])
        .filter((s) => new Date(s.end) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .slice(0, 3)
        .map((s) => ({
          _id: s._id,
          start: s.start,
          end: s.end,
          label: s.label,
        }));
      return {
        _id: d._id,
        name: d.name,
        specialty: d.specialty,
        clinic: d.clinic,
        city: d.city,
        phone: d.phone,
        rating: d.rating,
        experienceYears: d.experienceYears,
        photoUrl: d.photoUrl,
        bio: d.bio,
        nextAvailableSlots: upcoming,
      };
    });

    return res.json({ doctors, total, page: pageNum, limit: perPage });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// GET /api/doctors/:id/slots
export const listDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findById(id).lean();
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    // return upcoming slots only
    const now = new Date();
    const slots = (doctor.availableSlots || [])
      .filter((s) => new Date(s.end) > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start));
    return res.json({ slots });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const patientId = req.user && req.user.id;
    if (!patientId) return res.status(401).json({ message: "Unauthorized" });

    const { doctorId, slotId } = req.body;
    if (!doctorId)
      return res.status(400).json({ message: "doctorId is required" });
    if (!slotId) return res.status(400).json({ message: "slotId is required" });

    // Find doctor and slot availability
    const doctor = await Doctor.findOne({
      _id: doctorId,
      "availableSlots._id": slotId,
    });
    if (!doctor)
      return res
        .status(400)
        .json({ message: "Selected slot is not available" });

    const slot = doctor.availableSlots.id(slotId);
    if (!slot) return res.status(400).json({ message: "Slot not found" });

    const scheduledAt = slot.start;

    // Attempt to remove slot atomically
    const pullResult = await Doctor.updateOne(
      { _id: doctorId, "availableSlots._id": slotId },
      { $pull: { availableSlots: { _id: slotId } } }
    );

    if (!pullResult || pullResult.modifiedCount === 0) {
      return res
        .status(400)
        .json({ message: "Selected slot is no longer available" });
    }

    const appt = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      scheduledAt,
    });

    return res
      .status(201)
      .json({ message: "Appointment created", appointment: appt });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
