import { NavBar } from "../components/NavBar"

export function HomePage() {
    return(
        <>
        <NavBar />
        <div id="home-div">
            <div id="home-div-left">
                <h1 id="home-header">Hey Sean, welcome to your virtual library</h1>
                <div id="read-counts-div">
                    <div id="read-all-time-div">
                        <h1>5</h1>
                        <p>Books read all time</p>
                    </div>
                    <div id="read-this-year-div">
                        <h1>5</h1>
                        <p>Books read this year</p>
                    </div>
                </div>
                <div id="homepage-shelf-div">
                    <div id="currently-reading">
                        <div className="shelf-title">
                            <p>Currently Reading</p>
                        </div>
                        <div className="shelf-books">
                            <div className="book-spine-1"><p className="vertical-text">Wise Man's Fears</p></div>
                            <div className="book-spine-2"><p className="vertical-text">Meditations</p></div>
                        </div>
                    </div>
                    <div id="recently-read">
                        <div className="shelf-title">
                            <p>Recently Read</p>
                        </div>
                        <div className="shelf-books">
                            <div className="book-spine-2"><p className="vertical-text">One Hundred Years of Solitude</p></div>
                            <div className="book-spine-1"><p className="vertical-text">Dungeon Crawler Carl</p></div>
                            <div className="book-spine-2"><p className="vertical-text">Stoner</p></div>
                            <div className="book-spine-1"><p className="vertical-text">Slaughterhouse Five</p></div>
                            <div className="book-spine-2"><p className="vertical-text">Intermezzo</p></div>
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