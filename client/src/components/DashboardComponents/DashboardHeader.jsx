
import '../../styles/Dashboard/Header.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {Link} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";


export const DashboardHeader = ({toggleProfile}) => {
    const {logout} = useAuth();
    const {user} = useAuth();

    return (
        <header className={'dashboard-header'}>

            <div className="header-company-logo">
                <img src='../../../public/yapperlogo.png' alt='logo' />
            </div>

            <div className="header-user-container">
                <p>{user.username}</p>

                <UserAvatar
                    width={20}
                    height={20}
                    />

                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>

                <div className='dropdown-menu'>
                    <ul className="dropdown">
                        <li onClick={() => toggleProfile()}>Profile</li>
                        <li onClick={logout}>Log out</li>
                    </ul>
                </div>
            </div>

        </header>
    )
}