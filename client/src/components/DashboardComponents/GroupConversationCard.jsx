







import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../services/supabaseClient.js";
import {parseLatestMessage} from "./PrivateConversationCard.jsx";


export const GroupConversationCard = ({
                                          showChatWindow,
                                          groupId = 0,
                                          inspectGroupChat, setUpdatedMessage,
                                          latestMessage = null,
                                          groupName = '',
                                      }) => {

    const {user} = useAuth();
    const [channel, setChannel] = useState(null);
    const [localMessage, setLocalMessage] = useState(latestMessage);


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
                async (payload) => {
                    const message = payload.new;

                    if (message.group_id === groupId) {
                        // Fetch enriched message with sender info
                        const {data: enrichedMessages, error} = await supabase
                            .from('GroupMessages')
                            .select('*, sender:sender_id(id, username)') // adjust as needed
                            .eq('group_id', groupId)
                            .order('created_at', { ascending: false })
                            .limit(1);

                        if (error) {
                            console.error("Error fetching sender:", error.message);
                            return;
                        }

                        if (enrichedMessages && enrichedMessages.length > 0) {
                            setLocalMessage(enrichedMessages[0]);
                            setUpdatedMessage(enrichedMessages[0]);
                            console.log("New enriched message:", enrichedMessages[0]);
                        } else {
                            console.warn("No messages found for this group.");
                        }
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
                        {moment(localMessage?.created_at).format("h:mm A")}
                    </span></h3>
                <p className={'conversation-content'}>

                    {user.id === localMessage.sender_id ? (
                        <>
                        <span>You: </span>
                        {parseLatestMessage(localMessage.content)}
                        </>
                    ) : (
                        <>
                        <span>{localMessage.sender?.username || ''}: </span>
                            {parseLatestMessage(localMessage.content)}
                        </>
                        )}

                </p>
            </div>
        </div>
    )
}
