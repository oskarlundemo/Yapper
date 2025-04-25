







import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment/moment.js";
import {supabase} from "../../services/supabaseClient.js";
import {parseLatestMessage} from "./PrivateConversationCard.jsx";
import {GroupAvatar} from "./GroupAvatar.jsx";


export const GroupConversationCard = ({
                                          showChatWindow,
                                          groupId = 0,
                                          inspectGroupChat, setUpdatedMessage,
                                          latestMessage = null,
                                          groupName = '', group = null,
                                      }) => {

    const {user} = useAuth();
    const [channel, setChannel] = useState(null);
    const [groupNameChannel, setGroupNameChannel] = useState(null);
    const [localMessage, setLocalMessage] = useState(latestMessage);
    const [testGroupName, setGroupName] = useState(groupName);


    useEffect(() => {
        if (!user?.id || !groupId) return;

        const channelName = `latestmessage-${user.id}-${groupId}`;
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
                        const {data: enrichedMessages, error} = await supabase
                            .from('GroupMessages')
                            .select('*, sender:sender_id(id, username)')
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

        setChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });
        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user.id, groupId]);


    useEffect(() => {
        if (!user?.id || !groupId) return;

        const channelName = `groupname-${user.id}-${groupId}`;
        const newChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'GroupChats',
                },
                async (payload) => {

                    const group = payload.new;
                    console.log(group)

                    if (group.id === groupId) {
                        setGroupName(group.name);
                    }
                }
            )
            .subscribe();

        setGroupNameChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });
        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user.id, groupId]);


    return (
        <div onClick={() => {
            showChatWindow();
            inspectGroupChat(groupId, groupName);
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <GroupAvatar group={group} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{testGroupName}
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
