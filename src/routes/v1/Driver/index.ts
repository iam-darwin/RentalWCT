import express from "express";
import { checkHisRides, loginDriver } from "../../../controllers/driver-controller";

const router = express.Router();

router.post("/Driver/signInDriver",loginDriver);
router.get("/Driver/rides",checkHisRides)
export default router;