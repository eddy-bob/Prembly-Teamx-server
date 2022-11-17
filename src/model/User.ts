import * as bcrypt from "bcrypt";
import generateJWT from "../api/generateJWT";
import endPoint from "../config/endpoints.config";
import { Schema, model } from "mongoose";
import * as crypto from "crypto";

// import { Point } from "geoJson"

// define enum
enum UserEnum {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER = "SUPER_ADMIN",
  ASSISTANT = "CUSTOMER_ASSISTANT",
  MODERATOR = "MODERATOR",
}

export interface UserInt {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: number;
  country: string;
  state_of_origin: string;
  age: number;
  email: string;
  active: boolean;
  role: string;
  photo: {
    mimeType: String;
    size: String;
    url: String;
  };

  getToken: () => Promise<string>;
  matchOtp: (oldPassword: string) => Promise<boolean>;
}

const User = new Schema<UserInt>(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "please include a first name"],
    },

    last_name: {
      type: String,
      trim: true,
      required: [true, "please include a last name"],
    },
    state_of_origin: {
      type: String,
      trim: true,
      required: [true, "please include a state of origin"],
    },

    phone: {
      type: Number,
      trim: true,
      required: [true, "please include a phone number"],
    },
    country: {
      type: String,
      trim: true,
      default: "Nigeria",
    },
    age: {
      type: Number,
      trim: true
    },

    middle_name: {
      type: String,
      trim: true,
    },

    email: {
      required: [true, "please include an email"],
      type: String,
      unique: true,
      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please add a valid email",
      ],
    },

    active: { type: Boolean, default: false },

    role: {
      required: true,
      type: String,
      enum: UserEnum,
      default: "USER",
    },

    photo: {
      mimeType: String,
      size: String,
      url: String,
    },
  },
  { timestamps: true }
);

User.methods.getToken = async function () {
  var token = generateJWT({ id: this._id });

  return token;
};

export default model("user", User);
