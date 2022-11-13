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
  password: string;
  resetPasswordToken: string;
  resetPasswordExpire: Date;
  active: boolean;
  role: string;
  photo: {
    mimeType: String;
    size: String;
    url: String;
  };
  hashPassword: () => Promise<void>;
  getToken: () => Promise<string>;
  genResetPasswordToken: () => Promise<string>;
  comparePassword: (oldPassword: string) => Promise<boolean>;
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
      required: [true, "please include a country"],
    },
    age: {
      type: Number,
      trim: true,
      required: [true, "please include an age"],
    },

    middle_name: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      required: [true, "please include a password"],
      min: [6, "password can not be less than 6 characters"],
    },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

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

User.methods.hashPassword = async function () {
  const saltRounds = endPoint.bycriptHashRound;
  const hashPassword = bcrypt.hashSync(this.password, 10);
  this.password = hashPassword;
};
User.methods.comparePassword = async function (oldPassword: string) {
  return bcrypt.compareSync(oldPassword, this.password);
};
User.methods.genResetPasswordToken = async function () {
  let hashToken;
  var token = crypto.randomBytes(20).toString("hex");
  hashToken = crypto.createHash("sha256").update(token).digest("hex");
  // set expiry date
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  this.resetPasswordToken = hashToken;
  return hashToken;
};

User.methods.getToken = async function () {
  var token = generateJWT({ id: this._id });

  return token;
};

export default model("user", User);
