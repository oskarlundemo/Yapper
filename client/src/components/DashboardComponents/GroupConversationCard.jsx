







import '../../styles/Dashboard/ConversationCard.css'
import {use, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from 'moment-timezone';
import {supabase} from "../../services/supabaseClient.js";
import {parseLatestMessage} from "./PrivateConversationCard.jsx";
import {GroupAvatar} from "./GroupAvatar.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";


export const GroupConversationCard = ({
                                          showChatWindow,
                                          groupId = 0, API_URL,
                                          inspectGroupChat, latestGroupMessage, setAllConversations,
                                          latestMessage = null,
                                          group = null,
                                      }) => {

    const {user} = useAuth();
    const [groupNameChannel, setGroupNameChannel] = useState(null);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        setGroupName(group?.name);
    }, [group]);


    const {clickOnChat} = useDynamicStyles();

    useEffect(() => {

        const fetchMessageData = async () => {
            await fetch(`${API_URL}/groups/new/message/${latestGroupMessage.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setAllConversations(prev =>
                        [
                            ...prev.filter(conv => conv.group?.id !== data.group.id),
                            data
                        ].sort((a, b) =>
                            new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
                        )
                    );
                })
                .catch(error => {
                    console.error('Error fetching group data.');
                })
        }

        if (latestGroupMessage?.group_id === groupId)
            fetchMessageData();

    }, [latestGroupMessage]);



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
            clickOnChat();
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <GroupAvatar group={group} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{groupName}
                    <span>
                        {latestMessage?.created_at && moment.utc(latestMessage.created_at).tz("Europe/Stockholm").format("HH:mm")}
                    </span>
                </h3>
                <p className={'conversation-content'}>

                    {user.id === latestMessage?.sender?.id ? (
                        <>
                        <span>You: </span>
                        {parseLatestMessage(latestMessage)}
                        </>
                    ) : (
                        <>
                        <span>{latestMessage?.sender?.username || ''}: </span>
                            {parseLatestMessage(latestMessage)}
                        </>
                        )}
                </p>
            </div>
        </div>
    )
}
