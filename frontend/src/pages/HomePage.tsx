import { NavBar } from "../components/NavBar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function HomePage() {
    const [allTimeRead, setAllTimeRead] = useState<number>(0);
    const [thisYearRead, setThisYearRead] = useState<number>(0);
    const [currentReads, setCurrentReads] = useState<string[]>([]);
    const [recentReads, setRecentReads] = useState<string[]>([]);
    const [currentTime, setCurrentTime] = useState<string>("");
    const [timezone, setTimezone] = useState<string>("");
    const [coords, setCoords] = useState<{ lat: number, long: number } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch Book Stats on render
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("No token found. Redirecting to login.");
            navigate("/");
            return;
        }

        fetch("http://localhost:4020/api/books/stats", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
            if (res.status === 403) {
                throw new Error("Unauthorized access. Token may be invalid.");
            }
            return res.json();
        })
        .then(data => {
            setAllTimeRead(data.allTimeRead ?? 0);
            setThisYearRead(data.thisYearRead ?? 0);
            setCurrentReads(data.currentReads ?? []);
            setRecentReads(data.recentReads ?? []);
        })
        .catch(err => console.error("Error fetching stats:", err));

        // Fetch coordinates for timezone microservice 
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        long: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting coordinates:", error)
                }
            )
        } else {
            console.warn("Geolocation not supported in this browser.")
        }
    }, []);

    // Wait for coordinates to be fetched from navigator, then fetch from microservice
    useEffect(() => {
        fetch("http://localhost:5600/api/timezone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lat: coords?.lat, long: coords?.long })
        })
        .then(res => res.json())
        .then(data => {
            setCurrentTime(data.timeStamp);
            setTimezone(data.abbreviation);
            console.log(data.timeStamp, data.abbreviation);
        })
        .catch(err => console.error("Error fetching timezone:", err));
    },[coords])

    return(
        <>
        <NavBar />
        <div id="home-div">
            <div id="home-div-left">
                <h1 id="home-header">Hi! Welcome to your virtual library</h1>
                <div id="read-counts-div">
                    <div id="read-all-time-div">
                        <h1>{allTimeRead}</h1>
                        <p>Books read all time</p>
                    </div>
                    <div id="read-this-year-div">
                        <h1>{thisYearRead}</h1>
                        <p>Books read this year</p>
                    </div>
                </div>
                <div id="homepage-shelf-div">
                    <div id="currently-reading">
                        <div className="shelf-title">
                            <p>Currently Reading</p>
                        </div>
                        <div className="shelf-books">
                            {Array.isArray(currentReads) && currentReads.map((title, idx) => {
                                return(
                                    <div key={idx} className={`book-spine-${(idx % 2) + 1}`}>
                                        <p className="vertical-text">{title}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div id="recently-read">
                        <div className="shelf-title">
                            <p>Recently Read</p>
                        </div>
                        <div className="shelf-books">
                            {Array.isArray(recentReads) && recentReads.map((title, idx) => {
                                return(
                                    <div key={idx} className={`book-spine-${(idx % 2) + 1}`}>
                                        <p className="vertical-text">{title}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div id="home-div-right">
                <p className="open-about" id="home-about">Use this site to track your reading progress, write reviews, get recommendations, and more!</p>
            </div>
        </div>
        <footer>
            Date and Time at load: {currentTime}, {timezone}
        </footer>
        </>
    )
}