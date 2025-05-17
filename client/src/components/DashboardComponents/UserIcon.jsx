
import '../../styles/Dashboard/DashboardMenu.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This component acts like a login / settings module. When
 * the user hovers on the nav the can either log out or inspect
 * their profile and change it from there
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */




export const UserIcon = ({ }) => {
    const { logout, user } = useAuth();  // Get users jwt token and log out funtion from context

    const {showUserMenu, clickOnProfile}= useDynamicStyles();  // UI functions
    const {showUserInfo, setShowGroupProfile} = useDashboardContext() // State to change UI

    return (
        <nav className={`dashboard-header ${showUserMenu ? '' : 'hide'}`}>
            <div className="header-user-container">

                {/* Show the avatar of the logged-in user */}
                <UserAvatar user={user.user} width={40} height={40} />

                {/* When they hover over this menu the li is shown */}
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