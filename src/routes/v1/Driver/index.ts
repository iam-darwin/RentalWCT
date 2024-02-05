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
router.get("/completedRides", authDriver, DriverRoutes.getCompletedRides);
router.get("/payments", authDriver, DriverRoutes.checkPayments);
router.get("/getDetails", authDriver, DriverRoutes.getDriverDetails);

router.post("/forgotPassword", DriverRoutes.forgotPassword);
router.get("/resetPwd/:token", resetPwdAuthGet, DriverRoutes.resetPasswordGET);
router.post("/updatePwd", resetPwdAuthPOST, DriverRoutes.resetPasswordPOST);

router.get(
  "/getAssignedUserRides",
  authDriver,
  DriverRoutes.checkAssignedUserRides
);

router.get(
  "/getCompletedUserRides",
  authDriver,
  DriverRoutes.getCompletedUserRides
);

export default router;
