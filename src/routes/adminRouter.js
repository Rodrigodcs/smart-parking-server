import {Router} from "express";
import {adminController} from "../controllers/adminController.js";
import {adminValidator} from "../middlewares/adminMiddleware.js"
import { tagValidator } from "../middlewares/tagMiddleware.js";

const adminRouter = Router();

adminRouter.post("/admin/signIn", adminValidator.validateSignInBody, adminController.signIn);//completo

adminRouter.get("/admin/tagRegistration", adminValidator.validateTagRegistrationBody, adminValidator.autenticateAdmin, adminController.tagRegistration);//completo

adminRouter.get("/admin/tagReader", adminValidator.autenticateAdmin, adminController.tagReader);//completo
adminRouter.get("/admin/userInfo", adminValidator.autenticateAdmin, adminController.getUserInfo);//completo

adminRouter.post("/admin/esp/tag", tagValidator.tagValidatorSchema, adminController.tagReceived);//completo

adminRouter.post("/admin/databaseReset", adminController.resetDatabase);//completo

adminRouter.post("/admin/user/addCredits", adminValidator.validateAddCreditsBody, adminValidator.autenticateAdmin, adminController.addCredits);//completo

export default adminRouter;