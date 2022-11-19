import { Request, Response, NextFunction } from "express";
import customError from "../helpers/customError";

import validateXToken from "../api/validateXToken";

// declare middleware
const agentSecure = async (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.headers.api_x_key === "undefined" ||
    req.headers.api_x_key == null
  ) {
    return next(new customError("No api key provided", 403));
  }

  const token: string = req.headers.api_x_key as string;
  const response =validateXToken(token);

  if (response == false) {
    return next(
      new customError("You are not authorized to access this route", 403)
    );
  }
  next();
};
export default agentSecure;
