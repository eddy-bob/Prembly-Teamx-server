import { Router } from "express";
import Agency from "../../controllers/agency.controller";
import secure from "../../middlewares/secure";
import authorize from "../../middlewares/authorize";
const agencyRouter = Router();
// make every Category route an auth required route
agencyRouter.use(secure as any);
agencyRouter.get("/", Agency.fetchAgencies);
agencyRouter.post(
  "/",
  authorize(["ADMIN", "SUPER_ADMIN", "MODERATOR"]),
  Agency.createAgency
);
export default agencyRouter;
