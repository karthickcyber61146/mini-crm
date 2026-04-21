import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required. Add it in backend/.env");
}

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "mini-crm-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
