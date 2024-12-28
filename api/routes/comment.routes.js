import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    createComment,
    getPostComments,
    likeComment,
    editComment,
    deleteComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.get('/getcomments/:postId', getPostComments); // Lấy comments của bài viết
router.post('/newcomment', verifyToken, createComment); // Tạo comment mới
router.put('/likecomment/:commentId', verifyToken, likeComment); // Like/Unlike comment
router.put('/editcomment/:commentId', verifyToken, editComment); // Chỉnh sửa comment
router.delete('/deletecomment/:commentId', verifyToken, deleteComment); // Xóa comment

export default router;
