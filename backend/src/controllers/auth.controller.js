import bcrypt from 'bcryptjs';
import {db} from '../libs/db.js';
import pkg from '../generated/prisma/index.js';
const { UserRole } = pkg;
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
export const register = async (req, res) => {
    console.log('Registering user...');
    const {} = req.body;
    const { email, password, name, image } = req.body;

    try {
        // Check if user already exists
        const existingUser = await db.user.findUnique({ 
            where: { email }
         });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER,
                image,
            },
        });
        // Generate token
        const token = jwt.sign({
          id: newUser._id},
          process.env.JWT_SECRET,
            {
                expiresIn: '7d',
            },
        )
        // Save token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send response
        res.status(201).json({
            success: true,
            message: 'User created successfully',   
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                image: newUser.image,
                role: newUser.role
            },
            token,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image, // Include profile picture
                role: user.role,
                coins: user.coins, // Include coins
            },
            token,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        res.status(200).json({ 
            success: true,
            message: 'Logout successful' 
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: error.message });
    }
}

export const me = async (req, res) => {
    const { userId } = req;
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: {
                solvedProblems: {
                    include: { problem: true },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate stats
        const totalSolved = user.solvedProblems.length;
        const totalSubmissions = 324; // Replace with actual logic if tracked
        const acceptanceRate = ((totalSolved / totalSubmissions) * 100).toFixed(2);

        // Group solved problems by difficulty
        const difficultyStats = { EASY: 0, MEDIUM: 0, HARD: 0 };
        user.solvedProblems.forEach((sp) => {
            difficultyStats[sp.problem.difficultyLevel]++;
        });

        // Prepare recent activity
        const recentActivity = user.solvedProblems
            .slice(-5) // Limit to last 5 activities
            .map((sp) => ({
                title: sp.problem.title,
                difficulty: sp.problem.difficultyLevel,
                status: 'Solved',
                solvedAt: sp.solvedAt,
            }));

        res.status(200).json({
            success: true,
            message: 'User authenticated successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role,
                coins: user.coins,
                badges: user.badges,
                createdAt: user.createdAt,
            },
            stats: {
                totalSolved,
                totalSubmissions,
                acceptanceRate,
                difficultyStats,
            },
            recentActivity,
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: error.message });
    }
};


export const refresh = async (req, res) => {
    const { userId } = req;
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
                expiresIn: '21d',
            },
        );
        // Save token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 21 * 24 * 60 * 60 * 1000, // 21 days
        });
        // Send response
        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                role: user.role
            },
            token,      
            });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: error.message });
            }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate reset token
        const resetToken = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h',
            },
        );
        // Save reset token to user
        await db.user.update({
            where: { id: user.id },
            data: { resetToken },
        });
        // Send email with reset link (not implemented)
        res.status(200).json({ 
            success: true,
            message: 'Reset link sent to email' 
        });
    } catch (error) {
        console.error('Error sending reset link:', error);
        res.status(500).json({ message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        // Verify reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user || user.resetToken !== token) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user password
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword, resetToken: null },
        });
        res.status(200).json({ 
            success: true,
            message: 'Password reset successfully' 
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        // Verify email token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await db.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired token' 
            });
        }
        // Update user email verification status
        await db.user.update({
            where: { id: user.id },
            data: { emailVerified: true },
        });
        res.status(200).json({ 
            success: true,
            message: 'Email verified successfully' 
        });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: error.message });
    }
}

export const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    try {
        // Verify OTP
        const user = await db.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if OTP is valid
        // If OTP is valid, update user OTP verification status
        if (otp !== user.otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update user OTP verification status
        await db.user.update({
            where: { id: req.userId },
            data: { otpVerified: true },
        });
        res.status(200).json({ 
            success: true,
            message: 'OTP verified successfully' 
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: error.message });
    }
}

export const verifyOtpResend = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate new OTP 
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        // Save new OTP to user
        await db.user.update({
            where: { id: user.id },
            data: { otp: newOtp },
        });
        // Send OTP to user email

        res.status(200).json({ 
            success: true,
            message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ message: error.message });
    }
}