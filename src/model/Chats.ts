const { Schema, model } = require("mongoose");
// define enum
enum Status {
  DELIVERED = "DELIVERED",
  READ = "READ",
}
const Chat = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a sender"],
    },
    senderName: {
      type: String,
      required: [true, "please include a  sender name"],
    },
    recieverName: {
      type: String,
      required: [true, "please include a  sender name"],
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a reciever"],
    },
    message: {
      type: String,
      trim: true,
      required: [true, "please include a  message"],
    },
    attatchment: {
      type: [String],
      default: [],
    },

    status: { type: String, enum: Status, default: "DELIVERED" },
  },
  { timestamps: true }
);

export default model("chat", Chat);
