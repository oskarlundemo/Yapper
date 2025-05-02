import {Link} from "react-router-dom";


export const LandingPageNav = ({sticky}) => {
    return (
        <nav className={`landing-page-nav ${sticky ? `sticky` : ``}`}>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
        </nav>
    )
}