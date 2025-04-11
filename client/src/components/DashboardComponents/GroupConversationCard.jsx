







import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../../../server/controllers/supabaseController.js";




export const GroupConversationCard = ({
                                          showChatWindow,
                                          groupId = 0,
                                          inspectGroupChat,
                                          latestMessage = null,
                                          groupName = '',
                                      }) => {

    const {user} = useAuth();
    const [channel, setChannel] = useState(null);
    const [updatedMessage, setUpdatedMessage] = useState(latestMessage);


    useEffect(() => {
        if (!user?.id || !groupId) return;

        const channelName = `conversation-${user.id}-${groupId}`;
        const newChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'GroupMessages',
                },
                (payload) => {
                    const message = payload.new;
                    // Check if the message belongs to the current group
                    if (message.group_id === groupId) {
                        setUpdatedMessage(message); // Update with new message
                        console.log('New message:', message); // Debugging message payload
                    }
                }
            )
            .subscribe();

        // Cleanup on unmount
        setChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });
        return () => {
            supabase.removeChannel(newChannel); // Remove the subscription on cleanup
        };
    }, [user.id, groupId]); // Dependency array ensures effect runs when user or groupId changes





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
            inspectGroupChat(groupId, groupName);
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <UserAvatar username={latestMessage.sender} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{groupName}
                    <span>
                        {moment(updatedMessage?.created_at).format("h:mm A")}
                    </span></h3>
                <p className={'conversation-content'}>
                    {user.id === (updatedMessage.sender_id || 0) && <span>You: </span>}
                    {parseLatestMessage(updatedMessage.content)}
                </p>
            </div>
        </div>
    )
}
