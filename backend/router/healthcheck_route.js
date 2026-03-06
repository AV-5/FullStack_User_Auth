import express from "express";
import healthcheckController from "../controller/healthcheck_controller.js";
const router=express.Router();
router.get("/",healthcheckController);
export default router;