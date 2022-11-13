import successResponse from "../helpers/success.response";
import uploadPhoto from "../utils/uploadPhoto";
import customError from "../helpers/customError";
import { ObjectId } from "mongoose";
import { Response, Request, NextFunction } from "express";

import CategoryEntity from "../model/Category";

interface CategoryInterface {
  fetchCategories: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  createCategory: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
}

class Category implements CategoryInterface {
  constructor(private readonly CategoryEntity: any) {}

  public async fetchCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const categories = await this.CategoryEntity.find();
      successResponse(res, categories, 200, "Categories Fetched Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }

  public async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      var image: any;
      // upload picture and generate photo url
      if (req.body.photo) {
        image = await uploadPhoto(req.body.photo);
      }

      const category = await this.CategoryEntity.create({
        name: req.body.name,
        photo: {
          mimeType: image.format,
          size: image.bytes,
          url: image.secure_url,
        },
      });
      await category.save();
      successResponse(res, category, 200, "Category created Successfully");
    } catch (err: any) {
      next(new customError(err.message, 500));
    }
  }
}

export default new Category(CategoryEntity);
