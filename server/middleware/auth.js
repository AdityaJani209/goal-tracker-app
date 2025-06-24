const jwt = require('jsonwebtoken');
const User = require('../models/User');
const inMemoryDB = require('../inMemoryDB');
const mongoose = require('mongoose');

// Check if MongoDB is available
const isMongoDBConnected = () => {
    return mongoose.connection.readyState === 1;
};

const auth = async (req, res, next) => {
    try {
        let token;

        // Get token from header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');

            // Get user from token
            let user;
            if (isMongoDBConnected()) {
                user = await User.findById(decoded.id);
            } else {
                user = await inMemoryDB.findUserById(decoded.id);
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'No user found with this token'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = auth;
