import successResponse from "../helpers/success.response";
import customError from "../helpers/customError";
import uploadPhoto from "../utils/uploadPhoto";
import { Response } from "express";
import UserEntity from "../model/User";

interface AuthInterface {
  register: () => Promise<any>;
  login: () => Promise<any>;
}

class Auth implements AuthInterface {
  constructor(private readonly entity: any) {}

  async register(): Promise<any> {}

  async login(): Promise<any> {}
}

export default new Auth(UserEntity);
