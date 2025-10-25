import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";

dotenv.config()

// Initialize express app
const app = express()
// Allows cross-origin resource sharing
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

const PORT = process.env.port || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))