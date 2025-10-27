import pool from '../db.js';
import { authenticate } from "../middleware/authMiddleware.js"

export async function getBooksByStatus(req, res) {
    try {
        const userID = req.user.id;
        const { status } = req.query; // i.e. ?status=wishlist

        if (!status) {
            return res.status(400).json({ message: "Status query is required." })
        }

        const query = `
            SELECT *
            FROM UserBooks
            WHERE UserID = ?
                AND status = ?
        `;

        const result = await pool.query(query, [userID, status]);
        res.status(200).json({ books: result.rows });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getUserStats(req, res) {
    const userID = req.user.id;

    try {
        const [allTimeRows] = await pool.query(
            "SELECT COUNT(*) AS allTimeRead FROM UserBooks WHERE userID = ? AND status = 'read'",
            [userID]
        );

        const [thisYearRows] = await pool.query(
            "SELECT COUNT(*) AS thisYearRead FROM UserBooks WHERE userID = ? AND status = 'read' AND YEAR(completedAt)=YEAR(CURDATE())",
            [userID]
        );

        const [currentRows] = await pool.query(
            `SELECT b.title
            FROM UserBooks ub
            JOIN Books b ON ub.bookID = b.bookID
            WHERE ub.userID=? AND ub.status='reading'
            LIMIT 2`,
            [userID]
        );

        const [recentRows] = await pool.query(
            `SELECT b.title
            FROM UserBooks ub
            JOIN Books b ON ub.bookID = b.bookID
            WHERE ub.userID=? AND ub.status='read'
            LIMIT 5`,
            [userID]
        );

        res.json({ 
            allTimeRead: allTimeRows[0].allTimeRead,
            thisYearRead: thisYearRows[0].thisYearRead,
            currentReads: currentRows.map(r => r.title),
            recentReads: recentRows.map(r => r.title) 
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user stats" });
    }
}

export async function getRecommendation(req, res) {
    try {
        const { genre1, genre2 } = req.query;

        let query = `SELECT * FROM BOOKS`
        const params = [];

        if (genre1 || genre2) {
            const conditions = [];
            if (genre1) {
                conditions.push(`genre = ?`)
                params.push(genre1)
            }
            if (genre2) {
                conditions.push(`genre = ?`)
                params.push(genre2)
            }
            query += ` WHERE ` + conditions.join(" OR ");
        }

        query += ` ORDER BY RAND() LIMIT 1`;

        const [rows] = await pool.execute(query, params);
        if (rows.length == 0) {
            const [randomRows] = await pool.execute(`SELECT * FROM Books ORDER BY RAND() LIMIT 1`);
            rows = randomRows;
        }

        res.status(200).json({ books: rows[0] })
    } catch(err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function searchBooks(req, res) {
    try {
        const { qu } = req.query; // i.e. ?qu=search term

        if (!qu) {
            return res.status(400).json({ message: "Some query is required." });
        }

        // Uses case insensitive search (Like)
        const searchQuery = `
            SELECT * 
            FROM Books
            WHERE title LIKE ?
                OR authorLast LIKE ?
                OR isbn = ?
        `;

        const result = await pool.query(searchQuery, [`%${q}%`, `%${q}%`, q]); // % for partial match
        res.status(200).json({ books: result.rows });
    } catch(err) {
        res.status(500).json({ message: "Server error" })
    }
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

export async function addReview(req, res) {
    try {
        const userID = req.user.id;
        const { bookID } = req.params;
        const { rating, reviewText } = req.body;

        const query = `
            INSERT INTO UserReviews (userID, bookID, rating, reviewText)
            VALUES (?, ?, ?, ?)
        `;
        await pool.execute(query, [userID, bookID, rating, reviewText] || null);

        res.status(201).json({ message: "Review added successfully." });
    } catch(err) {
        res.status(500).json({ message: "Server error." });
    }
}

export async function updateBook(req, res) {
    try {
        const { bookID } = req.params;
        const {
            title,
            authorFirst,
            authorLast,
            publisher,
            publicationDate,
            pageCount,
            isbn,
            genre,
            synopsis,
            coverImg
        } = req.body;

        const fields = [];
        const values = [];

        if (title !== undefined) { fields.push('title = ?'); values.push(title); }
        if (authorFirst !== undefined) { fields.push('authorFirst = ?'); values.push(authorFirst); }
        if (authorLast !== undefined) { fields.push('authorLast = ?'); values.push(authorLast); }
        if (publisher !== undefined) { fields.push('publisher = ?'); values.push(publisher); }
        if (publicationDate !== undefined) { fields.push('publicationDate = ?'); values.push(publicationDate); }
        if (pageCount !== undefined) { fields.push('pageCount = ?'); values.push(pageCount); }
        if (isbn !== undefined) { fields.push('isbn = ?'); values.push(isbn); }
        if (genre !== undefined) { fields.push('genre = ?'); values.push(genre); }
        if (synopsis !== undefined) { fields.push('synopsis = ?'); values.push(synopsis); }
        if (coverImg !== undefined) { fields.push('coverImg = ?'); values.push(coverImg); }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }

        const query = `
            UPDATE Books
            SET ${fields.join(', ')}
            WHERE bookID = ?
        `;

        values.push(bookID);

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.status(200).json({ message: "Book updated successfully." });

    } catch(err) {
        res.status(500).json({ message: "Server error." });
    }
}

export async function updateReview(req, res) {
    try {
        const userID = req.user.id;
        const { bookID } = req.params;
        const { rating, reviewText } = req.body;

        if (rating === undefined && reviewText === undefined) {
            return res.status(400).json({ message: "Nothing to update." });
        }

        const fields = [];
        const values = [];

        if (rating !== undefined) {
            fields.push("rating = ?");
            values.push(rating);
        }
        if (reviewText !== undefined) {
            fields.push("reviewText = ?");
            values.push(reviewText);
        }

        const query = `
            UPDATE UserReviews
            SET ${fields.join(", ")}
            WHERE userID = ? AND bookID = ?
        `;
        values.push(userID, bookID);

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found." });
        }

        res.status(200).json({ message: "Review updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "Server error." })
    }
}

export async function updateProfile(req, res) {
    try {
        const userID = req.user.id;
        const { firstName, lastName, birthdate, email } = req.body;

        const fields = [];
        const values = [];

        if (firstName !== undefined) { fields.push('firstName = ?'); values.push(firstName); }
        if (lastName !== undefined) { fields.push('lastName = ?'); values.push(lastName); }
        if (birthdate !== undefined) { fields.push('birthdate = ?'); values.push(birthdate); }
        if (email !== undefined) { fields.push('email = ?'); values.push(email); }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields provided for update." });
        }
        
        const query = `
            UPDATE Users
            SET ${fields.join(', ')}
            WHERE userID = ?
        `;

        values.push(userID);

        const [result] = await pool.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully." });
    } catch(err) {
        res.status(500).json({ message: "Server error." });
    }
}

export async function deleteBook(req, res) {
    try {
        const { bookID } = req.params;

        const query = `DELETE FROM Books WHERE bookID = ?`;
        const [result] = await pool.execute(query, [bookID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found." })
        }

        res.status(200).json({ message: "Book deleted successfully." })
    } catch(err) {
        res.status(500).json({ message: "Server error." })
    }
}