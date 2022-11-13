import { Schema, model } from "mongoose";

export interface AgencyInt {
  name: string;
  category: any;
  photo: {
    mimeType: String;
    size: String;
    url: String;
  };
}

const User = new Schema<AgencyInt>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please include an agency name"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "category",
      required: [true, "please include a category"],
    },
    photo: {
      mimeType: String,
      size: String,
      url: String,
    },
  },
  { timestamps: true }
);

export default model("agency", User);
