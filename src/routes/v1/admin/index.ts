import express from "express";
import * as adminControllers from "../../../controllers/admin-controller";
import {
  superAdminAuth,
  authAdmin,
  resetPwdAuthGet,
  resetPwdAuthPOST,
} from "../../../middlewares";
import { upload } from "../../../utils/helper";

const router = express.Router();

router.post("/signUp", adminControllers.registerAdmin);
router.post("/signIn", adminControllers.loginAdmin);

router.post("/addDriver", authAdmin, adminControllers.createDriver);
router.get("/drivers", authAdmin, adminControllers.getDrivers);
router.get("/driver/:driverId", authAdmin, adminControllers.getDriverById);
router.get("/activeDrivers", authAdmin, adminControllers.getActiveDrivers);
router.post(
  "/updateDriverDetails/:driverId",
  authAdmin,
  adminControllers.updateDrivedetails
);

router.post(
  "/fileUpload",
  authAdmin,
  upload.single("csvFile"),
  adminControllers.fileUpload
);

router.get("/unAssignedRides", authAdmin, adminControllers.getUnAssignedRides);
router.post("/assignRide", authAdmin, adminControllers.assignRideToDriver);
router.get("/assignedRides", authAdmin, adminControllers.getAssignedRides);
router.post(
  "/updateAssignRides",
  authAdmin,
  adminControllers.updateAssignedRides
);
router.post(
  "/updateRideAsCompleted",
  authAdmin,
  adminControllers.updateRideAsCompleted
);
router.get("/completedRides", authAdmin, adminControllers.getCompletedRides);
router.get("/cancelledRides", authAdmin, adminControllers.getCancelledRides);

router.post("/forgotPassword", adminControllers.forgotPassword);

router.get(
  "/resetPwd/:token",
  resetPwdAuthGet,
  adminControllers.resetPasswordGET
); //SSR
router.post("/updatePwd", resetPwdAuthPOST, adminControllers.resetPasswordPOST); //SSR

router.post(
  "/addAdmin",
  authAdmin,
  superAdminAuth,
  adminControllers.registerAdmin
);
router.get("/admins", authAdmin, adminControllers.getAllAdmins);
router.post(
  "/updateAdmin",
  authAdmin,
  superAdminAuth,
  adminControllers.updateAdmin
);
router.post(
  "/removeAdmin",
  authAdmin,
  superAdminAuth,
  adminControllers.deleteAdmin
);

router.post(
  "/createPayment",
  authAdmin,
  superAdminAuth,
  adminControllers.createPayment
);
router.get(
  "/getAllPayments",
  authAdmin,
  superAdminAuth,
  adminControllers.getAllPayments
);
router.get(
  "/payment/:driverId",
  authAdmin,
  superAdminAuth,
  adminControllers.getPaymentByDriverId
);
router.post(
  "/payments/:paymentId",
  authAdmin,
  superAdminAuth,
  adminControllers.updatePayments
);

//to Check form details
router.get(
  "/getFormDetailsNotContacted",
  authAdmin,
  superAdminAuth,
  adminControllers.getAllFormDataOfUnchecked
);
router.get(
  "/getFormDetailsContacted",
  authAdmin,
  superAdminAuth,
  adminControllers.getFormDataChecked
);
router.post(
  "/updateFormContact/:contactId",
  authAdmin,
  superAdminAuth,
  adminControllers.updateFormContacted
);

//add user rides

router.post("/addUserRide", authAdmin, adminControllers.createUserRide);
router.get(
  "/getUnassignedUserRides",
  authAdmin,
  adminControllers.getUnassignedUserRides
);
router.post(
  "/assignUserRideToDriver",
  authAdmin,
  adminControllers.assignUserRidesToDriver
);

router.get(
  "/getUserAssignedRides",
  authAdmin,
  adminControllers.getAssignedUserRides
);

router.post(
  "/updateUserRides",
  authAdmin,
  adminControllers.updateAssignedUserRides
);

router.post(
  "/updateUserRideAsCompleted",
  authAdmin,
  adminControllers.updateUserRideAsCompleted
);

router.post(
  "/updateUserRideAsCancelled",
  authAdmin,
  adminControllers.updateUserRideAsCancelled
);

router.get(
  "/getCompletedUserRides",
  authAdmin,
  adminControllers.getCompletedUserRides
);

router.get(
  "/getCancelledUserRides",
  authAdmin,
  adminControllers.getCancelledUserRides
);

export default router;
