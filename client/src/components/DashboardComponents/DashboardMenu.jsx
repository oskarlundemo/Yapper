
import '../../styles/Dashboard/DashboardMenu.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";


export const DashboardMenu = ({ }) => {
    const { logout, user } = useAuth();

    const {showUserMenu, clickOnProfile, API_URL, showUserInfo, setShowGroupProfile} = useDynamicStyles();

    return (
        <nav className={`dashboard-header ${showUserMenu ? '' : 'hide'}`}>
            <div className="header-user-container">

                <UserAvatar API_URL={API_URL} user={user.user} width={40} height={40} />

                <div className="dropdown-menu">
                    <ul className="dropdown">
                        <li onClick={() => {showUserInfo(user.user); clickOnProfile(); setShowGroupProfile(false)}}>Profile</li>
                        <li onClick={logout}>Log out</li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};