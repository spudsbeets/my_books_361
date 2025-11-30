import express, { application } from "express";
import cors from "cors";
import dotenv from "dotenv";
/* import authRoutes from "./src/routes/authRoutes.js"; */
import bookRoutes from "./src/routes/bookRoutes.js";
import pool from "./src/db.js";
import fs from 'fs';
import path from 'path';

dotenv.config();

// Initialize express app
const app = express();
// Allows cross-origin resource sharing
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server running!'));
/* app.use('/api/auth', authRoutes); */
app.use('/api/books', bookRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

const PORT = process.env.PORT || 4020

async function initializeDB() {
  try {
    const sql = fs.readFileSync('../sp.SQL', 'utf-8');
    const statements = sql.split(/;\s*$/m).map(s => s.trim()).filter(s => s.length);
    for (const stmt of statements) {
      await pool.query(stmt);
    }
    console.log("DB Initialized!");
  } catch(err) {
    console.error("DB Init error:", err);
  }
}


app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await initializeDB();
})