import express from "express"

import {registerAdmin,loginAdmin,createDriver} from "../../controllers/admin-controller"
import { authAdmin } from "../../middlewares";

const router=express.Router();

router.post("/signUp",registerAdmin)
router.post("/signIn",loginAdmin)
router.post("/addDriver",authAdmin,createDriver);

export default router;