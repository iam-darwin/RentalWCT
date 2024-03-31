import express, { Request, Response } from "express";
import * as adminControllers from "../../../controllers/admin-controller";
import {
  superAdminAuth,
  authAdmin,
  resetPwdAuthGet,
  resetPwdAuthPOST,
} from "../../../middlewares";
import { upload } from "../../../utils/helper";
import { prisma } from "../../../config/Connectdb";

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
  adminControllers.updateDriverDetails
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
router.post(
  "/updateRideAsCancelled",
  authAdmin,
  adminControllers.updateRideAsCancelled
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
  "/driverTotalAmountCalculate",
  authAdmin,
  superAdminAuth,
  adminControllers.driverTotalAmountCalculate
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
router.post(
  "/deletePayment/:paymentId",
  authAdmin,
  superAdminAuth,
  adminControllers.deletePayment
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

router.post(
  "/completedRideUndo",
  authAdmin,
  adminControllers.completedRideUndo
);

router.post(
  "/cancelledRideUndo",
  authAdmin,
  adminControllers.cancelledRideUndo
);
router.post("/dates", async (req, res) => {
  const { startDate, endDate } = req.body; // Retrieve start and end dates from query parameters
  console.log(startDate, endDate);
  // Use startDate and endDate in your database query
  try {
    // Retrieve rides between the start and end dates
    const rides = await prisma.rides.findMany({
      where: {
        Ride_Date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return res.status(200).json({ len: rides.length });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
