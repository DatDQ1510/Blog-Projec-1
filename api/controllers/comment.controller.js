import Comment from '../models/comment.model.js';
import mongoose from "mongoose";
import User from '../models/user.model.js';
export const createCommentHandler = async (req, res) => {
    try {
        const { data_comment } = req.body;
        console.log(data_comment);
        console.log(req.body);
        // Kiểm tra nếu thiếu dữ liệu
        if (!req.body) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết' });
        }

        // Tạo bình luận mới
        const newComment = new Comment({
            content: req.body.content,
            postId: req.body.postId,
            userId: req.body.userId,
            likes: [],
            numberOfLikes: 0,
        });

        // Lưu bình luận vào cơ sở dữ liệu
        const savedComment = await newComment.save();

        // Trả về kết quả thành công
        res.status(201).json({
            message: 'Bình luận được tạo thành công',
            comment: savedComment,
        });
        console.log(savedComment);
    } catch (error) {
        // Xử lý lỗi và trả về thông tin chi tiết hơn
        console.error("Error occurred while creating comment:", error);
        res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
};

export const getCommentsByPostId = async (req, res) => {
    try {
        let { postId } = req.params;
        // Loại bỏ dấu ":" ở đầu postId nếu có
        if (postId.startsWith(':')) {
            postId = postId.substring(1);
        }
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

        const commentsWithUsernames = await Promise.all(
            comments.map(async (comment) => {
                const user = await User.findById(comment.userId);
                return {
                    ...comment.toObject(), // Chuyển comment thành object plain (plain object)
                    username: user.username, // Thêm username vào comment
                };
            })
        );

        res.status(200).json(commentsWithUsernames);
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
        res.status(500).json({
            message: 'An error occurred while retrieving comments.',
            error: error.message,
        });
    }
};


export const deleteCommentHandler = async (req, res) => {
    try {
        let { commentId } = req.params;
        // Loại bỏ dấu ":" ở đầu postId nếu có
        if (commentId.startsWith(':')) {
            commentId = commentId.substring(1);
        }
        // Convert string ID to ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid ObjectId" });
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "An error occurred while deleting comment.", error: error.message });
    }
}
export const contentEditCommentHandler = async (req, res) => {
    try {
        let { commentId } = req.params;
        // Loại bỏ dấu ":" ở đầu postId nếu có
        if (commentId.startsWith(':')) {
            commentId = commentId.substring(1);
        }
        // Convert string ID to ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid ObjectId" });
        }

        const editedComment = await Comment.findByIdAndUpdate(commentId, { content: req.body.content }, { new: true });

        if (!editedComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment edited successfully", comment: editedComment });
    } catch (error) {
        console.error("Error editing comment:", error);
        res.status(500).json({ message: "An error occurred while editing comment.", error: error.message });
    }
}
export const likeCommentHandler = async (req, res) => {
    try {
        let { commentId } = req.params;
        // Loại bỏ dấu ":" ở đầu postId nếu có
        if (commentId.startsWith(':')) { 
            commentId = commentId.substring(1);
        }
        // Convert string ID to ObjectId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid ObjectId" });
        }

        const editedLikeComment = await Comment.findByIdAndUpdate(commentId, { likes: req.body.likes }, { new: true });

        if (!editedLikeComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        res.status(200).json({ message: "Comment edited successfully", comment: editedLikeComment });
    } catch (error) {
        console.error("Error editing comment:", error);
        res.status(500).json({ message: "An error occurred while editing comment.", error: error.message });
    }
}
export const totalCommentHandler = async (req, res) => {
    try {
        const totalComment = await Comment.countDocuments();
        res.status(200).json(totalComment);
    } catch (error) {
        console.error("Error occurred while fetching total comment:", error);
        res.status(500).json({
            message: 'An error occurred while retrieving total comment.',
            error: error.message,
        });
    }
}
export const getTotalComment = async (req, res) => {
    try {
        // Lấy thông tin phân trang và sắp xếp từ query parameters
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        // Lấy danh sách comment theo phân trang và sắp xếp
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
           

    
        // Đếm tổng số comment
        const totalComments = await Comment.countDocuments();

        // Tính số comment được tạo trong vòng 1 tháng qua
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        // Tạo kết quả trả về
        const result = {
            totalComments,
            lastMonthComments,
            comments,
        };

        res.status(200).json(result);
    } catch (error) {
        console.error("Error occurred while fetching comments:", error);
        res.status(500).json({
            message: 'An error occurred while retrieving comments.',
            error: error.message,
        });
    }
};
