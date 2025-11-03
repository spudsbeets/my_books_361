import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getBooksByStatus, getUser, getUserStats, getSingleBook, getUserBookStatus, getUserReview, addBook, addReview, getRecommendation, searchBooks, updateBook, updateUserBookStatus, updateUserReview, updateProfile, deleteBook } from "../controllers/bookController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"

const router = express.Router();

// Setup storage system for cover images.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads")
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// GET
router.get("/books", authenticate, getBooksByStatus); // Status = Query. i.e. /books?status=wishlist
router.get("/users", authenticate, getUser); // Get a user
router.get("/books/:bookID", authenticate, getSingleBook); // Get 1 book from Books
router.get("/userBooks/:bookID", authenticate, getUserBookStatus); // Get 1 book status from UserBooks
router.get("/stats", authenticate, getUserStats); // Get user stats for homepage
router.get("/recommendation", authenticate, getRecommendation); // Get a recommendation
router.get("/userReviews/:bookID", authenticate, getUserReview); // Get a user review
router.get("/search", authenticate, searchBooks); // Search by Author, Title, ISBN

// POST
router.post("/books", authenticate, upload.single("coverImg"), addBook); // Add a book to the database
router.post("/books/:bookID/review", authenticate, addReview); // Add a review

// PUT
router.put("/books/:bookID", authenticate, upload.single("coverImg"), updateBook); // Update book information
router.put("/users/profile", authenticate, updateProfile); // Update the user profile

// PATCH
router.patch("/userBooks/:bookID", authenticate, updateUserBookStatus); // Update the status of a book in the user catalog
router.patch("/userReviews/:bookID", authenticate, updateUserReview); // Update a user's review of a book

// DELETE
router.delete("/books/:bookID", authenticate, deleteBook); // Delete a book

export default router;