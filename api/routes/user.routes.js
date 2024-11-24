import express from "express";
import { test } from "../controllers/user.controller.js";

const router = express.Router();

// Định nghĩa route
router.get('/', test);

export default router;
