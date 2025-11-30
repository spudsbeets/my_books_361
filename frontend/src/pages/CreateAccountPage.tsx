import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function CreateAccountPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5400/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || "Registration failed.");
                return;
            }

            const data = await res.json();

            if (data.token) {
                localStorage.setItem("token", data.token);
                navigate("/home");
            } else {
                setError("Registration succeeded but no token received.")
            }
        } catch(err) {
            console.error(err);
            setError("Unable to connect to server.");
        }
    }

    return(
        <div className="open-div">
            <div className="open-div-left">
                <img src="../src/images/open-book.png" alt="open-book" />
            </div>
            <div className="open-div-center">
                <h2 id="create-header">Create your account and get started tracking your reading!</h2>
                <form id="create-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password: </label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label htmlFor="confirm-password">Confirm Password: </label>
                    <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button className="button-class" type="submit">Create Account</button>
                </form>
            </div>
            <div className="open-div-right">
                <p className="open-about">Use this site to track your reading progress, write reviews, get recommendations, and more!</p>
            </div>
        </div>
    )
}