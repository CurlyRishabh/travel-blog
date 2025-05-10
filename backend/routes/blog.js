const express = require('express');
const router = express.Router();
const { Blog, User } = require('../database');
const auth = require('../middleware/auth'); // Assuming you have auth middleware
const multer = require('multer');
const { Op } = require('sequelize');
// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });


// Create a new blog - updated to handle multipart form data
router.post('/create', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, description, tags, total_cost, destination } = req.body;

        // Handle tags if it's sent as a string
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        const blog = await Blog.create({
            title,
            image: req.file ? req.file.path : null, // Save the file path
            description,
            tags: parsedTags,
            total_cost,
            destination,
            userId: req.user.id
        });
        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: error.message });
    }
});


// Get all blogs with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;  // Default to page 1
        const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
        const offset = (page - 1) * limit;

        const { count, rows: blogs } = await Blog.findAndCountAll({
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'name', 'profile_picture', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(count / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            blogs,
            pagination: {
                total: count,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search blogs with pagination
router.get('/search', async (req, res) => {
    try {
        const {
            query = '',           // Search query
            page = 1,            // Current page
            limit = 10,          // Items per page
            destination = '',     // Filter by destination
            minCost,             // Filter by minimum cost
            maxCost,             // Filter by maximum cost
            tags = []            // Filter by tags
        } = req.query;

        // Convert string parameters to appropriate types
        const currentPage = parseInt(page);
        const itemsPerPage = parseInt(limit);
        const offset = (currentPage - 1) * itemsPerPage;
        const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;

        // Build search conditions
        const whereConditions = {
            [Op.and]: []
        };

        // Search in title and description
        if (query) {
            whereConditions[Op.and].push({
                [Op.or]: [
                    { title: { [Op.iLike]: `%${query}%` } },
                    { description: { [Op.iLike]: `%${query}%` } }
                ]
            });
        }

        // Filter by destination
        if (destination) {
            whereConditions[Op.and].push({
                destination: { [Op.iLike]: `%${destination}%` }
            });
        }

        // Filter by cost range
        if (minCost || maxCost) {
            const costCondition = {};
            if (minCost) costCondition[Op.gte] = parseFloat(minCost);
            if (maxCost) costCondition[Op.lte] = parseFloat(maxCost);
            whereConditions[Op.and].push({ total_cost: costCondition });
        }

        // Filter by tags
        if (parsedTags.length > 0) {
            whereConditions[Op.and].push({
                tags: { [Op.overlap]: parsedTags }
            });
        }

        // Execute search query with pagination
        const { count, rows: blogs } = await Blog.findAndCountAll({
            where: whereConditions[Op.and].length > 0 ? whereConditions : {},
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'name', 'profile_picture', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: itemsPerPage,
            offset
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(count / itemsPerPage);
        const hasNextPage = currentPage < totalPages;
        const hasPrevPage = currentPage > 1;

        res.json({
            blogs,
            pagination: {
                total: count,
                totalPages,
                currentPage,
                limit: itemsPerPage,
                hasNextPage,
                hasPrevPage
            },
            filters: {
                query,
                destination,
                minCost,
                maxCost,
                tags: parsedTags
            }
        });
    } catch (error) {
        console.error('Error searching blogs:', error);
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