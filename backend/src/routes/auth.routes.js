import express from 'express';
import { forgotPassword, login, logout, me, refresh, register, resetPassword, verifyEmail, verifyOtp, verifyOtpResend } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const authRoutes = express.Router();

//routes
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', authMiddleware,logout);
authRoutes.get('/me', authMiddleware,me);
authRoutes.get('/refresh', authMiddleware,refresh);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password', resetPassword);
authRoutes.post('/verify-email', verifyEmail);
authRoutes.post('/verify-otp', verifyOtp);
authRoutes.post('/verify-otp-resend', verifyOtpResend);

export default authRoutes;