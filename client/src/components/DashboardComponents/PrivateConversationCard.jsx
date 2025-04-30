


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../services/supabaseClient.js";



export const PrivateConversationCard = ({showChatWindow, friend_id = 0,
                                            inspectPrivateConversation, user,
                                            setUpdatedMessage, API_URL,
                                            latestMessage = null, username = ''}) => {

    const {user: loggedIn} = useAuth();
    const [channel, setChannel] = useState(null);
    const [localMessage, setLocalMessage] = useState(latestMessage);

    useEffect(() => {
        if (!loggedIn?.id || !friend_id) return;

        const channelName = `conversation-${loggedIn.id}-${friend_id}`;
        const newChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                async (payload) => {
                    const message = payload.new;
                    if (
                        (message.sender_id === loggedIn.id && message.receiver_id === friend_id) ||
                        (message.sender_id === friend_id && message.receiver_id === loggedIn.id)
                    ) {
                        await fetch(`${API_URL}/conversations/new/private/${message.id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                setLocalMessage(data);
                                setUpdatedMessage(data);
                            })
                            .catch(error => console.log(error))
                    }
                }
            )
            .subscribe();

        setChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [loggedIn.id, friend_id]);

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
                        {moment(localMessage.created_at).format("h:mm A")}
                    </span></h3>
                <p className={'conversation-content'}>
                    {loggedIn.id === (localMessage.sender?.id || localMessage.sender_id) && <span>You: </span>}
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