import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface Team extends Document {
  name: string;
  city: string;
  state: string;
  stadium: string;
  division: string;
  conference: string;
  logo: string;
  teamNeeds: {
    qb: boolean;
    rb: boolean;
    wr: boolean;
    te: boolean;
    ot: boolean;
    og: boolean;
    c: boolean;
    de: boolean;
    dt: boolean;
    lb: boolean;
    cb: boolean;
    s: boolean;
  };
  draftPicks: mongoose.Schema.Types.ObjectId[];
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  stadium: { type: String, required: true },
  division: { type: String, required: true },
  conference: { type: String, required: true },
  logo: { type: String, required: true },
  teamNeeds: {
    qb: { type: Boolean, required: true },
    rb: { type: Boolean, required: true },
    wr: { type: Boolean, required: true },
    te: { type: Boolean, required: true },
    ot: { type: Boolean, required: true },
    og: { type: Boolean, required: true },
    c: { type: Boolean, required: true },
    de: { type: Boolean, required: true },
    dt: { type: Boolean, required: true },
    lb: { type: Boolean, required: true },
    cb: { type: Boolean, required: true },
    s: { type: Boolean, required: true },
  },
  draftPicks: { type: [mongoose.Schema.Types.ObjectId], required: true },
});

export default mongoose.model<Team>("Team", TeamSchema);
