

import '../styles/Dashboard/Dashboard.css'
import {DashboardMenu} from "../components/DashboardComponents/DashboardMenu.jsx";
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";
import {useState} from "react";

export const Dashboard = ({API_URL}) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(true);
    const [receiver, setReceiver] = useState(null);

    const toggleRequests = () => {
        setShowRequests(!showRequests);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const hideNewMessage = () => {
        setShowNewMessage(false);
    }

    const showNewMessages = () => {
        setShowNewMessage(true);
        setReceiver(null);
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
                receiver={receiver} setReceiver={setReceiver}

                API_URL={API_URL} showProfile={showProfile} showRequests={showRequests}
                setShowProfile={setShowProfile} showNewMessages={showNewMessages}
            />
        </div>
    )
}