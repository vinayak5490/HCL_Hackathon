const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ message: "No authorization header" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid header format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
