import {Router} from "express";
import {userController} from "../controllers/userController.js";
import {userValidator} from "../middlewares/usersMiddleware.js"

const userRouter = Router();

userRouter.post("/signUp", userValidator.validateSignUpBody, userController.signUp);
userRouter.post("/signIn", userValidator.validateSignInBody, userController.signIn)

export default userRouter;