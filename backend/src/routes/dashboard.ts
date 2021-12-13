import express from "express";
import getDashboardData from "../controllers/get-dashboard-data";

const router = express.Router();

router.get("/", getDashboardData);

export default router;
