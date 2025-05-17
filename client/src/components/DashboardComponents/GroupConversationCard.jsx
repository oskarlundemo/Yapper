


import '../../styles/Dashboard/ConversationCard.css'
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {parseLatestMessage, parseLatestTimestamp, subscribeToChannel} from "../../services/helperFunctions.js";
import {GroupAvatar} from "./GroupAvatar.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This component is used for displaying a group chat card in the
 * DashboardConversations.jsx. So a user can click on the card and inspect
 * the group chat
 *
 * @param groupId ID of the group chat
 * @param latestGroupMessage The latest group chat message that was sent
 * @param setAllConversations All the conversations
 * @param latestMessage Latest message that was sent in the group chat
 * @param group The group itself
 * @returns {JSX.Element}
 * @constructor
 */





export const GroupConversationCard = ({
                                          groupId = 0, latestGroupMessage,
                                          setAllConversations, latestMessage = null,
                                          group = null,
                                      }) => {

    const {user} = useAuth();
    const [groupName, setGroupName] = useState(''); // State to set the name the group
    const {API_URL, inspectGroupChat, showChatWindow} = useDashboardContext();  // State to set UI
    const {clickOnChat} = useDynamicStyles(); // State to set UI


    useEffect(() => {
        setGroupName(group?.name);
    }, [group]);


    // This hook is used for updating the latest message that was sent in the group chat
    useEffect(() => {

        // Fetch the enriched new message from DB
        const fetchMessageData = async () => {
            await fetch(`${API_URL}/groups/new/message/${latestGroupMessage.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => response.json())
                .then(data => {
                    // Sort the conversations so the latest group chat lands on top
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
                    console.error(`Error fetching group data`, error);
                })
        }

        // If the latest message that was sent in group chats was in this group chat, update the latest messsage of this chat
        if (latestGroupMessage?.group_id === groupId)
            fetchMessageData();

    }, [latestGroupMessage]);




    // This hook is used for updating the name of the group chat once it changes
    useEffect(() => {
        if (!user?.id || !groupId) return;

        // Listen for new chat updates
        const groupChatNameChanges = subscribeToChannel(
            `groupChatNameChanges-${groupId}`,
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'GroupChats'
            },
            async (payload) => {
                const group = payload.new;

                if (group.id === groupId) {
                    setGroupName(group.name);
                }
            }
        )

        return () => {
            supabase.removeChannel(groupChatNameChanges);
        };
    }, [user.id, groupId]);



    return (
        <div onClick={() => {
            showChatWindow(); // Show the chat window and the messages
            inspectGroupChat(groupId, groupName); // Set the inspected group chat to this chat
            clickOnChat();}}
             className="conversation-card">

            {/* Avatar of the group chat */}
            <div className="conversation-card-avatar">
                <GroupAvatar group={group} height={40} width={40} />
            </div>


            {/* Info about the latest message */}
            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>{groupName}
                    <span>
                        {parseLatestTimestamp(latestMessage)}   {/* Set the time when the last message was sent */}
                    </span>
                </h3>
                <p className={'conversation-content'}>

                    {/* If the user wrote the last message, preface it with You: */}
                    {user.id === latestMessage?.sender?.id ? (
                           <>
                           <span>You: </span>
                           {parseLatestMessage(latestMessage)}
                            </>
                     ) : (
                            <>
                           <span>{latestMessage?.sender?.username || ''}: </span>
                            {parseLatestMessage(latestMessage)}
                            </>)}</p>
            </div>
        </div>
    )
}



