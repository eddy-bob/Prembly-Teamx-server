import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import { Response, Request, NextFunction } from "express";

import RecentChatEntity from "../model/RecentChat";
import { ObjectId } from "mongoose";

interface RecentChatInterface {
  fetchRecentChats: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  createRecentChat: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
}

class RecentChat implements RecentChatInterface {
  constructor(private readonly RecentChatEntity: any) {}

  public async createRecentChat(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }

    const { userId } = req as customRes;

    try {
      // delete existing record of chat history
      await this.RecentChatEntity.deleteMany([
        {
          sender: userId,
          receiver: req.body.receiver,
        },
        {
          receiver: userId,
          sender: req.body.reveiver,
        },
      ]);

      const chats = await this.RecentChatEntity.insertMany([
        {
          sender: userId,
          receiver: req.body.receiver,
        },
        {
          sender: req.body.receiver,
          receiver: userId,
        },
      ]);
      await chats.save();

      const recentChats = await this.RecentChatEntity.find({
        sender: userId,
      }).sort({ createdAt: -1 });
      return successResponse(
        res,
        recentChats,
        200,
        "Recent chats created successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

  public async fetchRecentChats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    interface customRes extends Request {
      userId: ObjectId;
      userData: any;
      userRole: string;
    }

    const { userId } = req as customRes;
    try {
      const chats = await this.RecentChatEntity.find({ owner: userId }).sort({
        createdAt: -1,
      });
      return successResponse(
        res,
        chats,
        200,
        "Recent chats fetched successfully"
      );
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
}

export default new RecentChat(RecentChatEntity);
