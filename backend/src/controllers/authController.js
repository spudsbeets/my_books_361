/* // import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

// POST Controllers

// ROUTE: router.post("/register", registerUser);
// PURPOSE: Register a user into the database.
export async function registerUser(req, res) {
    const { firstName, lastName, birthdate, email, password } = req.body

    try {
        // Hash functionality removed for time being, will be reimplemented as a microservice.
        // const hashed = await bcrypt.hash(password, 10); // 10 = Salt Rounds, adds randomness
        await pool.query("INSERT INTO Users (firstName, lastName, birthdate, email, password) VALUES (?, ?, ?, ?, ?)", [firstName, lastName, birthdate, email, password]);

        const [userRows] = await pool.query("SELECT userID FROM Users WHERE email = ?", [email]);
        const user = userRows[0];

        if (!user) {
            res.status(500).json({ error: "User creation failed." })
        }

        const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        res.status(201).json({ token });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

// ROUTE: router.post("/login", loginUser);
// PURPOSE: Log a user into their account.
export async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
        const user = rows[0];
        if (!user) return res.status(400).json({ error: "User not found" });

        // Proper password storage functionality will be reintroduced later as a microservice.
        //const match = await bcrypt.compare(password, user.password);
        //if (!match) return res.status(401).json({ error: "Invalid password" });

        if (password !== user.password) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ id: user.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: err.message })
    }
} */