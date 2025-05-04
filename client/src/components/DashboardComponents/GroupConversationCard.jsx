







import '../../styles/Dashboard/ConversationCard.css'
import {use, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from 'moment-timezone';
import {supabase} from "../../services/supabaseClient.js";
import {parseLatestMessage} from "./PrivateConversationCard.jsx";
import {GroupAvatar} from "./GroupAvatar.jsx";


export const GroupConversationCard = ({
                                          showChatWindow,
                                          groupId = 0, API_URL,
                                          inspectGroupChat, latestGroupMessage,
                                          latestMessage = null,
                                          group = null,
                                      }) => {

    const {user} = useAuth();
    const [channel, setChannel] = useState(null);
    const [groupNameChannel, setGroupNameChannel] = useState(null);
    const [groupName, setGroupName] = useState('');
    const [localMessage, setLocalMessage] = useState(latestMessage);
    const [timeStamp, setTimeStamp] = useState(null);

    useEffect(() => {
        setGroupName(group?.name);
    }, [group]);

    useEffect(() => {
        setLocalMessage(latestMessage);
    }, [group])


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
                    setLocalMessage(data);
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
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                <GroupAvatar group={group} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{groupName}
                    <span>
                        {localMessage?.created_at && moment.utc(localMessage.created_at).tz("Europe/Stockholm").format("HH:mm")}
                    </span>
                </h3>
                <p className={'conversation-content'}>

                    {user.id === localMessage.sender.id ? (
                        <>
                        <span>You: </span>
                        {parseLatestMessage(localMessage)}
                        </>
                    ) : (
                        <>
                        <span>{localMessage.sender?.username || ''}: </span>
                            {parseLatestMessage(localMessage)}
                        </>
                        )}
                </p>
            </div>
        </div>
    )
}
