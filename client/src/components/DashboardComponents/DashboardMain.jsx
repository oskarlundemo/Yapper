import {DashboardNavigation} from "./DashboardNavigation.jsx";
import {DashboardConversations} from "./DashboardConversations.jsx";
import {DashboardChatWindow} from "./DashboardChatWindow.jsx";


export const DashboardMain = () => {


    return (
        <main className={'dashboard-main'}>

            <DashboardNavigation/>
            <DashboardConversations/>
            <DashboardChatWindow/>

        </main>
    )
}