import { Router } from "express";

import userRouter from "./userRouter.js";
import adminRouter from "./adminRouter.js";
import parkingRouter from "./parkingRouter.js";
import trafficRouter from "./trafficRouter.js";

const router = Router();

router.use(userRouter);
router.use(adminRouter);
router.use(parkingRouter);
router.use(trafficRouter);

export default router;