import { NavBar } from "../components/NavBar"
import { useEffect, useState } from "react"

export function HomePage() {
    const [allTimeRead, setAllTimeRead] = useState<number>(0);
    const [thisYearRead, setThisYearRead] = useState<number>(0);
    const [currentReads, setCurrentReads] = useState<string[]>([]);
    const [recentReads, setRecentReads] = useState<string[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:4020/api/books/stats", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            setAllTimeRead(data.allTimeRead);
            setThisYearRead(data.thisYearRead);
            setCurrentReads(data.currentReads);
            setRecentReads(data.recentReads);
        })
        .catch(err => console.error("Error fetching stats:", err));
    }, []);

    return(
        <>
        <NavBar />
        <div id="home-div">
            <div id="home-div-left">
                <h1 id="home-header">Hey Sean, welcome to your virtual library</h1>
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
                            {currentReads.map((title, idx) => {
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
                            {recentReads.map((title, idx) => {
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
        </>
    )
}