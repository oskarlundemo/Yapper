import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {DashboardMenu} from "./DashboardMenu.jsx";
import {Overlay} from "./Overlay.jsx";
import {GroupMemberPopUp} from "./GroupMemberPopUp.jsx";


export const DashboardMain = ({API_URL, showChatWindow, receiver, setReceiver, showNewMessages, toggleShowMessage, showRequests, showProfile, showMessage, setShowProfile}) => {

    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState(null);
    const [chatName, setChatName] = useState("");
    const [groupChat, setGroupChat] = useState(false);

    const [updatedMessage, setUpdatedMessage] = useState(null);
    const [miniBar, setMiniBar] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentGroupInfo, setCurrentGroupInfo] = useState(null);


    const [hideOverlay, setHideOverlay] = useState(true);
    const [hideGroupPopUp, setHideGroupPopUp] = useState(true);


    const [groupName, setGroupName] = useState("");

    const {user} = useAuth();


    const showUserInfo = (inspectedUser = null) => {
        setMiniBar(true);
        setSelectedUser(inspectedUser);
        console.log(inspectedUser);
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

    const inspectPrivateConversation = async (receiver_id, chatname = '') => {
        setGroupChat(false);
        setReceiver(receiver_id);
        setChatName(chatname);
        showChatWindow();

        await fetch(`${API_URL}/notifications/friends/${receiver_id}/${user.id}`, {
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
                setMessages(data.messagesWithAttachments);
                setSelectedUser(data.otherUser);
            })
            .catch(err => console.log(err));

        toggleShowMessage(false);

    }

    const inspectGroupChat = async (receiver_id, chatname) => {
        setGroupChat(true);
        setReceiver(receiver_id);
        showChatWindow();
        setGroupName(chatname);
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
            })
            .catch(err => console.log(err));
    }


    return (
        <>
            <main className={'dashboard-main'}>
                <DashboardMenu showProfile={showUserInfo} />

                <DashboardConversations groupName={groupName} setGroupName={setGroupName} updatedMessage={updatedMessage}
                                    setUpdatedMessage={setUpdatedMessage} messages={messages} inspectGroupChat={inspectGroupChat}
                                    showNewMessages={showNewMessages} toggleShowMessage={toggleShowMessage} showChatWindow={showChatWindow}
                                    inspectPrivateConversation={inspectPrivateConversation} API_URL={API_URL} showProfile={showProfile}
                />

                <DashboardChatWindow setGroupName={setGroupName} groupName={groupName} currentGroupInfo={currentGroupInfo}
                                 showGroupInfo={showGroupInfo} selectedUser={selectedUser}
                                 showUserInfo={showUserInfo} miniBar={miniBar} setMiniBar={setMiniBar}
                                 setGroupChat={setGroupChat} groupChat={groupChat} chatName={chatName}
                                 friend={friend} showMessage={showMessage} showChatWindow={showChatWindow}
                                 inspectConversation={inspectPrivateConversation} receiver={receiver}
                                 showRequests={showRequests} messages={messages} setMessages={setMessages}
                                 API_URL={API_URL} showProfile={showProfile} showGroupMembers={showGroupMembers}
                />
            </main>
            <GroupMemberPopUp hideOverlay={setHideOverlay} closePopUp={setHideGroupPopUp}  hidePopUp={hideGroupPopUp} />
            <Overlay setHideOverlay={setHideOverlay} clickOnOverlay={clickOnOverlay}/>
        </>
    )
}