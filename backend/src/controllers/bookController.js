import pool from '../db.js';

export async function getBooksByStatus() {
    console.log("get books by status")
}

export async function getRecommendation() {
    console.log("get recommendation")
}

export async function searchBooks() {
    console.log("search books")
}

export async function addBook(req, res) {
    const { title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn } = req.body;
    const coverImg = req.file ? req.file.filename: null;

    try {
        await pool.query("INSERT INTO Books (title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, coverImg) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, coverImg])
        res.status(201).json({ message: "Book added successfully!" })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

export async function addReview() {
    console.log("add review")
}

export async function updateBook() {
    console.log("update book")
}

export async function updateReview() {
    console.log("update review")
}

export async function updateProfile() {
    console.log("update profile")
}

export async function deleteBook() {
    console.log("delete book")
}