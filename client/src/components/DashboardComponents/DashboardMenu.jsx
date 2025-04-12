
import '../../styles/Dashboard/Menu.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";


export const DashboardMenu = ({ toggleProfile, toggleRequests }) => {
    const { logout, user } = useAuth(); // Only call useAuth once

    return (
        <nav className={'dashboard-header'}>
            <div className="header-user-container">

                <UserAvatar user={user} width={20} height={20} />

                <div className="dropdown-menu">
                    <ul className="dropdown">
                        <li onClick={toggleProfile}>Profile</li>
                        <li onClick={logout}>Log out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};