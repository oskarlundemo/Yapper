


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {use, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment-timezone";



export const PrivateConversationCard = ({showChatWindow, friend_id = 0,
                                            inspectPrivateConversation, user, setAllConversations,
                                            API_URL, latestPrivateMessage = null,
                                            latestMessage = null, username = ''}) => {

    const {user: loggedIn} = useAuth();
    const [channel, setChannel] = useState(null);


    useEffect( () => {
        const fetchMessageData = async () => {
            await fetch(`${API_URL}/conversations/new/private/${latestPrivateMessage.id}/${latestPrivateMessage.receiver_id}/${latestPrivateMessage.sender_id}/${loggedIn.id}`, {
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
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar user={user} username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}
                    <span>
                        {moment(latestMessage?.created_at).tz("Europe/Stockholm").format("HH:mm")}
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


export const parseLatestMessage = (message) => {

    if (message.hasAttachments) {
        return 'Sent a file'
    } else if(message.content?.includes('giphy.com')) {
        return 'Sent a GIF '
    } else if (message.content?.length > 20 && message.content) {
        const subString = message.content.substring(0, 20);
        const lastSpace = subString.lastIndexOf(' ');
        return message.content.substring(0, lastSpace) + '...';
    }
    return message.content;
}