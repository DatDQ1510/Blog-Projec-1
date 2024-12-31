import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    createCommentHandler, getCommentsByPostId,
    deleteCommentHandler, contentEditCommentHandler, likeCommentHandler
} from '../controllers/comment.controller.js';
const router = express.Router();

router.post('/create-comment', verifyToken, createCommentHandler);
router.get('/get-comments-by-post-id/:postId', getCommentsByPostId);
router.delete('/delete-comment/:commentId', deleteCommentHandler);
router.patch('/edit-comment/:commentId', contentEditCommentHandler);
router.patch('/edit-like-comment/:commentId', likeCommentHandler);
export default router;
