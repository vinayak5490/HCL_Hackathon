import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  steps: { type: Number, default: 0 },
  water_ml: { type: Number, default: 0 },
  sleep_hours: { type: Number, default: 0 },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

goalSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("Goal", goalSchema);
