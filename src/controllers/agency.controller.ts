import successResponse from "../helpers/success.response";
import uploadPhoto from "../utils/uploadPhoto";
import customError from "../helpers/customError";

import { Response, Request, NextFunction, query } from "express";

import AgencyEntity from "../model/Agency";
import CategoryEntity from "../model/Category";

interface AgencyInterface {
  fetchAgencies: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  createAgency: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
}

class Agency implements AgencyInterface {
  constructor(
    private readonly AgencyEntity: any,
    private readonly CategoryEntity: any
  ) {
    this.fetchAgencies = this.fetchAgencies.bind(this);
    this.createAgency = this.createAgency.bind(this);
  }

  public async fetchAgencies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const categories = await this.AgencyEntity.find(req.query);
      successResponse(res, categories, 200, "Agencies Fetched Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

  public async createAgency(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    let image: any;
    const {photo}=req.body
    try {
      // look up category
      const isCategory = await this.CategoryEntity.findById(req.body.category);
      if (!isCategory) {
        return next(new customError("Category does not exist", 404));
      }

      // upload picture and generate photo url
      if (photo) {
        image = await uploadPhoto(photo, next);
      }

      const Agency = await this.AgencyEntity.create({
        name: req.body.name,
        category: isCategory._id,
        photo: {
          mimeType: image.format,
          size: image.bytes,
          url: image.secure_url,
        },
      });

      await Agency.save();
      successResponse(res, Agency, 200, "Agency created Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
}

export default new Agency(AgencyEntity, CategoryEntity);
