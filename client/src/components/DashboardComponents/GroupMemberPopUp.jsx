import {useEffect, useState} from "react";


import '../../styles/Dashboard/GroupMemberPopUp.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {DropDownWithUsersComponent} from "./DropDownWithUsers.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This components is used for configuring group chat members. So once they
 * click on the button Group members, this pop-up window is show where the
 * group admin can either kick users or they themselves can leave the chat
 *
 * @param moreUsers  // All the users that are not friends
 * @param userFriends // Friends to the user
 * @returns {JSX.Element}
 * @constructor
 */




export const GroupMemberPopUp = ({moreUsers, userFriends}) => {

    const [filteredMoreUsers, setFilteredMoreUsers] = useState([]);  // Set the other users based on search string
    const [filteredContacts, setFilteredContacts] = useState([]); // Set the friends list based on search string
    const [userSearchString, setUserSearchString] = useState(""); // The search string provided by the user
    const [inputFocused, setInputFocused] = useState(false);  // Check if the user is inspecting the input fields / searchbar


    const [groupMembers, setGroupMembers] = useState(null);
    const {user} = useAuth();
    const {API_URL, hideGroupPopUp, setHideGroupPopUp, setHideOverlay, currentGroupInfo} = useDashboardContext();

    // This hook is used for populating and updating the array of friends based on the search string
    useEffect(() => {
        const filtered = userFriends.filter((entry) =>
            entry.friend.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [userSearchString, userFriends]);

    // This hook is used for populating and updating the array of strangers based on the search string
    useEffect(() => {
        const filtered = moreUsers.filter((entry) =>
            entry.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredMoreUsers(filtered);
    }, [userSearchString, moreUsers]);


    useEffect(() => {
        setGroupMembers(currentGroupInfo?.GroupMembers);
    }, [currentGroupInfo])


    // This function is used by the admin to kick users out of the group
    const removeFromGroup = async (memberId) => {
        setGroupMembers(prev => prev.filter(member => member?.id !== memberId));
        await fetch(`${API_URL}/groups/remove/${memberId}/${currentGroupInfo.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setGroupMembers(data.GroupMembers) // After the member has been kicked, update that group members state
            })
            .catch(err => console.log(err));
    }


    // This function is used for adding new users to a group by the admin or other group members
    const addToGroup = async (newGroupMember) => {
        setInputFocused(false);
        await fetch(`${API_URL}/groups/add/${newGroupMember.id}/${currentGroupInfo.id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setGroupMembers(data.GroupMembers);  // After the user has been added, update the group member state
            })
            .catch(err => console.log(err));
    }


    // This function is by group members if they wish to leave a group chat
    const leaveGroup = async (memberId) => {

        setHideGroupPopUp(true);  // Close the pop-up
        setHideOverlay(true); // Remove the overlay

        await fetch(`${API_URL}/groups/leave/${memberId}/${currentGroupInfo.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }

    // This function is used when the group admin deletes a group chat
    const deleteGroupChat = async () => {

        setHideGroupPopUp(true); // Close the pop-up
        setHideOverlay(true); // Remove the overlay

        await fetch(`${API_URL}/groups/delete/${currentGroupInfo.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
    }


    return (
        <div className={`groupMemberPopUp ${hideGroupPopUp ? "hide" : ""}`}>



            {/* Once a user clicks on the X icon, hide overlay and pop-up */}
            <div className="groupMemberPopUp-header">
                <svg onClick={() => {setHideGroupPopUp(true); setHideOverlay(true)}}
                     xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                     fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>


            {/* This is the section were other users and the group admin can add new users*/}
            <div className="groupMemberPopUp-add">
                <DropDownWithUsersComponent
                    filteredContacts={filteredContacts}
                    filteredMoreUsers={filteredMoreUsers}
                    setUserSearchString={setUserSearchString}
                    inputFocused={inputFocused}
                    setInputFocused={setInputFocused}
                    example={'Add a new user to the group'}
                    addToGroup={addToGroup}
                />
            </div>


            {/* Here we iterate through all the group members and show their status in the group and name*/}
            <div className="groupMemberPopUp-users">
                {groupMembers && (
                    groupMembers.map((groupMember, index) => (

                         <div className="groupMemberPopUp-user-card" key={index}>

                             {/* Show users profile picture and name */}
                             <UserAvatar user={groupMember.Member} width={40} height={40}/>
                             <p>{groupMember.Member.username}</p>


                            <div className="user-card-controls">


                                {/* If the logged-in user is not admin, dont show the remove icons  */}
                                {(groupMember.Member.id !== user.id && currentGroupInfo.admin_id === user.id) ? (
                                    <div className="user-card-box">
                                        <span>Remove</span>
                                        <svg onClick={() => removeFromGroup(groupMember.Member.id)} className={'remove-icon'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z"/></svg>
                                    </div>
                                ) : (

                                    // If the logged-in user is admin, show the remove icons
                                    (currentGroupInfo.admin_id === groupMember.Member.id && (
                                            <div className="user-card-box">
                                                <span>Admin</span>
                                                <svg className={'admin-icon'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-160v-80h560v80H200Zm0-140-51-321q-2 0-4.5.5t-4.5.5q-25 0-42.5-17.5T80-680q0-25 17.5-42.5T140-740q25 0 42.5 17.5T200-680q0 7-1.5 13t-3.5 11l125 56 125-171q-11-8-18-21t-7-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820q0 15-7 28t-18 21l125 171 125-56q-2-5-3.5-11t-1.5-13q0-25 17.5-42.5T820-740q25 0 42.5 17.5T880-680q0 25-17.5 42.5T820-620q-2 0-4.5-.5t-4.5-.5l-51 321H200Zm68-80h424l26-167-105 46-133-183-133 183-105-46 26 167Zm212 0Z"/></svg>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>


            {/* Button area where the users can either delete the group chat or leave */}
            <div className="groupMemberPopUp-footer">

                {/* If the logged-in user is admin, show delete group */}
                {currentGroupInfo?.admin_id === user.id ? (
                    <button onClick={() => deleteGroupChat()} >
                        Delete group
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/></svg>
                    </button>
                ) : (
                    // Else just show leave group button
                    <button onClick={() => leaveGroup(user.id)} >
                        Leave group
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                             viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
                    </button>
                )}
            </div>
        </div>
    )

}