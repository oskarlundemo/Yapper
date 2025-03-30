import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";


export const DashboardMain = ({showProfile, setShowProfile}) => {

    return (
        <main className={'dashboard-main'}>
            <DashboardNavigation toggleProfile={setShowProfile} />
            <DashboardConversations/>
            <DashboardChatWindow showProfile={showProfile}/>
        </main>
    )
}