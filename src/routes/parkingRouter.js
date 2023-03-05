import {Router} from "express";
import {parkingController} from "../controllers/parkingController.js";

const parkingRouter = Router();

parkingRouter.get("/parkingSpots", parkingController.getSpots);//completo
parkingRouter.get("/esp/parkingSpots", parkingController.getSpotsEsp);//rever
parkingRouter.post("/esp/parkingSpots", parkingController.saveSpotsEsp);//rever

export default parkingRouter;