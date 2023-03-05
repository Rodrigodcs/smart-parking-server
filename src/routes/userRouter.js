import {Router} from "express";
import {userController} from "../controllers/userController.js";
import {userValidator} from "../middlewares/usersMiddleware.js"

const userRouter = Router();

userRouter.post("/signUp", userValidator.validateSignUpBody, userController.signUp);//completo
userRouter.post("/signIn", userValidator.validateSignInBody, userController.signIn);//completo
userRouter.get("/userInfo", userValidator.autenticateUser, userController.getInfo);//completo
userRouter.post("/user/reservation/:spotId", userValidator.autenticateUser, userController.makeReservation);//aberto
userRouter.post("/user/cancelReservation", userValidator.autenticateUser, userController.cancelReservation);//aberto

export default userRouter;