import express from "express";


import V1routes from "./v1/index";

const router = express.Router();

router.use("/v1", V1routes);

export default router;
