import {getConnection} from '../db.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const createNewAccount = async(req, res) => {
    
    const connection = await getConnection();
    const {fullName, email, password} = req.body;

    if(!fullName) return res.status(400).json({ error: "Full Name is required."});

    if(!email) return res.status(400).json({ error: "Email is required." });

    if(!password) return res.status(400).json({ error: "Password is required."})

    const [existingUser] = await connection.execute(
        'SELECT * FROM users WHERE email = ?', [email]
    );

    if(existingUser.length > 0) {
        return res.status(409).json({ error: true, message: "User already exists." })
    }

    const [result] = await connection.execute(
        'INSERT INTO users (full_name, email, password, created_on) VALUES (?, ?, ?, NOW())',
        [fullName, email, password]
    );

    const userId = result.insertId;

    const user = {
      id: userId,
      full_name: fullName,
      email: email,
    };

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
}

const login = async(req, res) => {
    const connection = await getConnection();
    const {email, password} = req.body;

    if(!email) return res.status(400).json({ error: true, message: "Email is required." });

    if(!password) return res.status(400).json({ error: true, message: "Password is required." });

    const [existingUser] = await connection.execute(
        'SELECT * FROM users WHERE email = ?', [email]
    );

    if(existingUser.length === 0) return res.status(404).json({ error: true, message: "User not found" });

    const user = existingUser[0];

    if(user.password !== password) {
        return res.status(401).json({ error: true, message: "Incorrect password." });
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
    const connection = await getConnection();
    const { user_id } = req.user;

    const [existingUser] = await connection.execute('SELECT id, full_name, email, created_on FROM users WHERE id = ?', [user_id]);

    if(existingUser.length === 0) {
        return res.status(404).json({ error: true, message: "User not found."});
    } 

    const user = existingUser[0];

    return res.status(200).json({
        error: false,
        user,
        message: "Logged-in user retrieved successfully.",
    })
}

export {createNewAccount, login, getUser};