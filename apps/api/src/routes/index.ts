import type { Express } from "express";
import userRouter from "./user-routes";

const mountRoutes = (app: Express): void => {
  app.use("/users", userRouter);
};

export default mountRoutes;
