import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useState} from "react";
import * as test from "node:test";


export const DashboardMain = ({API_URL, showChatWindow, toggleShowNewMessage, toggleShowMessage, showRequests, showProfile, showMessage, setShowProfile}) => {

    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);

    const inspectConversation = async (receiver_id) => {
        setReceiver(receiver_id);
        toggleShowMessage(false);
    }

    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations toggleShowMessage={toggleShowMessage} showChatWindow={showChatWindow} inspectConversation={inspectConversation} API_URL={API_URL} showProfile={showProfile} />
            <DashboardChatWindow showMessage={showMessage} showChatWindow={showChatWindow} inspectConversation={inspectConversation} receiver={receiver} showRequests={showRequests} messages={messages} API_URL={API_URL} showProfile={showProfile}/>
        </main>
    )
}