import {Router} from "express";
import {parkingController} from "../controllers/parkingController.js";

const parkingRouter = Router();

parkingRouter.get("/parkingSpots", parkingController.getSpots)
parkingRouter.get("/esp/parkingSpots", parkingController.getSpotsEsp)
parkingRouter.post("/esp/parkingSpots", parkingController.saveSpotsEsp)

export default parkingRouter;