import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {DashboardMenu} from "./DashboardMenu.jsx";
import {Overlay} from "./Overlay.jsx";
import {GroupMemberPopUp} from "./GroupMemberPopUp.jsx";


export const DashboardMain = ({API_URL, showChatWindow, receiver, setReceiver, showNewMessages, setShowNewMessage, toggleShowMessage, showRequests, showProfile, showMessage}) => {

    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState(false);
    const [chatName, setChatName] = useState("");
    const [groupChat, setGroupChat] = useState(false);
    const [userFriends, setUserFriends] = useState([]);
    const [moreUsers, setMoreUsers] = useState([]);

    const [updatedMessage, setUpdatedMessage] = useState(null);
    const [miniBar, setMiniBar] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentGroupInfo, setCurrentGroupInfo] = useState(null);
    const [blockedUsers, setBlockedUsers] = useState([]);

    const [hideOverlay, setHideOverlay] = useState(true);
    const [hideGroupPopUp, setHideGroupPopUp] = useState(true);

    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const {user} = useAuth();

    const showUserInfo = async (inspectedUser = null) => {

        setMiniBar(true);
        setLoadingProfile(true);

        await fetch(`${API_URL}/users/${inspectedUser.id}/profile/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setSelectedUser(data);
                setLoadingProfile(false);
            })
            .catch(error => console.log(error));
    }

    const showGroupMembers = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

    const clickOnOverlay = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

    const showGroupInfo = () => {
        setMiniBar(true);
    }

    const inspectPrivateConversation = async (receiver_id, chatname = '', initialLoad) => {

        if (!initialLoad) {
            setLoadingMessages(true);
        }

        setGroupChat(false);
        setReceiver(receiver_id);
        setChatName(chatname);
        showChatWindow();

        await fetch(`${API_URL}/friends/check/${receiver_id}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setFriend(data);
            })
            .catch(err => console.log(err));

        fetch(`${API_URL}/messages/private/conversation/${user.id}/${receiver_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);
                setSelectedUser(data.otherUser);
                setLoadingMessages(false);
            })
            .catch(err => console.log(err));
        toggleShowMessage(false);
    }

    const inspectGroupChat = async (receiver_id, chatname, initialLoad) => {

        if (!initialLoad) {
            setLoadingMessages(true);
        }

        setGroupChat(true);
        setReceiver(receiver_id);
        showChatWindow();
        setChatName(chatname);
        fetch(`${API_URL}/messages/group/conversation/${user.id}/${receiver_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.groupMessages);
                setCurrentGroupInfo(data.group);
                setLoadingMessages(false);
            })
            .catch(err => console.log(err));
    }



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
                <DashboardMenu showProfile={showUserInfo} />

                <DashboardConversations
                    setMiniBar={setMiniBar} setReceiver={setReceiver}
                                    updatedMessage={updatedMessage} setUpdatedMessage={setUpdatedMessage} messages={messages} inspectGroupChat={inspectGroupChat}
                                    showNewMessages={showNewMessages} toggleShowMessage={toggleShowMessage} showChatWindow={showChatWindow} setShowNewMessage={setShowNewMessage}
                                    inspectPrivateConversation={inspectPrivateConversation} API_URL={API_URL} showProfile={showProfile}
                />

                <DashboardChatWindow
                    setFriend={setFriend} setReceiver={setReceiver} loadingProfile={loadingProfile}
                                 setChatName={setChatName} currentGroupInfo={currentGroupInfo} showGroupInfo={showGroupInfo} selectedUser={selectedUser}
                                 showUserInfo={showUserInfo} miniBar={miniBar} setMiniBar={setMiniBar} moreUsers={moreUsers} userFriends={userFriends}
                                 setGroupChat={setGroupChat} groupChat={groupChat} chatName={chatName}
                                 friend={friend} showMessage={showMessage} showChatWindow={showChatWindow}
                                 inspectConversation={inspectPrivateConversation} receiver={receiver} blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers}
                                 showRequests={showRequests} messages={messages} setMessages={setMessages}
                                 API_URL={API_URL} showProfile={showProfile} showGroupMembers={showGroupMembers} loadingMessages={loadingMessages}
                />
            </main>
            <GroupMemberPopUp moreUsers={moreUsers} userFriends={userFriends} API_URL={API_URL} group={currentGroupInfo} hideOverlay={setHideOverlay} closePopUp={setHideGroupPopUp}  hidePopUp={hideGroupPopUp} />
            <Overlay hideOverlay={hideOverlay} setHideOverlay={setHideOverlay} clickOnOverlay={clickOnOverlay}/>
        </>
    )
}