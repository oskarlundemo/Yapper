


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";



export const ConversationCard = ({inspectConversation, conversationId, username}) => {

    return (

        <div onClick={()=> inspectConversation(conversationId)} className="conversation-card">

            <div className="conversation-card-avatar">

                <UserAvatar username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}<span>4:30 AM</span></h3>
                <p className={'conversation-content'}>Hey! Would it not be great if we could...</p>
            </div>

        </div>

    )

}