import { hash } from "bcryptjs";
import type { Request, Response } from "express";
import User from "../models/User";

interface RequestBody {
  email: string;
  password: string;
}

const registerUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as RequestBody;
  if (!email || !password) {
    return res.status(400).json({ message: "Invalid request" });
  }

  /** Check if user already exists */
  try {
    const existing = await User.findOne({
      email,
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  try {
    const hashedPassword = await hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { registerUser };
