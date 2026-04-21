import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Add it in backend/.env or Render environment variables.");
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch (_error) {
    return value;
  }
}

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "mini-crm-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrl: normalizeOrigin(process.env.CLIENT_URL || "http://localhost:5173"),
};
