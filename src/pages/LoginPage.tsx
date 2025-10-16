import { Link } from 'react-router-dom';

export function LoginPage() {
    return(
        <div id="login-div">
            <h1>Welcome to MyBooks!</h1>
            <h2>Create an account if you don't have one or login below.</h2>
            <form id="login-form">
                <label htmlFor="email">Email: </label>
                <input id="email" type="email" />
                <label htmlFor="password">Password: </label>
                <input id="password" type="password" />
                <Link to="/home"><button className="submit-button">Login</button></Link>
            </form>
            <Link to="/createAccount">Create an account</Link>
        </div>
    )
}