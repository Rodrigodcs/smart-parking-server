import {Router} from "express";
import {parkingController} from "../controllers/parkingController.js";

const parkingRouter = Router();

parkingRouter.get("/parkingSpots", parkingController.getSpots)

export default parkingRouter;