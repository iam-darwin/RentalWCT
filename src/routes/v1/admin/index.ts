import express from "express";
import * as adminControllers from "../../../controllers/admin-controller";
import { authAdmin } from "../../../middlewares";
import { upload } from "../../../utils/helper";


const router = express.Router();

router.post("/signUp",adminControllers.registerAdmin)
router.post("/signIn",adminControllers.loginAdmin)
router.post("/addDriver",adminControllers.createDriver);
router.get("/drivers",adminControllers.getDrivers)
router.get("/driver/:id",authAdmin,adminControllers.getDriverById)
router.get("/activeDrivers",authAdmin,adminControllers.getActiveDrivers)
router.post("/fileUpload",upload.single('csvFile'),adminControllers.fileUpload)
router.get("/unAssignedRides",adminControllers.getUnAssignedRides)
router.post("/assignRide",adminControllers.assignRideToDriver)
router.get("/assignedRides",adminControllers.getAssignedRides)
router.post("/updateDriverDetails",adminControllers.updateDrivedetails)
router.post("/updateRideAsCompleted",adminControllers.updateRideAsCompleted)
router.post("/updateAssignRides",adminControllers.updateAssignedRides);
router.post("/forgotPassword",adminControllers.forgotPassword);

export default router;