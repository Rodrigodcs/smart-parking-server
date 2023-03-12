import {Router} from "express";
import {parkingController} from "../controllers/parkingController.js";

const parkingRouter = Router();

parkingRouter.get("/parkingSpots", parkingController.getSpots);//completo
parkingRouter.post("/esp/leds", parkingController.ledStatus);//rever
parkingRouter.post("/esp/sensors", parkingController.sensorsStatus);//rever

export default parkingRouter;