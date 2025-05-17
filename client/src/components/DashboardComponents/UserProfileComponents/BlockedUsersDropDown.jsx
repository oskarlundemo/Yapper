



export const BlockedUsersDropDown = ({toggleDropdown, blockedUsers, showDropDown, unblockUser}) => {

    return (
        <ul className="dropdown-blocked">
            <li className="dropdown-item">
                <button className="dropdown-button" onClick={toggleDropdown}>
                    Blocked users
                    <svg
                        className={`drop-icon ${showDropDown ? 'rotate' : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e3e3e3"
                    >
                        <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                    </svg>
                </button>

                <ul className={`sub-menu ${showDropDown ? 'show' : ''}`}>
                    <div>
                        {blockedUsers.map((blockedUser, index) => (
                            <li key={index} className="blocked-user-card">
                                <span>{blockedUser.BlockedUser.username || 'Blocked User'}</span>
                                <svg
                                    onClick={() => unblockUser(blockedUser.BlockedUser.id)}
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    fill="#e3e3e3">
                                    <path d="M200-440v-80h560v80H200Z" />
                                </svg>
                            </li>
                        ))}
                    </div>
                </ul>
            </li>
        </ul>
    )
}