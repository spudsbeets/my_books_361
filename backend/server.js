import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import bookRoutes from "./src/routes/bookRoutes.js";

dotenv.config();

// Initialize express app
const app = express();
// Allows cross-origin resource sharing
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server running!'));
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/uploads', express.static('src/uploads'));

const PORT = process.env.PORT || 5000

async function initializeDB() {
  try {
    await pool.query('CALL sp_load_db()');
    console.log('Database initialized!');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

initializeDB();

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))