const express = require('express');
const router = express.Router();
const { LikeComment, User, Blog } = require('../database');
const auth = require('../middleware/auth');

// Add a like or comment
router.post('/', auth, async (req, res) => {
    try {
        const { blogId, comment } = req.body;
        
        // Check if blog exists
        const blog = await Blog.findByPk(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Check if user already liked/commented
        const existingLike = await LikeComment.findOne({
            where: {
                userId: req.user.id,
                blogId
            }
        });

        if (existingLike) {
            // Update existing comment if provided
            if (comment) {
                await existingLike.update({ comment });
            }
            return res.json(existingLike);
        }

        // Create new like/comment
        const likeComment = await LikeComment.create({
            userId: req.user.id,
            blogId,
            comment
        });
        res.status(201).json(likeComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all comments for a blog
router.get('/blog/:blogId', async (req, res) => {
    try {
        const comments = await LikeComment.findAll({
            where: {
                blogId: req.params.blogId,
                comment: {
                    [Op.ne]: null // Only get entries with comments
                }
            },
            include: [{
                model: User,
                attributes: ['username', 'name', 'profile_picture']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get like count for a blog
router.get('/blog/:blogId/likes', async (req, res) => {
    try {
        const count = await LikeComment.count({
            where: {
                blogId: req.params.blogId
            }
        });
        res.json({ likes: count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a like/comment
router.delete('/:blogId', auth, async (req, res) => {
    try {
        const deleted = await LikeComment.destroy({
            where: {
                userId: req.user.id,
                blogId: req.params.blogId
            }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Like/comment not found' });
        }
        res.json({ message: 'Like/comment removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router };