import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { DashboardMessage } from "./DashboradMessage.jsx";
import {UserProfile} from "./UserProfile.jsx";

export const DashboardChatWindow = ({ showProfile }) => {
    return (
        <section className={'dashboard-chat-window'}>
            {showProfile ? (
                <UserProfile />
            ) : (
                <>
                    <div className={'dashboard-message-content'}>
                        <DashboardMessage />
                    </div>
                    <DashboardMessageArea />
                </>
            )}
        </section>
    );
};
