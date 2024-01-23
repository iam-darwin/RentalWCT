import express from "express";

import AdminRoutes from "./admin/index";
import DriverRoutes from "./Driver/index";
import FormRoutes from "./form/index";

const router = express.Router();

//AdminRoute
router.use("/admin", AdminRoutes);

//Driver-Route
router.use("/driver", DriverRoutes);

//form-Router
router.use("/form", FormRoutes);

export default router;
