import express from "express"

import {registerAdmin,loginAdmin} from "../../controllers/admin-controller"

const router=express.Router();

router.post("/signUp",registerAdmin)
router.post("/signIn",loginAdmin)

export default router;