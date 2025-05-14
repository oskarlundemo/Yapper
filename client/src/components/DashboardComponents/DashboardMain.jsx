import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {DashboardMenu} from "./DashboardMenu.jsx";
import {Overlay} from "./Overlay.jsx";
import {GroupMemberPopUp} from "./GroupMemberPopUp.jsx";
import {GroupProfile} from "./GroupProfile.jsx";
import {UserProfile} from "./UserProfile.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


export const DashboardMain = ({}) => {


    const [userFriends, setUserFriends] = useState([]);
    const [moreUsers, setMoreUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);


    const {user} = useAuth();
    const {
        API_URL, groupChat,
        setChatName, showGroupProfile,
        receiver,
    } = useDashboardContext();



    useEffect(() => {
        fetch(`${API_URL}/blocks/list/${user.id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setBlockedUsers(data);
            })
            .catch(err => console.log(err));

    }, [])


    useEffect(() => {

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

    }, [blockedUsers])




    return (
        <>
            <main className={'dashboard-main'}>
                     <DashboardMenu/>

                    <DashboardConversations/>

                    <DashboardChatWindow
                        moreUsers={moreUsers} userFriends={userFriends}
                        receiver={receiver} blockedUsers={blockedUsers}
                        setBlockedUsers={setBlockedUsers} />


                     {groupChat && showGroupProfile ? (
                         <GroupProfile
                            headerName={setChatName}/>
                        ) : (
                            <UserProfile
                            blockedUsers={blockedUsers}
                            setBlockedUsers={setBlockedUsers} />
                     )}

            </main>

                    <GroupMemberPopUp moreUsers={moreUsers} userFriends={userFriends}/>

            <Overlay/>
        </>
    )
}