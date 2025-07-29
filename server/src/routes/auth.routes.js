import express from 'express';
import passport from 'passport';
import { sendOTP, verifyOTP, googleCallback, verifySignupOTP, verifyLoginOTP } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/verify-signup-otp', verifySignupOTP);
router.post('/verify-login-otp', verifyLoginOTP);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);

export default router;