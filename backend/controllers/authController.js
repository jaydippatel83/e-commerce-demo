const user = require('../model/user');
const { sign } = require('jsonwebtoken');
const sendEmail = require('../utils/utils');
const bcrypt = require('bcryptjs');



const generateToken = (id) => {
    const token = sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
};


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new user({ name, email, hashPassword });
        if (newUser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const msg = `Welcome to e-commerce ${name}! Thank you for registration with us. You OTP for e-commerce registration is ${otp}`;
            await sendEmail(email, "Welcome to E-commerce - Your OTP for registation", msg);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token: generateToken(newUser._id),

                message: "User registered successfully. Please check your email for OTP."
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
        // await newUser.save();
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.hashPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            token: generateToken(existingUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await user.find().select("-hashPassword");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingUser = await user.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            _id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerUser, loginUser, getUserProfile, getUsers };