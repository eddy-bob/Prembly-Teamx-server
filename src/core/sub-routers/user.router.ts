import { Router } from "express";
import User from "../../controllers/user.controller";
import secure from "../../middlewares/secure";
const userRouter = Router();
// make every user route an auth required route
userRouter.use(secure as any);
userRouter.get("/user-profile/:id", User.fetchProfile);
userRouter.get("/profile", User.fetchOwnProfile);
export default userRouter;
