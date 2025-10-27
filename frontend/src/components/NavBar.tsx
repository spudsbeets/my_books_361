import { Link } from 'react-router-dom';

export function NavBar() {
    return(
        <nav id="nav-bar">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/yourBooks" className="nav-link">Your Books</Link>
            <Link to="/addBook" className="nav-link">Add/Find Books</Link>
            <Link to="/recommendation" className="nav-link">Get a Recommendation</Link>
            <Link to="/profile" className="nav-link">Your Profile</Link>
        </nav>
    )
}