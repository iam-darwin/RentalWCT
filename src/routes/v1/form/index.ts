import express from "express";

import * as FormRoutes from "../../../controllers/form-controller";

const router = express.Router();

router.post("/createForm", FormRoutes.createContactForm);

export default router;
