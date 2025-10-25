import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getBooksByStatus, addBook, addReview, getRecommendation, searchBooks, updateBook, updateReview, updateProfile, deleteBook } from "../controllers/bookController.js";

const router = express.Router();

// GET
router.get("/books", authenticate, getBooksByStatus); // Status = Query. i.e. /books?status=wishlist
router.get("/books/recommendation", authenticate, getRecommendation); // Get a recommendation
router.get("/books/search", authenticate, searchBooks); // Search by Author, Title, ISBN

// POST
router.post("/books", authenticate, addBook); // Add a book to the database
router.post("/books/:id/reviews", authenticate, addReview); // Add a user review to a book

// PUT
router.put("/books/:id", authenticate, updateBook); // Update book information
router.put("/books/:id/reviews/:reviewId", authenticate, updateReview); // Update a user review
router.put("/users/profile", authenticate, updateProfile); // Update the user profile

// DELETE
router.delete("/books/:id", authenticate, deleteBook); // Delete a book

export default router;