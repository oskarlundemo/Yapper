
import '../../styles/Dashboard/Menu.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";


export const DashboardMenu = ({ showProfile }) => {
    const { logout, user } = useAuth();
    console.log(user)

    return (
        <nav className={'dashboard-header'}>
            <div className="header-user-container">

                <UserAvatar user={user.user} width={40} height={40} />

                <div className="dropdown-menu">
                    <ul className="dropdown">
                        <li onClick={() => showProfile(user.user)}>Profile</li>
                        <li onClick={logout}>Log out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};