import { useState } from "react"
import { Link, useNavigate } from 'react-router-dom';

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const res = await fetch("http://localhost:4020/api/auth/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);

            navigate("/home");
        } catch(err) {
            console.log(err)
            setError("We're having issues, try again.")
        }
    }

    return(
        <div className="open-div">
            <div className="open-div-left">
                <img src="../src/images/open-book.png" alt="open-book" />
            </div>
            <div className="open-div-center">
                <h1 id="login-header">Welcome to MyBooks!</h1>
                <h2 id="login-subheader">Create an account if you don't have one or login below.</h2>
                <form id="login-form" onSubmit={handleLogin}>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="button-class" type="submit">Login</button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <Link to="/createAccount">Don't have an account? Create one here!</Link>
            </div>
            <div className="open-div-right">
                <p className="open-about">Use this site to track your reading progress, write reviews, get recommendations, and more!</p>
            </div>
        </div>
    )
}