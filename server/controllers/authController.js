import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
//import { userAuth } from '../middleware/userAuth.js';
export const register =  async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({ success : false , message: 'All fields are required' });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ success : false , message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,       
        });
        //sending welcome email to user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Platform!',
            text: `Hello ${name},\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nThe Team`  
        };
        await transporter.sendMail(mailOptions);    
        return res.json({ success: true, message: 'User registered successfully' });
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ success : false , message: 'All fields are required' });
    } 
    try {
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.status(400).json({ success : false , message: 'Invalid email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ success : false , message: 'Invalid password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,       
        });
        return res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logout successful' });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendverifyOtp = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified) {
            return res.status(400).json({ success : false , message: 'Account is Already verified' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Hello ${user.name},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 24 hours.\n\nBest regards,\nThe Team`
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Verification OTP sent to the email' });
    } 
    catch(error) {
        res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const userId = req.userId || req.body.userId;
    const { otp } = req.body;
    if(!userId || !otp) {
        return res.status(400).json({ success : false , message: 'Missing details' });
    }
    try {
        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(400).json({ success : false , message: 'User not found' });
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success : false , message: 'Invalid OTP' });
        }
        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success : false , message: 'OTP has expired' });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {   
        res.json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        res.json({ success: true});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const sendResetOtp = async (req, res) => {
    const email = req.body;
    if(!email) {
        return res.status(400).json({ success : false , message: 'Email is required' });
    }
    try {
        const user = await userModel.findOne(email);
        if(!user) {
            return res.status(400).json({ success : false , message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetotpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Hello ${user.name},\n\nYour OTP for Password Reset is: ${otp}\nThis OTP is valid for 24 hours.\n\nBest regards,\nThe Team`
        };
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent to the email' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if(!email || !otp || !newPassword) {
        return res.status(400).json({ success : false , message: 'All fields are required' });
    }
    try {
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.status(400).json({ success : false , message: 'User not found' });
        }
        if(user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success : false , message: 'Invalid OTP' });
        }
        if(user.resetotpExpireAt < Date.now()) {
            return res.status(400).json({ success : false , message: 'OTP has expired' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetotpExpireAt = 0;
        await user.save();
        res.json({ success: true, message: 'Password reset successfully' });
    }
    catch (error) {     
        res.json({ success: false, message: error.message });
    }
}