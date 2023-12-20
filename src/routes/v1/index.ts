import express from "express"

import { authAdmin } from "../../middlewares";
import {registerAdmin,loginAdmin,createDriver} from "../../controllers/admin-controller"
import { loginDriver } from "../../controllers/driver-controller";


const router=express.Router();

router.post("/signUp",registerAdmin)
router.post("/signIn",loginAdmin)
router.post("/addDriver",authAdmin,createDriver);

router.post("/signInDriver",loginDriver);

export default router;