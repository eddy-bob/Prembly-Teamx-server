import { Router } from "express";
import Auth from "../../controllers/auth.controller";
import secureAgent from "../../middlewares/agentSecure";
const authRouter = Router();

authRouter.post("/sign-up", Auth.register);
authRouter.post("/get-otp", Auth.getOtp);
authRouter.post("/sign-in", Auth.login);
authRouter.post("/create-agent", secureAgent, Auth.createAgent);
export default authRouter;
