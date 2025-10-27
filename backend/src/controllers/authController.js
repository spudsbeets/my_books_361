import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

export async function registerUser(req, res) {
    const { firstName, lastName, birthdate, email, password } = req.body

    try {
        // const hashed = await bcrypt.hash(password, 10); // 10 = Salt Rounds, adds randomness
        await pool.query("INSERT INTO Users (firstName, lastName, birthdate, email, password) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, birthdate, email, password]);
        res.status(201).json({ message: "User Registered" });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export async function loginUser(req, res) {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        // Check if user is present in DB
        const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) return res.status(400).json({ error: "User not found" });

        // Check if PW matches
        //const match = await bcrypt.compare(password, user.password);
        //if (!match) return res.status(401).json({ error: "Invalid password" });

        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Permits stateless authentication
        const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
}