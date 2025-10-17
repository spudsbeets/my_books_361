import { Link } from 'react-router-dom';

export function LoginPage() {
    return(
        <div className="open-div">
            <div className="open-div-left">
                <img src="../src/images/open-book.png" alt="open-book" />
            </div>
            <div className="open-div-center">
                <h1 id="login-header">Welcome to MyBooks!</h1>
                <h2 id="login-subheader">Create an account if you don't have one or login below.</h2>
                <form id="login-form">
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" />
                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" />
                    <Link to="/home" id="login-link"><button className="submit-button">Login</button></Link>
                </form>
                <Link to="/createAccount">Don't have an account? Create one here!</Link>
            </div>
            <div className="open-div-right">
                <p className="open-about">Use this site to track your reading progress, write reviews, get recommendations, and more!</p>
            </div>
        </div>
    )
}