import { NavBar } from "../components/NavBar"
import { useState } from "react"
import { EditFailurePopup } from "../components/EditFailurePopup"
import { EditSuccessPopup } from "../components/EditSuccessPopup"

export function EditBookPage() {
    const [isSuccessPopup, setSuccessPopup] = useState<boolean>(false)
    const [isFailurePopup, setFailurePopup] = useState<boolean>(false)

    function validateInput(event: React.FormEvent): void {
        event.preventDefault()
        
        const input = document.getElementById("isbn-edit") as HTMLInputElement

        if (isNaN(Number(input.value)) || input.value.length === 0) {
            setFailurePopup(true)
        } else {
            setSuccessPopup(true)
        }
    }

    return(
        <>
        <NavBar />
        <div id="edit-book-div">
            <div id="edit-book-div-left">
                <div id="edit-book-form-div">
                    <h3 id="edit-book-header">Edit Book</h3>
                    <form id="edit-book-form" onSubmit={validateInput}>
                        <label htmlFor="title-edit">Title: </label>
                        <input id="title-edit" name="title" type="text" required />
                        <label htmlFor="author-first-edit">Author First Name: </label>
                        <input id="author-first-edit" name="authorFirst" type="text" />
                        <label htmlFor="author-last-edit">Author Last Name: </label>
                        <input id="author-last-edit" name="authorLast" type="text" required />
                        <label htmlFor="publisher-edit">Publisher: </label>
                        <input id="publisher-edit" name="publisher" type="text" />
                        <label htmlFor="publication-date-edit">Publication Date: </label>
                        <input id="publication-date-edit" name="publicationDate" type="date" />
                        <label htmlFor="page-count-edit">Page Count: </label>
                        <input id="page-count-edit" name="pageCount" type="number" />
                        <label htmlFor="isbn-edit">ISBN-13: </label>
                        <input id="isbn-edit" type="text" name="isbn" required />
                        <label htmlFor="synopsis-edit">Synopsis: </label>
                        <input id="synopsis-edit" name="synopsis" type="text" />
                        <label htmlFor="coverImg-edit">Cover Image:</label>
                        <input id="coverImg-edit" name="coverImg" type="file" accept="image/*" />
                        <button className="button-class" type="submit">Update Book</button>
                    </form>
                </div>
            </div>
            <div id="edit-book-div-right">
                <p id="edit-book-about">Update the infomation about a book here! Go ahead and edit the fields in the form then hit the 'update book' button.</p>
            </div>
        </div>

        <EditSuccessPopup isOpen={isSuccessPopup} onClose={() => setSuccessPopup(false)} />
        <EditFailurePopup isOpen={isFailurePopup} onClose={() => setFailurePopup(false)} />
        </>
    )
}