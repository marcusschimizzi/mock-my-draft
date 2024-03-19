import { Router } from "express";

const userRouter = Router();

userRouter.post("/register", (req, res) => {
  return res.json({ message: "register" });
});

export default userRouter;
