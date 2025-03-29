

import '../../styles/Dashboard/DashBoardChatWindow.css'
import {DashboardMessageArea} from "./DashboardMessageArea.jsx";



export const DashboardChatWindow = () => {

    return (
        <section className={'dashboard-chat-window'}>


            <div className={'dashboard-message-content'}>
                <p>This is a message 👌</p>
            </div>

            <DashboardMessageArea/>

        </section>
    )
}