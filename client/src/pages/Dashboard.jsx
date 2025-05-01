

import '../styles/Dashboard/Dashboard.css'
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";
import {useState} from "react";

export const Dashboard = ({API_URL}) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [receiver, setReceiver] = useState(null);


    const hideNewMessage = () => {
        setShowNewMessage(false);
    }

    const showNewMessages = () => {
        setShowNewMessage(true);
        setReceiver(null);
        setShowProfile(false);
    }

    const showChatWindow = () => {
        setShowProfile(false);
        setShowRequests(false);
        setShowNewMessage(false);
    }

    return (
        <div className={'dashboard-wrapper'}>
            <DashboardMain
                toggleShowNewMessage={setShowNewMessage} toggleShowMessage={hideNewMessage}
                showMessage={showNewMessage} showChatWindow={showChatWindow}
                receiver={receiver} setReceiver={setReceiver} setShowNewMessage={setShowNewMessage}

                API_URL={API_URL} showProfile={showProfile} showRequests={showRequests}
                setShowProfile={setShowProfile} showNewMessages={showNewMessages}
            />
        </div>
    )
}