


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {parseLatestMessage, parseLatestTimestamp} from "../../services/helperFunctions.js";



export const PrivateConversationCard = ({friend_id = 0,
                                            user, setAllConversations,
                                            API_URL, latestPrivateMessage = null,
                                            latestMessage = null, username = ''}) => {

    const {user: loggedIn} = useAuth();

    const {clickOnChat} = useDynamicStyles();
    const {showChatWindow, inspectPrivateConversation} = useDashboardContext();

    useEffect( () => {
        const fetchMessageData = async () => {
            await fetch(`${API_URL}/conversations/new/private/${latestPrivateMessage.id}/${latestPrivateMessage.receiver_id}
            /${latestPrivateMessage.sender_id}/${loggedIn.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    setAllConversations(prev =>
                        [
                            ...prev.filter(conv => conv.user?.id !== data.user.id),
                            data
                        ].sort((a, b) =>
                            new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
                        )
                    );
                })
                .catch(error => console.log(error))
        }

        if (
            (latestPrivateMessage?.sender_id === loggedIn.id && latestPrivateMessage?.receiver_id === friend_id) ||
            (latestPrivateMessage?.sender_id === friend_id && latestPrivateMessage?.receiver_id === loggedIn.id)
        )
            fetchMessageData();

    }, [latestPrivateMessage]);


    return (
        <div onClick={() => {
            showChatWindow();
            inspectPrivateConversation(friend_id, username);
            clickOnChat();
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar user={user} username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}
                    <span>
                        {parseLatestTimestamp(latestMessage)}
                    </span>
                </h3>
                <p className={'conversation-content'}>
                    {loggedIn.id === (latestMessage?.sender?.id || latestMessage?.sender_id) && <span>You: </span>}
                    {parseLatestMessage(latestMessage)}
                </p>
            </div>
        </div>
    )
}


