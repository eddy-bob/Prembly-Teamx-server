import { Router } from "express";
import Chat from "../../controllers/chat.controller";
import secure from "../../middlewares/secure";
const chatRouter = Router();
// make every chat route an auth required route
chatRouter.use(secure as any);
chatRouter.get("/:id", Chat.fetchChats);

export default chatRouter;
