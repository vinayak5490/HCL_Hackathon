import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      weight,
      allergies,
      medications,
      consent,
    } = req.body;

    if (!consent)
      return res.status(400).json({ message: "Consent is required" });
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const { role = "patient", assignedProvider } = req.body;

    const userData = {
      name,
      email,
      password: hashed,
      age,
      weight,
      allergies,
      medications,
      consent,
      role,
    };

    if (role === "patient" && assignedProvider)
      userData.assignedProvider = assignedProvider;

    const user = await User.create(userData);

    // if creating a patient and assignedProvider provided, add to provider.assignedPatients
    if (role === "patient" && assignedProvider) {
      await User.findByIdAndUpdate(assignedProvider, {
        $addToSet: { assignedPatients: user._id },
      });
    }

    return res.status(201).json({
      message: "User registered",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing credentials" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const updatable = [
      "name",
      "age",
      "weight",
      "allergies",
      "medications",
      "consent",
    ];
    const updates = {};
    updatable.forEach((k) => {
      if (k in req.body) updates[k] = req.body[k];
    });

    // Prevent email/role/password changes here
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        weight: user.weight,
        allergies: user.allergies,
        medications: user.medications,
        consent: user.consent,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
