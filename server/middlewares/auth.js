import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "No authorization header" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid header format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user id and role (if present) to request
    req.user = { id: decoded.id, role: decoded.role || "patient" };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
