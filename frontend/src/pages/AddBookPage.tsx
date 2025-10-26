import { NavBar } from "../components/NavBar"
import { useState } from "react"
import { AddSuccessPopup } from "../components/AddSuccessPopup"
import { AddFailurePopup } from "../components/AddFailurePopup"

export function AddBookPage() {
    const [isSuccessPopup, setSuccessPopup] = useState<boolean>(false)
    const [isFailurePopup, setFailurePopup] = useState<boolean>(false)

    async function validateInput(event: React.FormEvent) {
        event.preventDefault();
        
        const form = event.target as HTMLFormElement
        const formData = new FormData(form);

        try {
            const response = await fetch("/api/books", {
            method: "POST",
            body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessPopup(true)
            } else {
                setFailurePopup(true)
            }
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <>
        <NavBar />
        <div id="add-book-div">
            <div id="add-book-div-left">
                <div id="add-book-search-div">
                    <label htmlFor="book-search">Search Books: </label>
                    <input id="book-search" type="search" />
                    <select id="search-by-dropdown" name="search-by">
                        <option value="title" selected>Title</option>
                        <option value="author">Author (last name)</option>
                        <option value="isbn">ISBN</option>
                    </select>
                </div>
                <div id="add-book-form-div">
                    <h3 id="add-book-header">Add Book</h3>
                    <form id="add-book-form" onSubmit={validateInput}>
                        <label htmlFor="title">Title: </label>
                        <input id="title" name="title" type="text" />
                        <label htmlFor="author-first">Author First Name: </label>
                        <input id="author-first" name="authorFirst" type="text" />
                        <label htmlFor="author-last">Author Last Name: </label>
                        <input id="author-last" name="authorLast" type="text" />
                        <label htmlFor="publisher">Publisher: </label>
                        <input id="publisher" name="publisher" type="text" />
                        <label htmlFor="publication-date">Publication Date: </label>
                        <input id="publication-date" name="publicationDate" type="date" />
                        <label htmlFor="page-count">Page Count: </label>
                        <input id="page-count" name="pageCount" type="number" />
                        <label htmlFor="isbn">ISBN-13: </label>
                        <input id="isbn" name="isbn" type="text" required />
                        <label htmlFor="coverImg">Cover Image:</label>
                        <input id="coverImg" name="coverImg" type="file" accept="image/*" />
                        <button className="button-class" type="submit">Add Book</button>
                    </form>
                </div>
            </div>
            <div id="add-book-div-right">
                <p id="add-book-about">Add a book to the database here! First, check if it is already present using the search bar at the top. Make sure all required fields are filled out and correct, but if there is anything off, books can be edited from their 'more information' link. Thank you!</p>
            </div>
        </div>

        <AddSuccessPopup isOpen={isSuccessPopup} onClose={() => setSuccessPopup(false)} />
        <AddFailurePopup isOpen={isFailurePopup} onClose={() => setFailurePopup(false)} />
        </>
    )
}