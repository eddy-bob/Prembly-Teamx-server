import { Schema, model } from "mongoose";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";
import endPoint from "../config/endpoints.config";
import * as otpGenerator from "otp-generator";
export interface OtpInt {
  user: any;
  otp: number;
  expires: Date;
}

const Otp = new Schema<OtpInt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide an object id"],
    },
    otp: { type: Number, select: false },
    expires: { type: Date },
  },
  { timestamps: true }
);

Otp.methods.getOtp = async function () {
  var otp = otpGenerator.generate(5, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  //   epires in 5 minutes
  this.expires = new Date(Date.now() + 5 * 60 * 1000);
  return otp;
};
export default model("Otp", Otp);
