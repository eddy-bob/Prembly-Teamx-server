import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import { ObjectId } from "mongoose";
import { Response, Request, NextFunction } from "express";
import UserEntity from "../model/User";

interface UserInterface {
  fetchOwnProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  fetchProfile: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
}

class User implements UserInterface {
  constructor(private readonly userEntity: any) {}

  public async fetchOwnProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      interface customResponse extends Request {
        userId: ObjectId;
        userData: any;
        userRole: string;
      }

      const { userId, userData } = req as customResponse;

      successResponse(res, userData, 200, "Profile Fetched Successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async fetchProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;

      const user = await this.userEntity.findById(id);
      if (user) {
        successResponse(res, user, 200, "User Fetched Successfully");
      } else {
        return next(new customError("User not found or disabled", 404));
      }
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
}

export default new User(UserEntity);
