import express from "express";
import * as DriverRoutes from "../../../controllers/driver-controller";

const router = express.Router();

router.post("/signInDriver",DriverRoutes.loginDriver);
router.get("/assignedRides",DriverRoutes.checkHisRides);
router.get('/completedRides/:driverId',DriverRoutes.getCompletedRides);
router.get("/payments/:driverId",DriverRoutes.checkPayments);
router.get("/getDetails/:driverId",DriverRoutes.getDriverDetails);

export default router;