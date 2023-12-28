import express from "express";
import * as DriverRoutes from "../../../controllers/driver-controller";

const router = express.Router();

router.post("/signInDriver",DriverRoutes.loginDriver);
router.get("/assignedRides",DriverRoutes.checkHisRides)
router.get('/completedRides',DriverRoutes.getCompletedRides);

export default router;