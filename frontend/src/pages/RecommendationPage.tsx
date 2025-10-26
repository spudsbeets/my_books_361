import { NavBar } from "../components/NavBar"
import { BasicBook } from "../components/BasicBook"
import { useState } from "react"

export function RecommendationPage() {
    const [mode, setMode] = useState<"random" | "curated">("random")
    const [hasRecommendation, setHasRecommendation] = useState<boolean>(false);

    function handleRandomMode() {
        setMode("random")
        setHasRecommendation(false)
    }

    function handleCuratedMode() {
        setMode("curated")
        setHasRecommendation(false)
    }

    function handleGetRecommendation(event: React.FormEvent) {
        event.preventDefault();
        setHasRecommendation(true);
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
                <button className="button-class" onClick={() => setHasRecommendation(true)}>Get Recommendation</button>
                <div id="curated-recommendation-div">
                    <form id="curated-recommendation-form" onSubmit={handleGetRecommendation} style={{
                        visibility: mode === "curated" ? "visible" : "hidden",
                        opacity: mode === "curated" ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        height: mode === "curated" ? "auto" : 0,
                        overflow: "hidden",
                    }}>
                        <label htmlFor="genre-dropdown-1">Genre 1: </label>
                        <select id="genre-dropdown-1" name="genre1">
                            <option value="fantasy">Fantasy</option>
                            <option value="sci-fi" selected>Sci Fi</option>
                            <option value="classics">Classics</option>
                            <option value="history">History</option>
                            <option value="manga">Manga</option>
                        </select>
                        <label htmlFor="genre-dropdown-2">Genre 2: </label>
                        <select id="genre-dropdown-2" name="genre2">
                            <option value="fantasy" selected>Fantasy</option>
                            <option value="sci-fi">Sci Fi</option>
                            <option value="classics">Classics</option>
                            <option value="history">History</option>
                            <option value="manga">Manga</option>
                        </select>
                        <button className="button-class" type="submit">Get Curated Recommendation</button>
                    </form>
                    <div id="given-recommendation-div" style={{
                        visibility: hasRecommendation ? "visible" : "hidden",
                        opacity: hasRecommendation ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        height: hasRecommendation ? "auto" : 0,
                        overflow: "hidden",
                    }}>
                        <h3>Your Recommendation!</h3>
                        <BasicBook title="Moby Dick" author="Herman Melville" coverSrc="../src/images/moby-dick.png" stars="No Review" />
                    </div>
                </div>
            </div>
            <div id="recommendation-div-right">
                <p id="recommendation-about">Looking for a new book to read? You've come to the right place. Choose between the two different modes (random or curated), fill out some of your preferences if you want a curated recommendation or just get a purely random one!</p>
            </div>
        </div>
        </>
    )
}