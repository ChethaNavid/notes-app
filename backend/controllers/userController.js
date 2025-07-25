import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { User } from '../models/users.js';

const createNewAccount = async(req, res) => {

    const {username, email, password} = req.body;

    if(!username) return res.status(400).json({ error: "Username is required."});

    if(!email) return res.status(400).json({ error: "Email is required." });

    if(!password) return res.status(400).json({ error: "Password is required."});

    try {
        const exisitingUser = await User.findOne({
            where: { email }
        })

        if(exisitingUser) {
            return res.status(409).json({ error: true, message: "User already exists." })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email,
            password: hashedPassword
        });

        const accessToken = jwt.sign(
            { user_id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"}
        );
        
        res.status(201).json({ 
            error: false,
            user,
            message: "Registration Successful", 
            token: accessToken,
        });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

const login = async(req, res) => {
    const {email, password} = req.body;

    try {

        if(!email) return res.status(400).json({ error: true, message: "Email is required." });

        if(!password) return res.status(400).json({ error: true, message: "Password is required." });

        const existingUser = await User.findOne({
            where: { email }
        });

        if(!existingUser) return res.status(401).json({ error: true, message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { user_id: existingUser.id, email: existingUser.email },
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"}
        );

        res.status(200).json({
            error: false,
            email,
            message: "Login successful",
            token: accessToken,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

// GET /users/get-user
const getUser = async (req, res) => {

    const { user_id } = req.user;

    try {
        const existingUser = await User.findOne({
            where: { id: user_id },
        })

        if(!existingUser) {
            return res.status(404).json({ error: true, message: "User not found."});
        } 

        const user = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
        };

        return res.status(200).json({
            error: false,
            user,
            message: "Logged-in user retrieved successfully.",
        })
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

export {createNewAccount, login, getUser};