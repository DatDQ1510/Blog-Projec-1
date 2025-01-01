import { errorHandle } from "../utils/error.js"
import Post from "../models/post.model.js"

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
        next(errorHandle(500, error.message))
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
        }).sort({ createdAt: sortDirection }).skip(startIndex);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const lastMonthPosts = await Post.countDocuments({ createdAt: { $gte: oneMonthAgo } });
        res.status(200).json({ posts, totalPosts, lastMonthPosts });
    } catch (error) {
        next(errorHandle(500, error.message))
    }
}

export const getPostBySlug = async (req, res, next) => {
    const { slug } = req.params; // Lấy slug từ params

    if (!slug) {
        return res.status(400).json({ success: false, message: 'Slug is required' });
    }

    try {
        const post = await Post.findOne({ slug });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        next(error); // Truyền lỗi cho middleware xử lý lỗi
    }
};

export const deletepost = async (req, res, next) => {

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updatepost = async (req, res, next) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                },
            },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy id từ params
        const post = await Post.findById(id); // Tìm bài viết với id
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        next(error);
    }
};
export const getPostDetail = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ post });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}