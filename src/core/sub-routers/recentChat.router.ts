import { Router } from "express";
import RecentChat from "../../controllers/recentChat.controller";
import secure from "../../middlewares/secure";
const recentRouter = Router();
// make every chat route an auth required route
recentRouter.use(secure as any);
recentRouter.get("/", RecentChat.fetchRecentChats);
recentRouter.post("/", RecentChat.createRecentChat);

export default recentRouter;
