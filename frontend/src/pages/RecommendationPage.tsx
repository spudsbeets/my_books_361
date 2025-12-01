import { NavBar } from "../components/NavBar"
import { BasicBook } from "../components/BasicBook"
import { useState } from "react"
import type BasicBookProps from "../interfaces/BasicBookProps"

export function RecommendationPage() {
    const [mode, setMode] = useState<"random" | "curated">("random")
    const [hasRecommendation, setHasRecommendation] = useState<boolean>(false);
    const [genre1, setGenre1] = useState("sci-fi");
    const [genre2, setGenre2] = useState("fantasy");
    const [recommendedBook, setRecommendedBook] = useState<BasicBookProps | null>(null);

    const handleRandomMode = () => {
        setMode("random")
        setHasRecommendation(false)
    }

    const handleCuratedMode = () => {
        setMode("curated")
        setHasRecommendation(false)
    }

    const handleGetRecommendation = async(event: React.FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const url =
            mode === "random"
            ? "http://localhost:4020/api/books/recommendation"
            : `http://localhost:4020/api/books/recommendation?genre1=${genre1}&genre2=${genre2}`;

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) {
                console.error("Failed to fetch recommendation");
                return;
            }

            const data = await res.json();
            const book = data.books;

            setRecommendedBook({
                bookID: book.bookID,
                title: book.title,
                author: `${book.authorFirst} ${book.authorLast}`,
                coverSrc: `http://localhost:4020/uploads/${book.coverImg}`,
                rating: book.rating || "No Review"
            });

            setHasRecommendation(true);
        } catch (err) {
            console.error("Error fetching recommendation:", err);
        }
}

    return(
        <>
        <NavBar />
        <div id="recommendation-div">
            <div id="recommendation-div-left">
                <h2 id="recommendation-header">Recommendations!</h2>
                <div id="recommendation-mode-div">
                    <button className="button-class" onClick={handleRandomMode}>Random Recommendation Mode</button>
                    <button className="button-class" onClick={handleCuratedMode}>Curated Recommendation Mode</button>
                </div>
                <button className="button-class" onClick={handleGetRecommendation}>Get Recommendation</button>
                <div id="curated-recommendation-div">
                    <form id="curated-recommendation-form" onSubmit={handleGetRecommendation} style={{
                        visibility: mode === "curated" ? "visible" : "hidden",
                        opacity: mode === "curated" ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        height: mode === "curated" ? "auto" : 0,
                        overflow: "hidden",
                    }}>
                        <label htmlFor="genre-dropdown-1">Genre 1: </label>
                        <select id="genre-dropdown-1" name="genre1" value={genre1} onChange={(e) => setGenre1(e.target.value)}>
                            <option value="fantasy">Fantasy</option>
                            <option value="sci-fi" selected>Sci Fi</option>
                            <option value="classics">Classics</option>
                            <option value="history">History</option>
                            <option value="manga">Manga</option>
                        </select>
                        <label htmlFor="genre-dropdown-2">Genre 2: </label>
                        <select id="genre-dropdown-2" name="genre2" value={genre2} onChange={(e) => setGenre2(e.target.value)}>
                            <option value="fantasy" selected>Fantasy</option>
                            <option value="sci-fi">Sci Fi</option>
                            <option value="classics">Classics</option>
                            <option value="history">History</option>
                            <option value="manga">Manga</option>
                        </select>
                        <button className="button-class" type="submit">Get Curated Recommendation</button>
                    </form>
                    {hasRecommendation && recommendedBook && (<div id="given-recommendation-div" style={{
                        visibility: hasRecommendation ? "visible" : "hidden",
                        opacity: hasRecommendation ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        height: hasRecommendation ? "auto" : 0,
                        overflow: "hidden",
                    }}>
                        <h3>Your Recommendation!</h3>
                        <BasicBook bookID={recommendedBook.bookID} title={recommendedBook.title} author={recommendedBook.author} coverSrc={recommendedBook.coverSrc} rating={recommendedBook.rating} />
                    </div>)}
                </div>
            </div>
            <div id="recommendation-div-right">
                <p id="recommendation-about">Looking for a new book to read? You've come to the right place. Choose between the two different modes (random or curated), fill out some of your preferences if you want a curated recommendation or just get a purely random one!</p>
            </div>
        </div>
        </>
    )
}