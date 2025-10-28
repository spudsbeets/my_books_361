import { Link } from "react-router-dom"

interface BasicBookProps {
    bookID: number,
    title: string,
    author: string, 
    coverSrc: string,
    rating?: string
}

export function BasicBook({ bookID, title, author, coverSrc, rating }: BasicBookProps) {
    return(
        <div className="basic-book-div">
            <img className="book-cover" src={coverSrc} alt="book-cover" />
            <h3 className="book-title">{title}</h3>
            <h4 className="book-author">{author}</h4>
            <div className="star-count">{rating}</div>
            <Link to={`/bookInfo/${bookID}`} className="more-info-link">More Information</Link>
        </div>
    )
}