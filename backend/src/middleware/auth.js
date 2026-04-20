import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { User } from "../models/User.js";

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Authentication required"));
    return;
  }

  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      next(new AppError(401, "User no longer exists"));
      return;
    }

    req.user = user;
    next();
  } catch (_error) {
    next(new AppError(401, "Invalid or expired token"));
  }
}
