import { NavBar } from "../components/NavBar"
import { BasicBook } from "../components/BasicBook"
import { useEffect, useState } from "react"

interface Book {
    bookID: number,
    title: string,
    author: string,
    coverSrc: string,
    rating: string
}

export function YourBooksPage() {
    const [reading, setReading] = useState<Book[]>([]);
    const [read, setRead] = useState<Book[]>([]);
    const [wishlist, setWishlist] = useState<Book[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchBooks = async(status: string) => {
            const res = await fetch(`http://localhost:4020/api/books/books?status=${status}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            return data.books.map((b: any) => ({
                bookID: b.bookID,
                title: b.title,
                author: `${b.authorFirst} ${b.authorLast}`,
                coverSrc: `http://localhost:4020/uploads/${b.coverSrc}`,
                rating: b.rating ? '⭐'.repeat(b.rating) : "No Review"
            }));
        };

        const loadBooks = async() => {
            try {
                setReading(await fetchBooks("reading"));
                setRead(await fetchBooks("read"));
                setWishlist(await fetchBooks("wishlist"));
            } catch(err) {
                console.error("Error fetching books: ", err);
            }
        };

        loadBooks();

    },[]);

    const renderBooks = (books: Book[]) => books.map(b => 
        <BasicBook 
            key={b.bookID} 
            bookID={b.bookID}
            title={b.title}
            author={b.author}
            coverSrc={b.coverSrc}
            rating={b.rating} 
        />
    );

    return(
        <>
        <NavBar />
        <div id="your-books-div">
            <div id="your-books-left-div">
                <div className="your-books-sub-div">
                    <p className="your-books-header">Currently Reading</p>
                    <div className="your-books-container">
                        {renderBooks(reading)}
                    </div>
                </div>
                <div className="your-books-sub-div">
                    <p className="your-books-header">Past Reads</p>
                    <div className="your-books-container">
                        {renderBooks(read)}
                    </div>
                </div>
                <div className="your-books-sub-div">
                    <p className="your-books-header">Wishlist</p>
                    <div className="your-books-container">
                        {renderBooks(wishlist)}
                    </div>
                </div>
            </div>
            <div id="your-books-right-div">
                <p id="your-books-about">This page shows your current reads, recent reads, and wishlist. Click the more info link under the book to get all the relevant information, update its status or review, and more!</p>
            </div>
        </div>
        </>
    )
}