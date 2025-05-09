const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../database');
const UserTypes = require('../database/enum');

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, userType, profile_picture, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            userType: userType || UserTypes.USER,
            profile_picture,
            name
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile route
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout route
router.post('/logout', authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = jwt.sign(
            { id: user.id, email: user.email },
            'your-secret-key',
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Password reset instructions sent',
            resetToken
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        const decoded = jwt.verify(resetToken, 'your-secret-key');
        
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = { router, authenticateToken };