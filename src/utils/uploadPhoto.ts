const cloudinary = require("cloudinary").v2;

import { NextFunction } from "express";
import endPoint from "../config/endpoints.config";
import customError from "../helpers/customError";
const uploadPhoto: (photo: Buffer, next: NextFunction) => Promise<any> = async (
  photo: Buffer
) => {
  cloudinary.config({
    cloud_name: endPoint.cloudName,
    api_key: endPoint.cloudApiKey,
    api_secret: endPoint.cloudApiSecret,
    secure: true,
  });
  try {
    const image = await cloudinary.uploader.upload(photo);

    return image;
  } catch (err: any) {
    return next(new customError(err.message, err.status));
  }
};
export default uploadPhoto;
