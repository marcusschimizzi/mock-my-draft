import type { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";

interface IPlayer extends Document {
  name: string;
  age: number;
  college: string;
  position: string;
  heightFeet: number;
  heightInches: number;
  weightPounds: number;
  class: string;
  combineResults: {
    fortyYardDash: number;
    benchPress: number;
    verticalJump: number;
    broadJump: number;
    threeConeDrill: number;
    shuttleRun: number;
  };
}

const PlayerSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  college: { type: String, required: true },
  position: { type: String, required: true },
  heightFeet: { type: Number, required: true },
  heightInches: { type: Number, required: true },
  weightPounds: { type: Number, required: true },
  class: { type: String, required: true },
  combineResults: {
    fortyYardDash: { type: Number, required: true },
    benchPress: { type: Number, required: true },
    verticalJump: { type: Number, required: true },
    broadJump: { type: Number, required: true },
    threeConeDrill: { type: Number, required: true },
    shuttleRun: { type: Number, required: true },
  },
});

export default mongoose.model<IPlayer>("Player", PlayerSchema);
