import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { User } from "../models/User.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const users = await User.find().select("name email").sort({ name: 1 });
    res.json(users);
  })
);

export default router;
