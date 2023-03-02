import {Router} from "express";
import {adminController} from "../controllers/adminController.js";
import {adminValidator} from "../middlewares/adminMiddleware.js"

const adminRouter = Router();

adminRouter.post("/admin/signIn", adminValidator.validateSignInBody, adminController.signIn)

export default adminRouter;