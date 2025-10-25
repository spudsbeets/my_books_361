import { NavBar } from "../components/NavBar"
import { BasicBook } from "../components/BasicBook"

export function YourBooksPage() {
    return(
        <>
        <NavBar />
        <div id="your-books-div">
            <div id="your-books-left-div">
                <div className="your-books-sub-div">
                    <p className="your-books-header">Currently Reading</p>
                    <div className="your-books-container">
                        <BasicBook title="Wise Man's Fear" author="Patrick Rothfuss" coverSrc="../src/images/wise-mans-fear.png" stars="No Review" />
                        <BasicBook title="Meditations" author="Marcus Aurelius" coverSrc="../src/images/meditations.png" stars="No Review" />
                    </div>
                </div>
                <div className="your-books-sub-div">
                    <p className="your-books-header">Past Reads</p>
                    <div className="your-books-container">
                        <BasicBook title="One Hundred Years of Solitude" author="Gabriel Garcia Marquez" coverSrc="../src/images/100-years-of-solitude.png" stars="⭐⭐⭐⭐⭐" />
                        <BasicBook title="Dungeon Crawler Carl" author="Matt Dinniman" coverSrc="../src/images/dungeon-crawler-carl.png" stars="⭐⭐⭐" />
                        <BasicBook title="Stoner" author="John Williams" coverSrc="../src/images/stoner.png" stars="⭐⭐⭐⭐⭐" />
                        <BasicBook title="Slaughterhouse Five" author="Kurt Vonnegut" coverSrc="../src/images/slaughterhouse-five.png" stars="⭐⭐⭐⭐" />
                        <BasicBook title="Intermezzo" author="Sally Rooney" coverSrc="../src/images/intermezzo.png" stars="⭐⭐⭐⭐" />
                    </div>
                </div>
                <div className="your-books-sub-div">
                    <p className="your-books-header">Wishlist</p>
                    <div className="your-books-container">
                        <BasicBook title="Gravity's Rainbow" author="Thomas Pynchon" coverSrc="../src/images/gravitys-rainbow.png" stars="No Review" />
                        <BasicBook title="Blood Meridian" author="Cormac McCarthy" coverSrc="../src/images/blood-meridian.png" stars="No Review" />
                        <BasicBook title="Ulysses" author="James Joyce" coverSrc="../src/images/ulysses.png" stars="No Review" />
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