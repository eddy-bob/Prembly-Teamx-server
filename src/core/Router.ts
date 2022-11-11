import { Router } from "express";
import authRouter from "./sub-routers/auth-router";
import userRouter from "./sub-routers/user-router";
const useRouter = Router();
useRouter.use("/auth", authRouter);
useRouter.use("/auth", userRouter);
export default useRouter;
