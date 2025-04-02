

import '../styles/Dashboard/Dashboard.css'
import {DashboardHeader} from "../components/DashboardComponents/DashboardHeader.jsx";
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";
import {useState} from "react";

export const Dashboard = ({API_URL}) => {
    const [showProfile, setShowProfile] = useState(false);
    const [showRequests, setShowRequests] = useState(false);

    const toggleRequests = () => {
        setShowRequests(!showRequests);
    }

    const toggleProfile = () => {
        setShowProfile(!showProfile);
    };

    return (
        <div className={'dashboard-wrapper'}>
            <DashboardHeader toggleRequests={toggleRequests} toggleProfile={toggleProfile} />
            <DashboardMain API_URL={API_URL} showProfile={showProfile} showRequests={showRequests} setShowProfile={setShowProfile} />
        </div>
    )
}