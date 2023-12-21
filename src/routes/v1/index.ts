import express from "express"

import { authAdmin } from "../../middlewares";
import {registerAdmin,loginAdmin,createDriver,getDrivers, getDriverById, getActiveDrivers,fileUpload} from "../../controllers/admin-controller"
import { loginDriver } from "../../controllers/driver-controller";
import { upload } from "../../utils/multer";


const router=express.Router();


//ADMIN ROUTES
router.post("/signUp",registerAdmin)
router.post("/signIn",loginAdmin)
router.post("/addDriver",authAdmin,createDriver);
router.get("/drivers",authAdmin,getDrivers)
router.get("/driver/:id",authAdmin,getDriverById)
router.get("/activeDrivers",authAdmin,getActiveDrivers)
router.post("/fileUpload",authAdmin,upload.single('csvFile'),fileUpload)

router.post("/signInDriver",loginDriver);

export default router;