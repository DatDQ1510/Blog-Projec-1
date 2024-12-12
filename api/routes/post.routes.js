import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getposts } from '../controllers/post.controller.js';
import { get } from 'mongoose';
const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts)
export default router;