import { Router } from "express";
import Auth from "../../controllers/auth.controller";
const authRouter = Router();

authRouter.post("/sign-in", Auth.register);
authRouter.post("/sign-up", Auth.login);
export default authRouter;
