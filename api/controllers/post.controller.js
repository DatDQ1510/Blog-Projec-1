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