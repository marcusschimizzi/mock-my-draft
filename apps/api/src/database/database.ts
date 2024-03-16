import { log } from "@repo/logger";
import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    log("MONGO_URI is not defined");
    process.exit(1);
  }
  try {
    const connection = await mongoose.connect(MONGO_URI, {});
    log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    log("Database connection error", error);
    process.exit(1);
  }
};

export default connectDatabase;
