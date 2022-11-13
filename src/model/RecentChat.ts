import { Schema, model } from "mongoose";
import genFullName from "../utils/genFullName";
import { NextFunction } from "express";
export interface RecentInt {
  sender: any;
  receiver: any;
  receiver_name: string;
}
const RecentChat = new Schema<RecentInt>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "please provide a sender"],
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "please provide a receiver "],
    },
    receiver_name: {
      type: String,
    },
  },
  { timestamps: true }
);

RecentChat.post("save", async function (this: any, next: NextFunction) {
  let response = await genFullName(this.receiver);
  this.receiver_name = response as string;
  next();
});
export default model("RecentChat", RecentChat);
