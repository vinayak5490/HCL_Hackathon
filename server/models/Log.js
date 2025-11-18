import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    action: { type: String, required: true },
    target: { type: String },
    ip: { type: String },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Log", logSchema);
