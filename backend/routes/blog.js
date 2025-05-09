const express = require('express');
const router = express.Router();
const { Blog, User } = require('../database');
const auth = require('../middleware/auth'); // Assuming you have auth middleware

// Create a new blog
router.post('/', auth, async (req, res) => {
    try {
        const { title, image, description, tags, total_cost, destination } = req.body;
        const blog = await Blog.create({
            title,
            image,
            description,
            tags,
            total_cost,
            destination,
            userId: req.user.id // From auth middleware
        });
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            include: [{
                model: User,
                attributes: ['username', 'name', 'profile_picture']
            }]
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['username', 'name', 'profile_picture']
            }]
        });
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a blog
router.put('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (blog.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        
        const { title, image, description, tags, total_cost, destination } = req.body;
        await blog.update({
            title,
            image,
            description,
            tags,
            total_cost,
            destination
        });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a blog
router.delete('/:id', auth, async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        if (blog.userId !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await blog.destroy();
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router };