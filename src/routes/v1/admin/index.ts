import express from "express";
import { assignRideToDriver, createDriver, fileUpload, getActiveDrivers, getAssignedRides, getDriverById, getDrivers, getUnAssignedRides, loginAdmin, registerAdmin,updateDrivedetails } from "../../../controllers/admin-controller";
import { authAdmin } from "../../../middlewares";
import { upload } from "../../../utils/helper";

const router = express.Router();

router.post("/signUp",registerAdmin)
router.post("/signIn",loginAdmin)
router.post("/addDriver",createDriver);
router.get("/drivers",getDrivers)
router.get("/driver/:id",authAdmin,getDriverById)
router.get("/activeDrivers",authAdmin,getActiveDrivers)
router.post("/fileUpload",upload.single('csvFile'),fileUpload)
router.get("/unAssignedRides",getUnAssignedRides)
router.post("/assignRide",assignRideToDriver)
router.get("/assignedRides",getAssignedRides)
router.post("/updateDriverDetails",updateDrivedetails)


export default router;