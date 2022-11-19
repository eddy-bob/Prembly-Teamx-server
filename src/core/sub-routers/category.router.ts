import { Router } from "express";
import Category from "../../controllers/category.controller";
import secure from "../../middlewares/secure";
import authorize from "../../middlewares/authorize";
const categoryRouter = Router();
// make every Category route an auth required route
// categoryRouter.use(secure as any);
categoryRouter.get("/", Category.fetchCategories);
categoryRouter.post(
  "/",
  secure as any,
  authorize(["ADMIN", "SUPER_ADMIN", "MODERATOR"]),
  Category.createCategory
);
export default categoryRouter;
