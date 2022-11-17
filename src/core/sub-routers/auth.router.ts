import { Router } from "express";
import Auth from "../../controllers/auth.controller";
import secureAgent from "../../middlewares/agentSecure";
const authRouter = Router();

authRouter.post("/sign-in", Auth.register);
authRouter.post("/get-otp", Auth.login);
authRouter.post("/sign-up", Auth.login);
authRouter.post("/create-agent", secureAgent, Auth.createAgent);
export default authRouter;
