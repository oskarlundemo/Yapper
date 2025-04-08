


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../../../server/controllers/supabaseController.js";



export const ConversationCard = ({showChatWindow, friend_id = 0, inspectConversation, conversationId, latestMessage = '', username, sender_id = 0}) => {

    const {user} = useAuth();
    const [testLatest, setTestLatest] = useState('');
    const [channel, setChannel] = useState(null);
    const [latestSender, setLatestSender] = useState(0);
    const [latestTimestamp, setLatestTimestamp] = useState('');

    useEffect(() => {
        if (!user?.id || !friend_id) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .or(
                    `and(sender_id.eq.${user.id},receiver_id.eq.${friend_id}), and(sender_id.eq.${friend_id},receiver_id.eq.${user.id})`
                )
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Error fetching messages:", error.message);
            } else if (data && data.length > 0) {
                setTestLatest(data[0].content);
                setLatestTimestamp(data[0].created_at); // Set timestamp on fetch
                setLatestSender(data[0].sender_id); // Set timestamp on fetch
            }
        };

        fetchMessages();

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
                        setTestLatest(message.content);
                        setLatestSender(message.sender_id);
                        setLatestTimestamp(message.created_at);
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
        }
        return content;
    }


    return (
        <div onClick={() => {
            showChatWindow();
            inspectConversation(conversationId);
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar username={username} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{username}
                    <span>
                        {moment(latestTimestamp || latestMessage?.created_at).format("h:mm A")}
                    </span></h3>
                <p className={'conversation-content'}>
                    {user.id === latestSender && <span>You: </span>}
                    {parseLatestMessage(testLatest)}
                </p>
            </div>
        </div>
    )
}