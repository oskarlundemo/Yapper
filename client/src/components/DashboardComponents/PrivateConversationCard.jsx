


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../../../server/controllers/supabaseController.js";



export const PrivateConversationCard = ({showChatWindow, friend_id = 0,
                                            inspectPrivateConversation,
                                            setUpdatedMessage,
                                            latestMessage = null, username = ''}) => {

    const {user} = useAuth();
    const [channel, setChannel] = useState(null);
    const [localMessage, setLocalMessage] = useState(latestMessage);

    useEffect(() => {
        if (!user?.id || !friend_id) return;

        const channelName = `conversation-${user.id}-${friend_id}`;
        const newChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    const message = payload.new;
                    if (
                        (message.sender_id === user.id && message.receiver_id === friend_id) ||
                        (message.sender_id === friend_id && message.receiver_id === user.id)
                    ) {
                        setLocalMessage(message);
                        setUpdatedMessage(message);
                        console.log(message);
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
    }, [user.id, friend_id]);


    const parseLatestMessage = (content) => {
        if (content.length > 20 && content) {
            const subString = content.substring(0, 20);
            const lastSpace = subString.lastIndexOf(' ');
            return content.substring(0, lastSpace) + '...';
        } else if (content.includes('media.giphy.com')){
            return 'Sent a GIF'
        }
        return content;
    }


    return (
        <div onClick={() => {
            showChatWindow();
            inspectPrivateConversation(friend_id, username);
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}
                    <span>
                        {moment(localMessage.created_at).format("h:mm A")}
                    </span></h3>
                <p className={'conversation-content'}>
                    {user.id === (localMessage.sender?.id || localMessage.sender_id) && <span>You: </span>}
                    {parseLatestMessage(localMessage.content)}
                </p>
            </div>
        </div>
    )
}