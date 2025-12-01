import { NavBar } from "../components/NavBar"
import { useState } from "react"
import { EditFailurePopup } from "../components/EditFailurePopup"
import { EditSuccessPopup } from "../components/EditSuccessPopup"
import { useParams } from "react-router-dom"
import type EditBookProps from "../interfaces/EditBookProps"

export function EditBookPage() {
    const { bookID } = useParams<{ bookID: string }>();
    const [isSuccessPopup, setSuccessPopup] = useState<boolean>(false);
    const [isFailurePopup, setFailurePopup] = useState<boolean>(false);
    const [formData, setFormData] = useState<EditBookProps>({
        title: "",
        authorFirst: "",
        authorLast: "",
        publisher: "",
        publicationDate: "",
        pageCount: "",
        isbn: "",
        genre: "",
        synopsis: "",
        coverImg: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "coverImg" && files) {
            setFormData(prev => ({ ...prev, coverImg: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const form = new FormData();

            form.append("title", formData.title);
            form.append("authorFirst", formData.authorFirst);
            form.append("authorLast", formData.authorLast);
            form.append("publisher", formData.publisher);
            form.append("publicationDate", formData.publicationDate);
            form.append("pageCount", formData.pageCount);
            form.append("isbn", formData.isbn);
            form.append("genre", formData.genre);
            form.append("synopsis", formData.synopsis);
            if (formData.coverImg instanceof File) {
                form.append("coverImg", formData.coverImg)
            };

            const res = await fetch(`http://localhost:4020/api/books/books/${bookID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: form
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Book update failed: ", errorData.message);
                setFailurePopup(true);
                return;
            }

            setSuccessPopup(true);
        } catch(err) {
            console.error("book update failed.");
        }
    }

    return(
        <>
        <NavBar />
        <div id="edit-book-div">
            <div id="edit-book-div-left">
                <div id="edit-book-form-div">
                    <h3 id="edit-book-header">Edit Book</h3>
                    <form id="edit-book-form" onSubmit={handleSubmit}>
                        <label htmlFor="title-edit">Title: </label>
                        <input id="title-edit" name="title" type="text" value={formData.title} onChange={handleChange} />
                        <label htmlFor="author-first-edit">Author First Name: </label>
                        <input id="author-first-edit" name="authorFirst" type="text" value={formData.authorFirst} onChange={handleChange} />
                        <label htmlFor="author-last-edit">Author Last Name: </label>
                        <input id="author-last-edit" name="authorLast" type="text" value={formData.authorLast} onChange={handleChange} />
                        <label htmlFor="publisher-edit">Publisher: </label>
                        <input id="publisher-edit" name="publisher" type="text" value={formData.publisher} onChange={handleChange} />
                        <label htmlFor="publication-date-edit">Publication Date: </label>
                        <input id="publication-date-edit" name="publicationDate" type="date" value={formData.publicationDate} onChange={handleChange} />
                        <label htmlFor="page-count-edit">Page Count: </label>
                        <input id="page-count-edit" name="pageCount" type="number" value={formData.pageCount} onChange={handleChange} />
                        <label htmlFor="isbn-edit">ISBN-13: </label>
                        <input id="isbn-edit" type="text" name="isbn" value={formData.isbn} onChange={handleChange} />
                        <label htmlFor="genre-edit">Genre: </label>
                        <input id="genre-edit" type="text" name="genre" value={formData.genre} onChange={handleChange} />
                        <label htmlFor="synopsis-edit">Synopsis: </label>
                        <input id="synopsis-edit" name="synopsis" type="text" value={formData.synopsis} onChange={handleChange} />
                        <label htmlFor="coverImg-edit">Cover Image:</label>
                        <input id="coverImg-edit" name="coverImg" type="file" accept="image/*" onChange={handleChange} />
                        <button className="button-class" type="submit">Update Book</button>
                    </form>
                </div>
            </div>
            <div id="edit-book-div-right">
                <p id="edit-book-about">Update the infomation about a book here! Go ahead and edit the fields in the form then hit the 'update book' button.</p>
            </div>
        </div>

        {isSuccessPopup && bookID && <EditSuccessPopup isOpen={isSuccessPopup} bookID={bookID} />}
        <EditFailurePopup isOpen={isFailurePopup} onClose={() => setFailurePopup(false)} />
        </>
    )
}