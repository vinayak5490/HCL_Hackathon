import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "provider"], default: "patient" },
    age: { type: Number },
    weight: { type: Number },
    allergies: { type: String, default: "" },
    medications: { type: String, default: "" },
    consent: { type: Boolean, required: true, default: false },
    // If this user is a patient, they can have an assigned provider
    assignedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // If this user is a provider, they can have many assigned patients
    assignedPatients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
