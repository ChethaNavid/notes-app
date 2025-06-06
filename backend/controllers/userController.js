import pool from '../db.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createNewAccount = async(req, res) => {
    const {fullName, email, password} = req.body;

    if(!fullName) return res.status(400).json({ error: "Full Name is required."});

    if(!email) return res.status(400).json({ error: "Email is required." });


    if(!password) return res.status(400).json({ error: "Password is required."})

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );

    if(existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User already exists." })
    }

    const result = await pool.query(
        'INSERT INTO users (full_name, email, password, created_on) VALUES ($1, $2, $3, NOW()) RETURNING id, full_name, email',
        [fullName, email, password]
    );

    const user = result.rows[0];

    const accessToken = jwt.sign(
        { user_id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"}
    );
    
    res.status(201).json({ 
        error: false,
        user: {
            id: user.id,
            name: user.full_name,
            email: user.email,
        },
        message: "Registration Successful", 
        token: accessToken,
    });
}

const login = async(req, res) => {
    const {email, password} = req.body;

    if(!email) return res.status(400).json({ error: "Email is required." });

    if(!password) return res.status(400).json({ error: "Password is required." });

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1', [email]
    );

    if(existingUser.rows.length === 0) return res.status(404).json({ error: "User not found" });

    const user = existingUser.rows[0];

    if(user.password !== password) {
        return res.status(401).json({ error: "Incorrect password." });
    }

    const accessToken = jwt.sign(
        { user_id: user.id, email: user.email, name: user.full_name},
        process.env.ACCESS_TOKEN_SECRET, {expiresIn: "36000m"}
    );

    res.status(200).json({
        error: false,
        email,
        message: "Login successful",
        token: accessToken,
    });
}

// GET /users/get-user
const getUser = async (req, res) => {
    const { user_id } = req.user;

    const existingUser = await pool.query('SELECT id, full_name, email, created_on FROM users WHERE id = $1', [user_id]);

    if(existingUser.rows.length === 0) {
        return res.status(404).json({ error: true, message: "User not found."});
    } 

    const users = existingUser.rows[0];

    return res.status(200).json({
        error: false,
        users: users, 
        message: "Logged-in user retrieved successfully.",
    })
}

export {createNewAccount, login, getUser};