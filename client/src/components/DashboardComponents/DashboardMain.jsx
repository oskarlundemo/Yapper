import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {use, useState} from "react";
import * as test from "node:test";
import {useAuth} from "../../context/AuthContext.jsx";


export const DashboardMain = ({API_URL, showChatWindow, receiver, setReceiver, showNewMessages, toggleShowMessage, showRequests, showProfile, showMessage, setShowProfile}) => {

    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState(null);
    const [chatName, setChatName] = useState("");
    const [groupChat, setGroupChat] = useState(false);
    const [updatedMessage, setUpdatedMessage] = useState(null);
    const {user} = useAuth();

    const inspectPrivateConversation = async (receiver_id, chatname = '') => {
        setGroupChat(false);
        setReceiver(receiver_id);
        setChatName(chatname);
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
                setMessages(data);
            })
            .catch(err => console.log(err));

        toggleShowMessage(false);

    }


    const inspectGroupChat = async (receiver_id, chatname) => {
        setGroupChat(true);
        setReceiver(receiver_id);
        setChatName(chatname);
        fetch(`${API_URL}/messages/group/conversation/${user.id}/${receiver_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(err => console.log(err));
    }



    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations updatedMessage={updatedMessage} setUpdatedMessage={setUpdatedMessage()} messages={messages} inspectGroupChat={inspectGroupChat} showNewMessages={showNewMessages} toggleShowMessage={toggleShowMessage} showChatWindow={showChatWindow} inspectPrivateConversation={inspectPrivateConversation} API_URL={API_URL} showProfile={showProfile} />
            <DashboardChatWindow groupChat={groupChat} chatName={chatName} friend={friend} showMessage={showMessage} showChatWindow={showChatWindow} inspectConversation={inspectPrivateConversation} receiver={receiver} showRequests={showRequests} messages={messages} setMessages={setMessages} API_URL={API_URL} showProfile={showProfile}/>
        </main>
    )
}