import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";


export const DashboardMain = ({API_URL, showProfile, setShowProfile}) => {

    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations API_URL={API_URL} showProfile={showProfile} />
            <DashboardChatWindow API_URL={API_URL} showProfile={showProfile}/>
        </main>
    )
}