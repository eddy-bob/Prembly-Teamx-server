import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import uploadPhoto from "../utils/uploadPhoto";
import nodemailer from "../utils/nodeMailer";
import { Response, Request, NextFunction } from "express";
import UserEntity from "../model/User";
import OtpEntity from "../model/Otp";
import { ObjectId } from "mongoose";
import endpoint from "../config/endpoints.config";

interface AuthInterface {
  register: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  createAgent: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  login: (req: Request, res: Response, next: NextFunction) => Promise<any>;
  getOtp: (req: Request, res: Response, next: NextFunction) => Promise<any>;
}

class Auth implements AuthInterface {
  constructor(
    private readonly userEntity: any,
    private readonly otpEntity: any
  ) {}

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
    } = req.body;
    try {
      // upload picture and generate photo url
      const image = await uploadPhoto(photo);
      // create a db instance of the user
      const data = await this.userEntity.create({
        first_name,
        last_name,
        middle_name,
        phone,
        country,
        state_of_origin,
        age,
        email,

        photo: {
          mimeType: image.format,
          size: image.bytes,
          url: image.secure_url,
        },
      });
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
    } = req.body;
    try {
      // upload picture and generate photo url
      const image = await uploadPhoto(photo);
      // create a db instance of the user
      const data = await this.userEntity.create({
        first_name,
        last_name,
        middle_name,
        phone,
        country,
        state_of_origin,
        age,
        email,

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

  public async getOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // destructure body
      const { email } = req.body;

      if (!email) {
        return next(new customError(" registered email required", 400));
      }
      const user = await this.userEntity.findOne({ email });
      if (!user) {
        return next(
          new customError("User information does not exist in  database", 400)
        );
      }

      const newOtp = await this.otpEntity.create({ user: user._id });
      const generatedOtp = newOtp.getOtp();

      //----todo do send otp to email---//
      await nodemailer(
        email,
        endpoint.contactAddress,
        `here is your OTP: ${generatedOtp}`,
        "OTP"
      );
      // ---------------------------------------//
      successResponse(res, null, 200, "Otp sent to email");
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
      const { otp } = req.body;

      if (!otp) {
        return next(new customError("Otp required", 400));
      }
      const isOtp = await this.otpEntity
        .findOne({
          otp,
          $gt: { expires: new Date(Date.now()) },
        })
        .select(otp);

      if (!isOtp) {
        return next(new customError("Otp expired or does not exist", 403));
      }

      const authUser = await this.userEntity.findByIdAndUpdate(
        isOtp.user,
        { $set: { active: true } },
        { runValidators: true, new: true }
      );
      const token = await authUser.getToken();

      successResponse(res, authUser, 200, "Signin successful", token);
    } catch (err: any) {
      return next(new customError(err.message, 500));
    }
  }
}

export default new Auth(UserEntity, OtpEntity);
