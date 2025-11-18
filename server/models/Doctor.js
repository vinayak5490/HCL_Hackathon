import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, default: "" },
  clinic: { type: String, default: "" },
  city: { type: String, default: "" },
  phone: { type: String, default: "" },
  tags: { type: [String], default: [] },
  // availableSlots: array of { start: Date, end: Date, label?: String }
  availableSlots: [
    {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
      label: { type: String, default: "" },
    },
  ],
  // Professional info
  rating: { type: Number, default: 4.5 },
  experienceYears: { type: Number, default: 5 },
  photoUrl: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Doctor", doctorSchema);
