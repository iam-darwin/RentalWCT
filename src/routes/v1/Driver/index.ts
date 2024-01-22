import express from "express";
import * as DriverRoutes from "../../../controllers/driver-controller";
import {
  authDriver,
  resetPwdAuthGet,
  resetPwdAuthPOST,
} from "../../../middlewares/Auth";

const router = express.Router();

router.post("/signIn", DriverRoutes.loginDriver);
router.get("/assignedRides", authDriver, DriverRoutes.checkHisRides);
router.get(
  "/completedRides/:driverId",
  authDriver,
  DriverRoutes.getCompletedRides
);
router.get("/payments/:driverId", authDriver, DriverRoutes.checkPayments);
router.get("/getDetails/:driverId", authDriver, DriverRoutes.getDriverDetails);

router.post("/forgotPassword", DriverRoutes.forgotPassword);
router.get("/resetPwd/:token", resetPwdAuthGet, DriverRoutes.resetPasswordGET);
router.post("/updatePwd", resetPwdAuthPOST, DriverRoutes.resetPasswordPOST);

export default router;
