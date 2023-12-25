import express from "express";
import { checkHisRides, loginDriver,getCompletedRides } from "../../../controllers/driver-controller";

const router = express.Router();

router.post("/signInDriver",loginDriver);
router.get("/rides",checkHisRides)
router.get('/completedRides',getCompletedRides);

export default router;