import { Router } from "express";

import userRouter from "./userRouter.js";
import adminRouter from "./adminRouter.js";
import parkingRouter from "./parkingRouter.js";

const router = Router();

router.use(userRouter);
router.use(adminRouter);
router.use(parkingRouter);

export default router;