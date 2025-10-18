import { NavBar } from "../components/NavBar"
import { Link } from "react-router-dom"
import { useState } from "react"
import { DeletePopup } from "../components/DeletePopup"
import { UpdateReviewPopup } from "../components/UpdateReviewPopup"

export function BookInfoPage() {
    const [isDeletePopup, setDeletePopup] = useState<boolean>(false)
    const [isReviewPopup, setReviewPopup] = useState<boolean>(false)

    return(
        <>
        <NavBar />
        <div id="book-info-div">
            <div id="book-info-left-div">
                <h3 className="book-title-info">Intermezzo</h3>
                <img className="book-cover-info" src="../src/images/intermezzo.png" alt="itermezzo-cover" />
                <h4 className="book-author-info">Sally Rooney</h4>
                <div className="book-info-extra-info">
                    <p className="book-publisher-info">Publisher: Faber & Faber</p>
                    <p className="book-publication-date-info">Publication Date: 09-24-24</p>
                    <p className="book-page-count-info">Page Count: 448 pgs</p>
                    <p className="book-isbn-info">ISBN-13: 9780571365463</p>
                </div>
                <div className="delete-and-edit-div">
                    <button className="button-class" onClick={() => setDeletePopup(true)}>Delete</button>
                    <Link to="/editBook"><button className="button-class">Edit</button></Link>
                </div>
            </div>
            <div id="book-info-center-div">
                <div className="book-info-synopsis-div">
                    <p className="book-synopsis-info">Intermezzo follows two brothers, Peter and Ivan Koubek, navigating the aftermath of their father's death in Dublin and rural Ireland. Peter, a 32-year-old human rights lawyer, grapples with his relationships with Naomi, a younger college student, and Sylvia, his ex-girlfriend. Meanwhile, 22-year-old Ivan, a former chess prodigy, embarks on a discreet relationship with Margaret, a 36-year-old arts program director. The novel delves into themes of grief, age-gap relationships, sibling dynamics, and power structures in romantic relationships. </p>
                </div>
                <div className="book-status-div">
                    <button className="button-class">Update Book Status</button>
                    <select id="book-status-dropdown" name="status-update">
                        <option value="read">Read</option>
                        <option value="not-read" selected>Not Read</option>
                        <option value="currently-reading">Currently Reading</option>
                        <option value="wishlist">Wishlist</option>
                    </select>
                </div>
            </div>
            <div id="book-info-right-div">
                <div className="personal-review-div">
                    <p className="star-count-info">⭐⭐⭐⭐</p>
                    <p className="personal-review-info">I found Intermezzo to be a fascinating read, a deep look into the ways that culture influences masculinity and romantic relationships. Parts of it made me kind of uncomfortable... but in a good way?</p>
                </div>
                <button className="button-class" onClick={() => setReviewPopup(true)}>Update Review</button>
            </div>
        </div>
        
        <DeletePopup isOpen={isDeletePopup} onClose={() => setDeletePopup(false)} />
        <UpdateReviewPopup isOpen={isReviewPopup} onClose={() => setReviewPopup(false)} />
        </>
    )
}