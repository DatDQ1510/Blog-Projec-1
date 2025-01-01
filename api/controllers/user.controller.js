// Import model
import User from "../models/user.model.js";
import mongoose from 'mongoose';
// Controller logic
export const test = (req, res) => {
    res.json({ message: 'Hello world! ' });
};

// Thêm các logic khác như xử lý user ở đây nếu cần
export const getUsers = async (req, res, next) => {
    // if (!req.user.isAdmin) {
    //     return next(errorHandler(403, 'You are not allowed to see all users'));
    // }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, refreshToken, createdAt, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        // Lấy userId từ params
        let { userId } = req.params;
        console.log(userId); // Kiểm tra xem userId có chính xác không

        // Loại bỏ dấu ":" ở đầu nếu có (thường là do lỗi khi truyền dữ liệu)
        if (userId.startsWith(':')) {
            userId = userId.substring(1);
        }
        console.log(userId);
        // Kiểm tra xem ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid ObjectId" });
        }

        // Tìm và xóa người dùng theo userId
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};
