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

    const {user} = useAuth();

    const inspectConversation = async (receiver_id, chatname = '', groupChat) => {
        setReceiver(receiver_id);
        setChatName(chatname);
        setGroupChat(groupChat);

        if (!groupChat) {
            await fetch(`${API_URL}/notifications/friends/${receiver}/${user.id}`, {
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
        }
        toggleShowMessage(false);
    }

    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations showNewMessages={showNewMessages} toggleShowMessage={toggleShowMessage} showChatWindow={showChatWindow} inspectConversation={inspectConversation} API_URL={API_URL} showProfile={showProfile} />
            <DashboardChatWindow setGroupChat={setGroupChat} groupChat={groupChat} chatName={chatName} friend={friend} showMessage={showMessage} showChatWindow={showChatWindow} inspectConversation={inspectConversation} receiver={receiver} showRequests={showRequests} messages={messages} API_URL={API_URL} showProfile={showProfile}/>
        </main>
    )
}