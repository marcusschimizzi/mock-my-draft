import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  registrationDate: Date;
  lastLogin: Date;
  profilePicture: string;
  preferences: {
    darkMode: boolean;
    notifications: boolean;
    favoriteTeam: string;
  };
  tokens: string[];
  isActive: boolean;
  isVerified: boolean;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  registrationDate: { type: Date, required: true },
  lastLogin: { type: Date, required: true },
  profilePicture: { type: String, required: true },
  preferences: {
    darkMode: { type: Boolean, required: true },
    notifications: { type: Boolean, required: true },
    favoriteTeam: { type: String, required: true },
  },
  tokens: [{ type: String, required: true }],
  isActive: { type: Boolean, required: true },
  isVerified: { type: Boolean, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
