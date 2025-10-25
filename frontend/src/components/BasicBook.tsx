import { Link } from "react-router-dom"

interface BasicBookProps {
    title: string,
    author: string, 
    coverSrc: string,
    stars: string
}

export function BasicBook({ title, author, coverSrc, stars }: BasicBookProps) {
    return(
        <div className="basic-book-div">
            <img className="book-cover" src={coverSrc} alt="book-cover" />
            <h3 className="book-title">{title}</h3>
            <h4 className="book-author">{author}</h4>
            <div className="star-count">{stars}</div>
            <Link to="/bookInfo" className="more-info-link">More Information</Link>
        </div>
    )
}