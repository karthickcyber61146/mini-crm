import { AppError } from "../lib/errors.js";
import { signAccessToken } from "../lib/token.js";
import { User } from "../models/User.js";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signAccessToken({ userId: user._id.toString() });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
