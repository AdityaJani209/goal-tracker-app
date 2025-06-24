const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const inMemoryDB = require('../inMemoryDB');

const router = express.Router();

// Check if MongoDB is available
let useInMemoryDB = false;
const mongoose = require('mongoose');

// Monitor MongoDB connection
mongoose.connection.on('connected', () => {
    useInMemoryDB = false;
    console.log('MongoDB connected - using MongoDB for data storage');
});

mongoose.connection.on('error', () => {
    useInMemoryDB = true;
    console.log('MongoDB connection error - using in-memory database for development');
});

mongoose.connection.on('disconnected', () => {
    useInMemoryDB = true;
    console.log('MongoDB disconnected - using in-memory database for development');
});

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
], validate, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let existingUser, user;

        if (useInMemoryDB) {
            // Use in-memory database
            existingUser = await inMemoryDB.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user in memory
            user = await inMemoryDB.createUser({
                name,
                email,
                password: hashedPassword
            });
        } else {
            // Use MongoDB
            existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists with this email'
                });
            }

            // Create user
            user = await User.create({
                name,
                email,
                password
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .exists()
        .withMessage('Password is required')
], validate, async (req, res) => {
    try {
        const { email, password } = req.body;

        let user, isMatch;

        if (useInMemoryDB) {
            // Use in-memory database
            user = await inMemoryDB.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        } else {
            // Use MongoDB
            user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences || { theme: 'light', notifications: { email: true, reminders: true } }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
    auth,
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
], validate, async (req, res) => {
    try {
        const { name, email, preferences, avatar } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (preferences) updateFields.preferences = { ...req.user.preferences, ...preferences };
        if (avatar !== undefined) updateFields.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                preferences: user.preferences,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', [
    auth,
    body('currentPassword')
        .exists()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
], validate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

module.exports = router;
