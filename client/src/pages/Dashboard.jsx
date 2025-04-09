

import '../styles/Dashboard/Dashboard.css'
import {DashboardHeader} from "../components/DashboardComponents/DashboardHeader.jsx";
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";
import {useState} from "react";

export const Dashboard = ({API_URL}) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(true);

    const toggleRequests = () => {
        setShowRequests(!showRequests);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    const toggleNewMessage = () => {
        setShowNewMessage(false);
    }

    const showChatWindow = () => {
        setShowProfile(false);
        setShowRequests(false);
    }

    return (
        <div className={'dashboard-wrapper'}>
            <DashboardHeader toggleRequests={toggleRequests} toggleProfile={toggleProfile} />
            <DashboardMain toggleShowNewMessage={setShowNewMessage} toggleShowMessage={toggleNewMessage} showMessage={showNewMessage} showChatWindow={showChatWindow} show API_URL={API_URL} showProfile={showProfile} showRequests={showRequests} setShowProfile={setShowProfile} />
        </div>
    )
}