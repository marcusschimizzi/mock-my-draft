import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface DraftPick extends Document {
  draftId: mongoose.Schema.Types.ObjectId;
  playerId: mongoose.Schema.Types.ObjectId;
  teamId: mongoose.Schema.Types.ObjectId;
  round: number;
  pickNumber: number;
}

const DraftPickSchema: Schema = new Schema({
  draftId: { type: mongoose.Schema.Types.ObjectId, required: true },
  playerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, required: true },
  round: { type: Number, required: true },
  pickNumber: { type: Number, required: true },
});

export default mongoose.model<DraftPick>("DraftPick", DraftPickSchema);
