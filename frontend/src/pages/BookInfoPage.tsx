import { NavBar } from "../components/NavBar"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { DeletePopup } from "../components/DeletePopup"
import { UpdateReviewPopup } from "../components/UpdateReviewPopup"

interface Book {
    bookID: number,
    title: string,
    authorFirst: string,
    authorLast: string,
    coverSrc: string,
    publisher: string,
    publicationDate: string,
    pageCount: number,
    isbn: string,
    genre: string,
    synopsis: string,
    stars: string
}

export function BookInfoPage() {
    const { bookID } = useParams<{ bookID: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [isDeletePopup, setDeletePopup] = useState<boolean>(false)
    const [isReviewPopup, setReviewPopup] = useState<boolean>(false)
    const [bookStatus, setBookStatus] = useState<string>("not-read")
    const [userReview, setUserReview] = useState<{ rating: number; reviewText: string } | null>(null)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBook = async() => {
            const res = await fetch(`http://localhost:4020/api/books/books/${bookID}`, {
                headers: { Authorization: `Bearer ${token}`}
            });
            const data = await res.json();
            setBook({
                ...data,
                coverSrc: `http://localhost:4020/uploads/${data.coverSrc}`,
                stars: data.stars || "No Review"
            });
        };
                
        fetchBook();

        const fetchBookStatus = async() => {
            const res = await fetch(`http://localhost:4020/api/books/userBooks/${bookID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBookStatus(data.status || "not-read");
            } else {
                setBookStatus("not-read")
            }
        }

        fetchBookStatus();

        const fetchUserReview = async() => {
            const res = await fetch(`http://localhost:4020/api/books/userReviews/${bookID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUserReview( { rating: data.rating, reviewText: data.reviewText })
            } else {
                setUserReview(null)
            }
        }

        fetchUserReview();
    },[bookID])

    const handleDelete = async () => {
        if (!book) return;

        const token = localStorage.getItem("token");

        await fetch(`http://localhost:4020/api/books/books/${book.bookID}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        navigate("/home");
    }

    const handleStatusUpdate = async (newStatus: string) => {
        if (!book) return;

        const token = localStorage.getItem("token");

        try {
            await fetch(`http://localhost:4020/api/books/userBooks/${book.bookID}`, {
               method: "PATCH",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ status: newStatus})
            });
        } catch(err) {
            console.error("Failed to update book status", err);
        }
    }

    if (!book) return <p>loading...</p>;

    return(
        <>
        <NavBar />
        <div id="book-info-div">
            <div id="book-info-left-div">
                <h3 className="book-title-info">{book.title}</h3>
                <img className="book-cover-info" src={book.coverSrc} alt="book-cover" />
                <h4 className="book-author-info">{book.authorFirst + " " + book.authorLast}</h4>
                <div className="book-info-extra-info">
                    <p className="book-publisher-info">Publisher: {book.publisher}</p>
                    <p className="book-publication-date-info">Publication Date: {book.publicationDate}</p>
                    <p className="book-page-count-info">Page Count: {book.pageCount} pgs.</p>
                    <p className="book-isbn-info">ISBN-13: {book.isbn}</p>
                    <p className="book-genre-info">Genre: {book.genre}</p>
                </div>
                <div className="delete-and-edit-div">
                    <button className="button-class" onClick={() => setDeletePopup(true)}>Delete</button>
                    <Link to="/editBook"><button className="button-class">Edit</button></Link>
                </div>
            </div>
            <div id="book-info-center-div">
                <div className="book-info-synopsis-div">
                    <p className="book-synopsis-info">{book.synopsis}</p>
                </div>
                <div className="book-status-div">
                    <button className="button-class" onClick={() => handleStatusUpdate(bookStatus)}>Update Book Status</button>
                    <select id="book-status-dropdown" name="status-update" value={bookStatus} onChange={(e) => setBookStatus(e.target.value)}>
                        <option value="read">Read</option>
                        <option value="not-read">Not Read</option>
                        <option value="reading">Currently Reading</option>
                        <option value="wishlist">Wishlist</option>
                    </select>
                </div>
            </div>
            <div id="book-info-right-div">
                <div className="personal-review-div">
                    <p className="star-count-info">{userReview ? "★".repeat(userReview.rating) + "☆".repeat(5 - userReview.rating) : "No rating yet"}</p>
                    <p className="personal-review-info">{userReview ? userReview.reviewText : null}</p>
                </div>
                <button className="button-class" onClick={() => setReviewPopup(true)}>Update Review</button>
            </div>
        </div>
        
        <DeletePopup isOpen={isDeletePopup} onClose={() => setDeletePopup(false)} onConfirm={handleDelete} />
        <UpdateReviewPopup isOpen={isReviewPopup} onClose={() => setReviewPopup(false)} bookID={book.bookID} currentReview={userReview} onReviewUpdate={() => {
            const token = localStorage.getItem("token");
            fetch(`http://localhost:4020/api/books/userReviews/${book.bookID}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => res.json())
            .then(data => {
                if (data) setUserReview({ rating: data.rating, reviewText: data.reviewText })
            });    
        }
        }/>
        </>
    )
}