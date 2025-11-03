import pool from '../db.js';
import { authenticate } from "../middleware/authMiddleware.js"


// GET Controllers

// ROUTE: router.get("/books", authenticate, getBooksByStatus);
// PURPOSE: Get all the books categorized by a current status (i.e. Wishlist, Reading, Read) at once.
export async function getBooksByStatus(req, res) {
    try {
        const userID = req.user.id;
        const { status } = req.query; // i.e. ?status=wishlist

        if (!status) {
            return res.status(400).json({ message: "Status query is required." })
        }

        const query = `
            SELECT b.bookID, b.title, b.authorFirst, b.authorLast, b.coverImg AS coverSrc, ub.status, ub.completedAt, ur.rating
            FROM UserBooks ub
            JOIN Books b ON ub.bookID = b.bookID
            LEFT JOIN UserReviews ur ON ub.bookID = ur.bookID AND ub.userID = ur.userID
            WHERE ub.UserID = ? AND ub.status = ?
        `;

        const result = await pool.query(query, [userID, status]);

        res.status(200).json({ books: result[0] });
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

// ROUTE: router.get("/users", authenticate, getUser);
// PURPOSE: Get a user from the database.
export async function getUser(req, res) {
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized: missing user ID" });
        }

        const query = `
            SELECT userID, firstName, lastName, birthdate, email
            FROM Users
            WHERE userID = ?            
        `;

        const [rows] = await pool.execute(query, [userID]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(rows[0]);
    } catch(err) {
        console.error("getUser error:", err);
        res.status(500).json({ message: "Server error" })        
    }
}

// ROUTE: router.get("/books/:bookID", authenticate, getSingleBook);
// PURPOSE: Get a book from the database by ID.
export async function getSingleBook(req, res) {
    try {
        const { bookID } = req.params;

        const [rows] = await pool.query(
            `SELECT b.bookID, b.title, b.authorFirst, b.authorLast, b.coverImg as coverSrc, b.publisher, DATE_FORMAT(b.publicationDate, '%Y-%m-%d') AS publicationDate, b.pageCount, b.isbn, b.genre, b.synopsis
            FROM Books b WHERE bookID = ?`,
            [bookID]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Book not found"} );
        const book = rows[0];
        res.status(200).json(book); 
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// ROUTE: router.get("/userBooks/:bookID", authenticate, getUserBookStatus);
// PURPOSE: Get the book status for a single book in the user's catalog by ID.
export async function getUserBookStatus(req, res) {
    try {
        const userID = req.user.id;
        const { bookID } = req.params;

        const [rows] = await pool.query(
            "SELECT status FROM UserBooks WHERE userID = ? AND bookID = ?",
            [userID, bookID]
        )

        if (rows.length === 0) return res.status(200).json({ status: "not-read" });

        res.status(200).json({ status: rows[0].status });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// ROUTE: router.get("/stats", authenticate, getUserStats);
// PURPOSE: Get the user's reading stats, current reads, and recent reads for the homepage.
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

// ROUTE: router.get("/recommendation", authenticate, getRecommendation);
// PURPOSE: Get a recommendation from the database, either randomly, or based off genre preference. 
export async function getRecommendation(req, res) {
    try {
        const { genre1, genre2 } = req.query;
        const userID = req.user.id;

        let query = `
            SELECT b.*
            FROM Books b
            LEFT JOIN UserBooks ub ON b.bookID = ub.bookID AND ub.userID = ?
            WHERE ub.status IS NULL OR ub.status NOT IN ('read', 'reading')
            `
        const params = [userID];

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

        let [rows] = await pool.execute(query, params);
        if (rows.length == 0) {
            const fallbackQuery = `
                SELECT b.*
                FROM Books b
                LEFT JOIN UserBooks ub ON b.bookID = ub.bookID AND ub.userID = ?
                WHERE ub.status IS NULL OR ub.status NOT IN ('read', 'reading')
                ORDER BY RAND() LIMIT 1
            `
            const [randomRows] = await pool.execute(fallbackQuery, [userID]);
            rows = randomRows;
        }

        res.status(200).json({ books: rows[0] })
    } catch(err) {
        res.status(500).json({ message: "Server error" });
    }
}

// ROUTE: router.get("/userReviews/:bookID", authenticate, getUserReview);
// PURPOSE: Get a user's review by bookID. 
export async function getUserReview(req, res) {
    try {
        const userID = req.user.id;
        const { bookID } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM UserReviews WHERE bookID = ? AND userID = ?",
            [bookID, userID]
        );

        if (rows.length === 0) {
            return res.status(200).json({ rating: 0, reviewText: "" });
        }

        return res.status(200).json(rows[0]);

    } catch(err) {
        res.status(500).json({ message: "Server error" });
    }
}

// ROUTE: router.get("/search", authenticate, searchBooks);
// PURPOSE: Search for books in the database by author last name, title, and ISBN concurrently.
export async function searchBooks(req, res) {
    try {
        const { qu } = req.query;

        if (!qu) {
            return res.status(400).json({ message: "Some query is required." });
        }

        const searchQuery = `
            SELECT bookID, title, authorFirst, authorLast, coverImg AS coverSrc 
            FROM Books
            WHERE title LIKE ?
                OR authorLast LIKE ?
                OR isbn LIKE ?
        `;

        const wildcardQuery = `%${qu}%`;
        const [rows] = await pool.query(searchQuery, [wildcardQuery, wildcardQuery, wildcardQuery]);
        res.status(200).json({ books: rows });
    } catch(err) {
        res.status(500).json({ message: "Server error" })
    }
}

// POST Controllers

// ROUTE: router.post("/books", authenticate, upload.single("coverImg"), addBook);
// PURPOSE: Allows user to add a book to the database.
export async function addBook(req, res) {
    const { title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, genre, synopsis } = req.body;
    const coverImg = req.file ? req.file.filename: null;

    try {
        await pool.query("INSERT INTO Books (title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, genre, synopsis, coverImg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [title, authorFirst, authorLast, publisher, publicationDate, pageCount, isbn, genre, synopsis, coverImg])
        res.status(201).json({ message: "Book added successfully!" })
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

// ROUTE: router.post("/books/:bookID/review", authenticate, addReview);
// PURPOSE: Allows user to add a review to a book in their catalog.
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

// PUT Controllers

// ROUTE: router.put("/books/:bookID", authenticate, upload.single("coverImg"), updateBook);
// PURPOSE: Allows user to update a book in the database.
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
            synopsis
        } = req.body;

        const coverImg = req.file ? req.file.filename : null;

        const fields = [];
        const values = [];

        if (title) { fields.push('title = ?'); values.push(title); }
        if (authorFirst) { fields.push('authorFirst = ?'); values.push(authorFirst); }
        if (authorLast) { fields.push('authorLast = ?'); values.push(authorLast); }
        if (publisher) { fields.push('publisher = ?'); values.push(publisher); }
        if (publicationDate) { fields.push('publicationDate = ?'); values.push(publicationDate); }
        if (pageCount) { fields.push('pageCount = ?'); values.push(Number(pageCount)); }
        if (isbn) { fields.push('isbn = ?'); values.push(isbn); }
        if (genre) { fields.push('genre = ?'); values.push(genre); }
        if (synopsis) { fields.push('synopsis = ?'); values.push(synopsis); }
        if (coverImg) { fields.push('coverImg = ?'); values.push(coverImg); }

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

// ROUTE: router.put("/users/profile", authenticate, updateProfile);
// PURPOSE: Allows user to update their profile information in the database.
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

// PATCH Controllers

// ROUTE: router.patch("/userBooks/:bookID", authenticate, updateUserBookStatus);
// PURPOSE: Update the status of a book in the user's catalog (i.e. Wishlist, Reading, Read).
export async function updateUserBookStatus(req, res) {
    try {
        const { bookID } = req.params;
        const { status } = req.body;
        const userID = req.user.id;

        if (!status) return res.status(400).json({ message: "Status is required" });

        const completedAt = status === "read" ? new Date() : null;

        const [rows] = await pool.query(
            "SELECT * FROM UserBooks WHERE userID = ? AND bookID = ?",
            [userID, bookID]
        );

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO UserBooks (userID, bookID, completedAt, status) VALUES (?, ?, ?, ?)",
                [userID, bookID, completedAt, status]
            );
        } else {
            await pool.query(
                "UPDATE UserBooks SET status = ?, completedAt = ? WHERE userID = ? AND bookID = ?",
                [status, completedAt, userID, bookID]
            );
        }

        res.status(200).json({ message: "Book status updated successfully" });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });        
    }
}

// ROUTE: router.patch("/userReviews/:bookID", authenticate, updateUserReview);
// PURPOSE: Update a user's review of a book in the database.
export async function updateUserReview(req, res) {
    try {
        const userID = req.user.id;
        const { bookID } = req.params;
        const { rating, reviewText } = req.body;

        if (rating === undefined && reviewText === undefined) {
            return res.status(400).json({ message: "Nothing to update." });
        }

        const [updateResults] = await pool.query(
            `
            UPDATE UserReviews
            SET rating = COALESCE(?, rating),
                reviewText = COALESCE(?, reviewText)
            WHERE userID = ? AND bookID = ?
            `,
            [rating, reviewText, userID, bookID]
        );

        if (updateResults.affectedRows === 0) {
            await pool.query(
                `
                INSERT INTO UserReviews (userID, bookID, rating, reviewText)
                VALUES (?, ?, ?, ?)
                `,
                [userID, bookID, rating, reviewText]
            );
            return res.status(201).json({ message: "Review created successfully." });
        } 

        res.status(200).json({ message: "Review updated successfully." });

    } catch(err) {
        res.status(500).json({ message: "Server error." })
    }
}

// DELETE Controllers

// ROUTE: router.delete("/books/:bookID", authenticate, deleteBook);
// PURPOSE: Delete a book from the database.
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