import {Router} from "express";
import {trafficController} from "../controllers/trafficController.js";
import {trafficValidator} from "../middlewares/trafficMiddleware.js"

const trafficRouter = Router();

trafficRouter.post("/esp/checkIn",trafficValidator.tagValidator,trafficController.checkIn)

export default trafficRouter;