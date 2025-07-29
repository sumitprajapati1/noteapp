// import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import OTP from '../models/OTP.js';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/email.service.js';
import dotenv from 'dotenv';

dotenv.config();

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
export const sendOTP = async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const otp = generateOTP();
    await OTP.create({ email, otp });
    await sendOTPEmail(email, otp);
    
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    console.log("Email aand pasword ",process.env.EMAIL_USER,process.env.EMAIL_PASS);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

// Verify OTP and create user
export const verifyOTP = async (req, res) => {
  const { email, otp, name, dateOfBirth } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email is already registered. Please log in.' });
    }
    // Only create a new user if not found
    if (!name) {
      return res.status(400 ).json({ message: 'Name is required for new users' });
    }
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of Birth is required for new users' });
    }
    user = new User({ name, email, dateOfBirth });
    try {
      await user.save();
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }
      return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
// If you want to remove a duplicate user manually, use your DB client (e.g., MongoDB Compass) to delete the user with the duplicate email.
};

// Verify OTP for Signup
export const verifySignupOTP = async (req, res) => {
  const { email, otp, name, dateOfBirth } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'Email is already registered. Please log in.' });
    }
    if (!name || !dateOfBirth) {
      return res.status(400).json({ message: 'Name and Date of Birth are required' });
    }
    user = new User({ name, email, dateOfBirth });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth } });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

// Verify OTP for Login
export const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, dateOfBirth: user.dateOfBirth } });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

// Google OAuth callback
export const googleCallback = (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  const name = encodeURIComponent(req.user.name);
  const email = encodeURIComponent(req.user.email);
  res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}&userId=${req.user._id}&name=${name}&email=${email}`);
};