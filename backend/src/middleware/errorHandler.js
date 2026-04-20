export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).json({ message });
}
