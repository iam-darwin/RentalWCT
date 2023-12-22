import express from "express"


import AdminRoutes from "./admin/index"
import DriverRoutes from "./Driver/index"


const router=express.Router();

//AdminRoute
router.use("/admin",AdminRoutes)

//Driver-Route
router.use("/driver",DriverRoutes)

export default router;