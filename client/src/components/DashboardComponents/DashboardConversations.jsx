import {PrivateConversationCard} from "./PrivateConversationCard.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/DashboardConversation.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {GroupConversationCard} from "./GroupConversationCard.jsx";
import {LoadingExample} from "./LoadingExample.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {soundEffect, subscribeToChannel} from "../../services/helperFunctions.js";
import {ConversationsSearchArea} from "./DashboardConversationsComponents/ConversationsSearchArea.jsx";


/**
 * This components is the sidebar where users can click and inspect conversations
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */




export const DashboardConversations = ({}) => {

    const {user} = useAuth(); // Get the jwt token from the context
    const [searchQuery, setSearchQuery] = useState(''); // Search string for filtering conversations
    const [allConversations, setAllConversations] = useState([]) // Array for holding all the conversation cards
    const [loading, setLoading] = useState(true); // Loading state while fetching conversations

    const [latestPrivateMessage, setLatestPrivateMessage] = useState(null); // Set the latest message and let the conversations listen to if the message is relevant for them
    const [latestGroupMessage, setLatestGroupMessage] = useState(null); // Set the latest message and let the conversations listen to if the message is relevant for them

    const [filteredConversations, setFilteredConversations] = useState([]); // This is the array containing the filtered results
    const [inputHasFocus, setInputHasFocus] = useState(false); // Check if user has inspected the search bar


    /* Contexts */
    const {showConversations,  clickOnNewMessage} = useDynamicStyles();  // Bools for setting the UI
    const {API_URL, setMiniBar, inspectGroupChat, inspectPrivateConversation,
        setShowNewMessage, setLoadingMessages, showNewMessages} = useDashboardContext();

    // This is used for populating the array used for filtering conversations
    useEffect(() => {
        setFilteredConversations(allConversations);
    }, [allConversations]);

    // This function is triggered once the user first loggs in, basically inspecting the latest conversions they interacted with
    const inspectLatestChat = (latestChat) => {
        if (latestChat?.group) {   // If the latest chat is a group chat, inspect it
            inspectGroupChat(latestChat.group?.id, latestChat.group?.name, true)
            setMiniBar(false);
        } else if (!latestChat)  { // The user does not have any conversations, show the new conversations UI
            setShowNewMessage(true);
            setMiniBar(false);
        } else {  // Inspect the latest private conversation
            setMiniBar(false);
            inspectPrivateConversation(latestChat.user.id, latestChat.user.username, true)
        }
    }



    // This runs on mounting the component
    useEffect(() => {

        setLoadingMessages(true); // Set loading messages

        fetch(`${API_URL}/conversations/all/${user.id}`, { // Get all the conversations from DB
            method: "GET",
            headers: {
                Accept: "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                setAllConversations(data)   // Set all the conersations into the array
                inspectLatestChat(data[0])  // Inspect the last interacted conversation
                setLoading(false)    // Set loading false
                setLoadingMessages(false)  // Set loading messages false
            })
            .catch(error => console.log(error));
    }, [])





    // This hook listens for new blocks
    useEffect(() => {
        if (!user?.id) return;

        // Listen for incoming blocks and see if user is blocked
        const blockChannel = subscribeToChannel(
            `block-users`,
            {
                event: 'INSERT',
                schema: 'public',
                table: 'Blocks',
            },
            (payload) => {

                const block = payload.new; // New block inserted

                if (block.blocker === user.id) { // If the user blocking is the currently logged in

                    // Remove the user they blocked from their conversations
                    setAllConversations(prev =>
                        prev.filter(conv => conv.user?.id !== block.blocked)
                    );

                    // Inspect the latest chat
                    inspectLatestChat(allConversations[0])

                } else if (block.blocked === user.id) { // The user who is logged in get blocked

                    // Remove the user who blocked them from their conversation
                    setAllConversations(prev =>
                        prev.filter(conv => conv.user?.id !== block.blocker)
                    );

                    // Inspect the latest chat
                    inspectLatestChat(allConversations[0])
                }
            });

        // Clean up and remove the channel
        return () => {
            supabase.removeChannel(blockChannel);
        };
    }, [user?.id]);




    // This hook is used for listening to unblocks
    useEffect(() => {
        if (!user?.id) return;

        // Listen for when users are unblocking others
        const unBlockChannel = subscribeToChannel(
            'realtime-block-removed',

            {
                event: 'DELETE',
                schema: 'public',
                table: 'Blocks',
            },
            async (payload) => {
                const block = payload.old;

                // If the current user is the one who got unblocked or unblocking, fetch the enriched message from DB
                if (block.blocker === user.id || block.blocked === user.id) {
                    const response = await fetch(`${API_URL}/blocks/remove/${block.blocker}/${block.blocked}/${user.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    if (response && response.ok) {
                        const data = await response.json();
                        setAllConversations(prev => [data, ...prev]); // Add the conversation again to their conversations
                    }
                }
            })


        // Clean up and remove the channel
        return () => {
            supabase.removeChannel(unBlockChannel);
        };
    }, [user?.id]);



    // This hook is used for listing for group members who are getting kicked out of chats
    useEffect(() => {
        if (!user?.id) return;

        // Listen for deletes on the GroupMembers table
        const groupchatKicks = subscribeToChannel(
            `new-group-member-kick-${user.id}`,
            {
                event: 'DELETE',
                schema: 'public',
                table: 'GroupMembers',
            },
            (payload) => {
                const removedUser = payload.old;

                console.log('Removed user', removedUser);

                // If the newly removed group member is the current logged-in user, remove conversation
                if (removedUser.member_id === user.id) {

                    // Remove group chat from their
                    setAllConversations(prev =>
                        prev.filter(conv => conv.group?.id !== removedUser.group_id)
                    );
                    inspectLatestChat(allConversations[0])
                }
            })

        return () => {
            supabase.removeChannel(groupchatKicks);
        };

    }, [user?.id]);



    // This hook is listening for new group chats
    useEffect(() => {
        if (!user?.id) return;

        // Listen for inserts on the GroupChats table
        const newGroupChatsChannel = subscribeToChannel(
            'new-group-chat-channel',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'GroupChats',
            }, async (payload) => {

                const newGroupChat = payload.new;

                // Fetch enriched information about the group in the backend
                await fetch(`${API_URL}/conversations/new/group/chat/${newGroupChat.id}/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setAllConversations(prev => [...prev, data]); // Update conversations with the new group chat
                        soundEffect();
                    })
            })

        // Clean up and remove old channel
        return () => {
            supabase.removeChannel(newGroupChatsChannel);
        };
    }, [user?.id]);





    // This hook is listening for group chat invites
    useEffect(() => {
        if (!user?.id) return;

        // Listen for insert on the GroupMembers table
        const newGroupMembersChannel = subscribeToChannel(
            `new-group-member-channel-${user.id}`,
            {
                event: 'INSERT',
                schema: 'public',
                table: 'GroupMembers',
            }, async (payload) => {
                const groupMemberEntry = payload.new;


                console.log('New group member', groupMemberEntry);


                // If the newly inserted group member is not the logged in user, return
                if (groupMemberEntry.member_id !== user.id) return;

                // Fetch enriched information from the DB about the group
                await fetch(`${API_URL}/conversations/new/group/invite/${groupMemberEntry.group_id}/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setAllConversations(prev => [data, ...prev]); // Add group to conversations
                        soundEffect();
                    })
                    .catch(err => console.log(err));
            })


        // Clean up and remove old channel
        return () => {
            supabase.removeChannel(newGroupMembersChannel);
        };
    }, [user?.id]);



    // This hook is listening for incoming friend requests
    useEffect(() => {
        if (!user?.id) return;

        // Listen for new friend requests on the PendingFriendRequests table
        const realtimeFriendRequests = subscribeToChannel(
            'realtime-private-messages',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'PendingFriendRequests',
            },
            async (payload) => {

                const pendingRequest = payload.new;

                // If the logged-in user is either the one who sent or received the request, continue, else return
                if (pendingRequest.receiver_id !== user.id && pendingRequest.sender_id !== user.id) return;

                // Fetch enriched messaga from DB
                await fetch(`${API_URL}/conversations/new/${pendingRequest.sender_id}/${pendingRequest.receiver_id}/${user.id}/`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setAllConversations(prev => [data, ...prev]); // Insert into conversations
                        soundEffect();
                    })
            })

        // Clean up and remove old channel
        return () => {
            supabase.removeChannel(realtimeFriendRequests);
        };
    }, [user?.id]);




    // This hook is used for listening to new private messages
    useEffect(() => {
        if (!user?.id) return;

        // Listen for new messages inserted on the messages table
        const realtimePrivateMessagesChannel = subscribeToChannel(
            'realtime-private-messages',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, async (payload) => {
                const message = payload.new;
                setLatestPrivateMessage(message); // Set the latest message and pass it on to PrivateConversationCard components
            })


        // Clean up and remove old channel
        return () => {
            supabase.removeChannel(realtimePrivateMessagesChannel);
        };

    }, [user.id]);



    // This hook is used for listening to new group messages
    useEffect(() => {
        if (!user?.id) return;


        // Listen for new messages on the GroupMessages table
        const realtimeGroupMessages = subscribeToChannel(
            'realtime-group-messages',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'GroupMessages',
            },
            async (payload) => {
                const newGroupMessage = payload.new;
                setLatestGroupMessage(newGroupMessage); // Set the latest message and pass it on to the GroupConversationCard components
            })

        // Clean up and remove old channel
        return () => {
            supabase.removeChannel(realtimeGroupMessages);
        };
    }, [user.id]);



    // This hook is used for filtering the search query
    useEffect(() => {

        // Add a small delay to minimize updating state
        const delayDebounce = setTimeout(() => {
            if (allConversations.length > 0) {
                const filtered = allConversations.filter((conversation) => {
                    if (conversation.group?.name) { // Does any group name match the search string?
                        return conversation.group.name.toLowerCase().includes(searchQuery.toLowerCase());
                    } else if (conversation.user?.username) { // Does any user match the search string?
                        return conversation.user.username.toLowerCase().includes(searchQuery.toLowerCase());
                    }
                    return false;
                });
                setFilteredConversations(filtered);
            } else {
                setFilteredConversations([]);
            }
        }, 300);

        // Clean up and remove
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    return (
        <aside className={`dashboard-conversation ${showConversations ? '' : 'hide'}`}>

            {/*Search box header*/}
            <ConversationsSearchArea
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                setMiniBar={setMiniBar}
                showNewMessages={showNewMessages}
                setInputHasFocus={setInputHasFocus}
                clickOnNewMessage={clickOnNewMessage}
            />


            {/*Here are all the conversation cards*/}
            <div className={`conversations-container`}>

                {/*If loading, show loading animation*/}
                {loading ? (
                    <>
                        <LoadingExample />
                        <LoadingExample />
                        <LoadingExample />
                    </>
                ) :
                    // If the user has clicked on the search bar, update the conversation cards to the search results
                    inputHasFocus ? (
                    filteredConversations.length > 0 ? (
                           filteredConversations.map((conversation, index) =>
                                conversation.group ? (
                                    <GroupConversationCard
                                        setAllConversations={setAllConversations}
                                        latestGroupMessage={latestGroupMessage}
                                        key={index}
                                        group={conversation.group}
                                        groupId={conversation.group.id}
                                        latestMessage={conversation.latestMessage}/>
                                ) : (
                                  <PrivateConversationCard
                                       setAllConversations={setAllConversations}
                                       API_URL={API_URL}
                                      latestPrivateMessage={latestPrivateMessage}
                                       key={index}
                                      user={conversation.user}
                                      friend_id={conversation.user.id}
                                      username={conversation.user.username}
                                      latestMessage={conversation.latestMessage}/>))
                    ) :
                        // No matching search results to the query
                        (<p className={'search-result'}>No matches</p>)

                ) :
                        // Show all the conversations
                        allConversations.length > 0 ? (
                        allConversations.map((conversation, index) =>
                                conversation.group ? (

                                    // If the conversation is a group chat, render a GroupConversationCard
                                   <GroupConversationCard
                                       setAllConversations={setAllConversations}
                                       latestGroupMessage={latestGroupMessage}
                                       key={index}
                                       group={conversation.group}
                                       groupId={conversation.group.id}
                                       latestMessage={conversation.latestMessage}
                                       setLatestGroupMessage={setLatestGroupMessage}/>
                        ) : (
                                    // If the conversation is a private chat, render a PrivateConversationCard
                                    <PrivateConversationCard
                                     setAllConversations={setAllConversations}
                                     latestPrivateMessage={latestPrivateMessage}
                                     key={index}
                                     user={conversation.user}
                                     friend_id={conversation.user.id}
                                     username={conversation.user.username}
                                     latestMessage={conversation.latestMessage}/>
                                )
                        )
                    ) :
                            // User has not started any conversations yet
                            (<p className={'search-result'}>No conversations yet</p>)}

                </div>

        </aside>)}