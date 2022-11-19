import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import { ObjectId } from "mongoose";
import { Response, Request, NextFunction } from "express";
import { format } from "../utils/formatMessage";
import ChatEntity from "../model/Chats";

interface ChatInterface {
  fetchChats: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  addChat: (
    socket: any,
    data: any,
    myId: ObjectId,
    senderFullName: string,
    connections: any
  ) => Promise<any>;
}

class Chat implements ChatInterface {
  constructor(private readonly ChatEntity: any) {
    this.fetchChats = this.fetchChats.bind(this);
    this.addChat = this.addChat.bind(this);
  }

  public async fetchChats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const { id } = req.params;

    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }
    const { userId } = req as customRes;

    try {
      const chats = await this.ChatEntity.find({
        $or: [
          { sender: userId, reciever: id },
          { sender: id, reciever: userId },
        ],
      });
      successResponse(res, chats, 200, "Chats Fetched Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

  public async addChat(
    socket: any,
    data: any,
    myId: ObjectId,
    senderFullName: string,
    connections: any
  ): Promise<any> {
    try {
      const newMessage = await this.ChatEntity.create({
        message: data.message,
        senderName: senderFullName,
        attatchment: data.attatchment,
        sender: myId,
        reciever: data.recieverId,
      });
      if (!newMessage) {
        return socket.emit("chatError", {
          message: "could not send message",
          statuseCode: 500,
        });
      }
      socket.emit(
        "myMessage",
        format({
          message: data.message,
          chatId: newMessage._id,
          senderName: senderFullName,
          sender: myId,
          attatchment: data.attatchment,
          status: "DELIEVERED",
        })
      );
      socket.to(connections[[data.userId] as any]).emit(
        "newMessage",
        format({
          message: data.message,
          chatId: newMessage._id,
          senderName: senderFullName,
          sender: myId,
          attatchment: data.attatchment,
        })
      );
    } catch (err: any) {
      socket.emit("ChatError", { message: err.message, statusCode: 500 });
    }
  }
}

export default new Chat(ChatEntity);
