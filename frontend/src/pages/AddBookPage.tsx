import { NavBar } from "../components/NavBar"
import { useState, useCallback } from "react"
import { AddSuccessPopup } from "../components/AddSuccessPopup"
import { AddFailurePopup } from "../components/AddFailurePopup"
import { Link } from "react-router-dom"
import { BasicBook } from "../components/BasicBook"

interface BookSearchResult {
    bookID: number,
    title: string,
    authorFirst: string,
    authorLast: string,
    coverSrc: string,
    rating?: string
}

export function AddBookPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [isSuccessPopup, setSuccessPopup] = useState<boolean>(false)
    const [isFailurePopup, setFailurePopup] = useState<boolean>(false)

    const debounce = (func: Function, delay: number) => {
        let timeoutId: number;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    };

    const performSearch = useCallback(debounce(async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setSearchError('');
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:4020/api/books/search?qu=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                setSearchResults(data.books || []);
            } else {
                setSearchError(data.message || 'Failed to fetch search results.');
                setSearchResults([]);
            }
        } catch (err) {
            console.error("Search error: ", err);
            setSearchError('Network error during search.');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, 500), []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchTerm(query);
        performSearch(query);
    };

    async function validateInput(event: React.FormEvent) {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const isbn = formData.get("isbn")?.toString();

        if (!isbn || isbn.length !== 13 || !isbn.startsWith("978")) {
            setFailurePopup(true);
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:4020/api/books/books", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessPopup(true);
                form.reset();
            } else {
                console.error("Add book failed:", data);
                setFailurePopup(true);
            }
        } catch(err) {
            console.error("Add book error:", err);
            setFailurePopup(true);
        }
    }

    return(
        <>
        <NavBar />
        <div id="add-book-div">
            <div id="add-book-div-left">
                <div id="add-book-search-div">
                    <label htmlFor="book-search">Search Books: </label>
                    <input id="book-search" type="search" value={searchTerm} onChange={handleSearchChange} />
                    <select id="search-by-dropdown" name="search-by" value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                        <option value="title" selected>Title</option>
                        <option value="author">Author (last name)</option>
                        <option value="isbn">ISBN</option>
                    </select>
                </div>
                <div className="mt-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                        {isLoading && searchTerm.length >= 3 && (
                            <div className="p-3 text-center text-blue-500">Searching...</div>
                        )}
                        {searchError && (
                            <div className="p-3 text-center text-red-500">{searchError}</div>
                        )}
                        {(!isLoading && searchResults.length === 0 && searchTerm.length >= 3 && !searchError) && (
                            <div className="p-3 text-center text-gray-500">No results found in your database. Try adding the book below.</div>
                        )}
                        {searchResults.map(book => {
                            const author = `${book.authorFirst} ${book.authorLast}`;
                            const fullCoverSrc = `http://localhost:4020/uploads/${book.coverSrc}`
                            const rating = book.rating || "N/A"

                            return(
                                <BasicBook
                                    key={book.bookID}
                                    bookID={book.bookID}
                                    title={book.title}
                                    author={author}
                                    coverSrc={fullCoverSrc}
                                    rating={rating}
                                />
                            )
                        })}
                </div>
                <div id="add-book-form-div">
                    <h3 id="add-book-header">Add Book</h3>
                    <form id="add-book-form" onSubmit={validateInput}>
                        <label htmlFor="title">Title: </label>
                        <input id="title" name="title" type="text" required />
                        <label htmlFor="author-first">Author First Name: </label>
                        <input id="author-first" name="authorFirst" type="text" />
                        <label htmlFor="author-last">Author Last Name: </label>
                        <input id="author-last" name="authorLast" type="text" required />
                        <label htmlFor="publisher">Publisher: </label>
                        <input id="publisher" name="publisher" type="text" />
                        <label htmlFor="publication-date">Publication Date: </label>
                        <input id="publication-date" name="publicationDate" type="date" />
                        <label htmlFor="page-count">Page Count: </label>
                        <input id="page-count" name="pageCount" type="number" />
                        <label htmlFor="isbn">ISBN-13: </label>
                        <input id="isbn" name="isbn" type="text" required />
                        <label htmlFor="synopsis">Synopsis: </label>
                        <input id="synopsis" name="synopsis" type="text" />
                        <label htmlFor="coverImg">Cover Image:</label>
                        <input id="coverImg" name="coverImg" type="file" accept="image/*" />
                        <button className="button-class" type="submit">Add Book</button>
                    </form>
                </div>
            </div>
            <div id="add-book-div-right">
                <p id="add-book-about">Add a book to the database here or add one to your books page! First, check if it is already present using the search bar at the top. Make sure all required fields are filled out and correct, but if there is anything off, books can be edited from their 'more information' link. Thank you!</p>
            </div>
        </div>

        <AddSuccessPopup isOpen={isSuccessPopup} onClose={() => setSuccessPopup(false)} />
        <AddFailurePopup isOpen={isFailurePopup} onClose={() => setFailurePopup(false)} />
        </>
    )
}