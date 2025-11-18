// Validation middleware placeholder — Zod removed per project preference.
// This middleware intentionally performs no validation and simply forwards the request.
module.exports =
  (schema, where = "body") =>
  (req, res, next) =>
    next();
