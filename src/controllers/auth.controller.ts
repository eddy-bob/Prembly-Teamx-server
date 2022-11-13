import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import uploadPhoto from "../utils/uploadPhoto";
import { Response, Request, NextFunction } from "express";

import UserEntity from "../model/User";

interface AuthInterface {
  register: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  createAgent: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

class Auth implements AuthInterface {
  constructor(private readonly entity: any) {}

  public async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    // destructure body
    const {
      photo,
      first_name,
      last_name,
      middle_name,
      phone,
      country,
      state_of_origin,
      age,
      email,
      password,
    } = req.body;
    try {
      // upload picture and generate photo url
      const image = await uploadPhoto(photo);
      // create a db instance of the user
      const data = await this.entity.create({
        first_name,
        last_name,
        middle_name,
        phone,
        country,
        state_of_origin,
        age,
        email,
        password,
        photo: {
          mimeType: image.format,
          size: image.bytes,
          url: image.secure_url,
        },
      });

      // hashpassword
      await data.hashPassword();
      await data.save();

      successResponse(res, data, 201, "User account created successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async createAgent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    // destructure body
    const {
      photo,
      first_name,
      last_name,
      middle_name,
      phone,
      country,
      state_of_origin,
      age,
      email,
      password,
    } = req.body;
    try {
      // upload picture and generate photo url
      const image = await uploadPhoto(photo);
      // create a db instance of the user
      const data = await this.entity.create({
        first_name,
        last_name,
        middle_name,
        phone,
        country,
        state_of_origin,
        age,
        email,
        password,
        role: "CUSTOMER_ASSISTANT",
        photo: {
          mimeType: image.format,
          size: image.bytes,
          url: image.secure_url,
        },
      });

      // hashpassword
      await data.hashPassword();
      await data.save();

      successResponse(res, data, 201, "Agent account created successfully");
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // destructure body
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new customError("Email and Password required", 400));
      }
      const user = await this.entity.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new customError(
            "User information does not exist in our database",
            400
          )
        );
      }
      const isAuth = await user.comparePassword(password);

      if (isAuth == true) {
        const authUser = await this.entity.findByIdAndUpdate(
          user._id,
          { $set: { active: true } },
          { runValidators: true, new: true }
        );
        const token = await authUser.getToken();

        successResponse(res, authUser, 200, "Signin successful", token);
      } else {
        return next(
          new customError("Sorry Email and Password did not work", 401)
        );
      }
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
}

export default new Auth(UserEntity);
