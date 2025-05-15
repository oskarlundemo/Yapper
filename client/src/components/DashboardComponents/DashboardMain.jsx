import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {UserIcon} from "./UserIcon.jsx";
import {Overlay} from "./Overlay.jsx";
import {GroupMemberPopUp} from "./GroupMemberPopUp.jsx";
import {GroupProfile} from "./GroupProfile.jsx";
import {UserProfile} from "./UserProfile.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This component is a wrapper for all the dashboard components, more or less
 * just passing down props to the next inline components
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */

export const DashboardMain = ({}) => {


    const [userFriends, setUserFriends] = useState([]);    //  The users friends list
    const [moreUsers, setMoreUsers] = useState([]);        //  All the other users that are not friends
    const [blockedUsers, setBlockedUsers] = useState([]);  //  The users blocked by the logged-in account


    const {user} = useAuth(); // Fetch the jwt token from the context
    const {
        API_URL, groupChat,
        showGroupProfile, receiver,
    } = useDashboardContext();



    // This hook is used for populating the array of blocked users
    useEffect(() => {
        fetch(`${API_URL}/blocks/list/${user.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setBlockedUsers(data); // Set the state of the blocked users array
            })
            .catch(err => console.log(err));

    }, [])

    // This hook is used for updating the list of blocked users and other users
    useEffect(() => {

        // Get all the friends from DB
        fetch(`${API_URL}/friends/all/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserFriends(data);
            })
            .catch(err => console.log(err))


        // Get all the other users from DB
        fetch(`${API_URL}/users/${user.id}/filter`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setMoreUsers(data);
            })
            .catch(err => console.log(err))


        // Everytime a block is remove, we need to remove that user from one list and add it to the other
    }, [blockedUsers])


    return (
        <>
            <main className={'dashboard-main'}>

                {/*User icon*/}
                <UserIcon/>

                {/*Conversation sidebar where users can select conversations*/}
                <DashboardConversations/>

                {/*Chat window were all the messages are seen*/}
                <DashboardChatWindow
                    moreUsers={moreUsers} userFriends={userFriends}
                    blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers}
                />
                {groupChat && showGroupProfile ? (
                          // If there is a group chat, show the GroupProfile component when inspecting the group info
                          <GroupProfile/>
                     ) : (
                         // If there is a private conversation, just show the users info
                         <UserProfile blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers} />
                )}
            </main>

            {/* This is a pop-up window for configuring the members in a group*/}
            <GroupMemberPopUp moreUsers={moreUsers} userFriends={userFriends}/>

            {/* This adds overlay to the background of the pop-up window above*/}
            <Overlay/>
        </>
    )
}