import * as bcrypt from "bcrypt";
import generateJWT from "../api/generateJWT";
import endPoint from "../config/endpoints.config";
import { Schema, model } from "mongoose";
import * as crypto from "crypto";

// import { Point } from "geoJson"

export interface CategoryInt {
  name: string;
  photo: {
    mimeType: String;
    size: String;
    url: String;
  };
}

const Category = new Schema<CategoryInt>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please include a name"],
    },
    photo: {
      mimeType: String,
      size: String,
      url: String,
    },
  },
  { timestamps: true }
);

export default model("category", Category);
