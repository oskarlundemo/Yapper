


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";



export const ConversationCard = ({className = '', showChatWindow, inspectConversation, conversationId, message = '', username}) => {

    return (
        <div   onClick={() => {
            showChatWindow();
            inspectConversation(conversationId);
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}<span>4:30 AM</span></h3>
                <p className={'conversation-content'}>{message}</p>
            </div>
        </div>
    )
}