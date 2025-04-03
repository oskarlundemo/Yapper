import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {supabase} from "../../../../server/controllers/supabaseController.js";


export const DashboardMain = ({API_URL, showChatWindow, showRequests, showProfile, setShowProfile}) => {

    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);

    const inspectConversation = async (receiver_id) => {
        setReceiver(receiver_id);
    }

    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations showChatWindow={showChatWindow} inspectConversation={inspectConversation} API_URL={API_URL} showProfile={showProfile} />
            <DashboardChatWindow showChatWindow={showChatWindow} inspectConversation={inspectConversation} receiver={receiver} showRequests={showRequests} messages={messages} API_URL={API_URL} showProfile={showProfile}/>
        </main>
    )
}