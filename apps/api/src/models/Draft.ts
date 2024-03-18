import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IDraft extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  picks: mongoose.Schema.Types.ObjectId[];
  creationDate: Date;
  draftType: string;
  title: string;
  description: string;
}

const DraftSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  picks: { type: [mongoose.Schema.Types.ObjectId], required: true },
  creationDate: { type: Date, required: true },
  draftType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model<IDraft>("Draft", DraftSchema);
