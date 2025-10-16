import { Link } from 'react-router-dom';

export function LoginPage() {
    return(
        <div>
            <Link to="/home"><button>Login</button></Link>
        </div>
    )
}