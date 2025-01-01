import express from "express";
import { test, getUsers , deleteUser} from "../controllers/user.controller.js";

const router = express.Router();

// Định nghĩa route
router.get('/test', test);
router.get('/users', getUsers);
router.delete('/delete-user/:userId', deleteUser);
export default router;
