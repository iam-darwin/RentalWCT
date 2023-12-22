import express from "express"

import { authAdmin } from "../../middlewares";
import {registerAdmin,loginAdmin,createDriver,getDrivers, getDriverById, getActiveDrivers,fileUpload,getUnAssignedRides, assignRideToDriver,getAssignedRides} from "../../controllers/admin-controller"
import { loginDriver } from "../../controllers/driver-controller";
import { upload } from "../../utils/helper";


const router=express.Router();


//ADMIN ROUTES
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


router.post("/signInDriver",loginDriver);

export default router;