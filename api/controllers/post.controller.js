import { errorHandle } from "../utils/error.js"
import Post from "../models/post.model.js"
import e from "express";
export const create = async (req, res, next) => {
    console.log(req.user);
    if (!req.body.title || !req.body.content) {
        return next(errorHandle(400, "Title and content are required"))
    }

    const slug = req.body.title.toLowerCase().split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id, // Lấy userId từ req.user 
    })
    try {
        const savePost = await newPost.save();
        res.status(201).json({ success: true, savePost })
    }
    catch (error) {
        next(error)
    }
    console.log("Create post");
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { sulg: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),
        }).sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        res.status(200).json({ posts, totalPosts, lastMonthPosts });
    } catch (error) {
        next(error)
    }
}