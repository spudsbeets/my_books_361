import { Link } from "react-router-dom"

export function CreateAccountPage() {
    return(
        <div className="open-div">
            <div className="open-div-left">
                <img src="../src/images/open-book.png" alt="open-book" />
            </div>
            <div className="open-div-center">
                <h2 id="create-header">Create your account and get started tracking your reading!</h2>
                <form id="create-form">
                    <label htmlFor="first-name">First Name: </label>
                    <input id="first-name" type="text" required />
                    <label htmlFor="last-name">Last Name: </label>
                    <input id="last-name" type="text" required />
                    <label htmlFor="birthdate">Birthdate: </label>
                    <input id="birthdate" type="date" required />
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" required />
                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" required />
                    <label htmlFor="confirm-password">Confirm Password: </label>
                    <input id="confirm-password" type="password" required />
                    <Link to="/home" id="create-link"><button className="button-class">Create Account</button></Link>
                </form>
            </div>
            <div className="open-div-right">
                <p className="open-about">Use this site to track your reading progress, write reviews, get recommendations, and more!</p>
            </div>
        </div>
    )
}