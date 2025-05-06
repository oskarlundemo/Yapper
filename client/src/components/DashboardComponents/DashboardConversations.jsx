import {PrivateConversationCard} from "./PrivateConversationCard.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/DashboardConversation.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {GroupConversationCard} from "./GroupConversationCard.jsx";
import {LoadingExample} from "./LoadingExample.jsx";
import {supabase} from "../../services/supabaseClient.js";


export const DashboardConversations = ({inspectPrivateConversation, setMiniBar, inspectGroupChat, setShowNewMessage,
                                           showNewMessages, showChatWindow, API_URL}) => {

    const {user} = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [allConversations, setAllConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [privateChannel, setPrivateChannel] = useState(null)
    const [groupChannel, setGroupChannel] = useState(null);

    const [latestPrivateMessage, setLatestPrivateMessage] = useState(null);
    const [latestGroupMessage, setLatestGroupMessage] = useState(null);
    const [groupInviteChannel, setGroupInviteChannel] = useState(null);





    useEffect(() => {
        setFilteredConversations(allConversations);
    }, [allConversations]);


    const inspectLatestChat = (latestChat) => {
        if (latestChat?.group) {
            inspectGroupChat(latestChat.group?.id, latestChat.group?.name, true)
            setMiniBar(false);
        } else if (!latestChat)  {
            setShowNewMessage(true);
            setMiniBar(false);
        } else {
            setMiniBar(false);
            inspectPrivateConversation(latestChat.user.id, latestChat.user.username, true)
        }
    }


    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-blocks-added')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Blocks',
                },
                (payload) => {

                    const block = payload.new;

                    if (block.blocker === user.id) {
                        setAllConversations(prev =>
                            prev.filter(conv => conv.user?.id !== block.blocked)
                        );
                        inspectLatestChat(allConversations[0])
                    } else if (block.blocked === user.id) {
                        setAllConversations(prev =>
                            prev.filter(conv => conv.user?.id !== block.blocker)
                        );
                        inspectLatestChat(allConversations[0])
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);




    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-blocks-removed')
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'Blocks',
                },
                async (payload) => {

                    const block = payload.old;

                    if (block.blocker === user.id || block.blocked === user.id) {
                        const response = await fetch(`${API_URL}/blocks/remove/${block.blocker}/${block.blocked}/${user.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (response && response.ok) {
                            const data = await response.json();
                            setAllConversations(prev => [data, ...prev]);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-group-conversations-remove')
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'GroupMembers',
                },
                (payload) => {
                    const removedUser = payload.old;
                    if (removedUser.member_id === user.id) {
                        setAllConversations(prev =>
                            prev.filter(conv => conv.group?.id !== removedUser.group_id)
                        );
                        inspectLatestChat(allConversations[0])
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);


    // En för när nya chattar skapas

    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-new-groupchat')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'GroupChats'
                },
                async (payload) => {

                    const newGroupChat = payload.new;

                    await fetch(`${API_URL}/conversations/new/group/chat/${newGroupChat.id}/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            setAllConversations(prev => [...prev, data]);
                            const audio = new Audio('notification.mp3');
                            audio.play()
                        })
                }
            )
            .subscribe();

        setPrivateChannel(newChannel);

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);


    // En för när nya medlemmar läggs till

    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-conversation-group-invite')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'GroupMembers'
                },
                async (payload) => {

                    const groupMemberEntry = payload.new;

                    if (groupMemberEntry.member_id !== user.id) return;

                    const response = await fetch(`${API_URL}/conversations/new/group/invite/${groupMemberEntry.group_id}/${user.id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            setAllConversations(prev => [data, ...prev]);
                            const audio = new Audio('notification.mp3');
                            audio.play()
                            console.log(data)
                        })
                        .catch(err => console.log(err));
                }
            )
            .subscribe();

        setGroupInviteChannel(newChannel);

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);



    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-conversation-private')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'PendingFriendRequests'
                },
                async (payload) => {

                    const pendingRequest = payload.new;
                    console.log('Fetching pendingRequest');
                    console.log(payload.new);


                    if (pendingRequest.receiver_id !== user.id && pendingRequest.sender_id !== user.id) return;

                    await fetch(`${API_URL}/conversations/new/${pendingRequest.sender_id}/${pendingRequest.receiver_id}/${user.id}/`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    })
                        .then(res => res.json())
                        .then(data => {
                            setAllConversations(prev => [newConversation, ...prev]);
                            const audio = new Audio('notification.mp3');
                            audio.play()
                        })
                }
            )
            .subscribe();

        setPrivateChannel(newChannel);

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);




    useEffect(() => {
        fetch(`${API_URL}/conversations/all/${user.id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                setAllConversations(data)
                inspectLatestChat(data[0])
                setLoading(false)
            })
            .catch(error => console.log(error));
    }, [])



    useEffect(() => {
        if (!user?.id) return;

        const channelName = `privateConversation-${user.id}`;
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
                    setLatestPrivateMessage(message);
                }
            )
            .subscribe();

        setPrivateChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user.id]);







    useEffect(() => {
        if (!user?.id) return;

        const channelName = `latestmessage-${user.id}}`;
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
                    const newGroupMessage = payload.new;
                    setLatestGroupMessage(newGroupMessage);
                }
            )
            .subscribe();

        setGroupChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });
        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user.id]);


    const [filteredConversations, setFilteredConversations] = useState([]);
    const [inputHasFocus, setInputHasFocus] = useState(false);

    useEffect(() => {
        if (allConversations.length > 0) {
            const filtered = allConversations.filter((conversation) => {
                if (conversation.group?.name) {
                    return conversation.group.name.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (conversation.user?.username) {
                    return conversation.user.username.toLowerCase().includes(searchQuery.toLowerCase());
                }
                return false;
            });
            setFilteredConversations(filtered);
        } else {
            setFilteredConversations([]);
        }
    }, [searchQuery, allConversations]);


    return (
        <aside className={'dashboard-conversation'}>
            <div className="conversation-search-area">
                <div className="conversation-search-header">
                    <h2>Chats</h2>
                    <svg onClick={() => { showNewMessages(); setMiniBar(false)}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
                </div>

                <div className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    <input
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        type="text"
                        id="search"
                        placeholder="Search in contacts"
                        name="search"
                        onFocus={() => setInputHasFocus(true)}
                        onBlur={() => setInputHasFocus(false)
                    }
                    />
                    <svg onClick={() => setSearchQuery('')} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
            </div>


            <div className={`conversations-container ${loading ? 'loading' : ''}`}>
                {loading ? (
                    <>
                        <LoadingExample />
                        <LoadingExample />
                        <LoadingExample />
                    </>
                ) : inputHasFocus ? (
                    filteredConversations.length > 0 ? (
                        filteredConversations.map((conversation, index) =>
                            conversation.group ? (
                                <GroupConversationCard
                                    setAllConversations={setAllConversations}
                                    API_URL={API_URL}
                                    latestGroupMessage={latestGroupMessage}
                                    key={index}
                                    group={conversation.group}
                                    groupId={conversation.group.id}
                                    latestMessage={conversation.latestMessage}
                                    showChatWindow={showChatWindow}
                                    inspectGroupChat={inspectGroupChat}
                                />
                            ) : (
                                <PrivateConversationCard
                                    setAllConversations={setAllConversations}
                                    API_URL={API_URL}
                                    latestPrivateMessage={latestPrivateMessage}
                                    key={index}
                                    user={conversation.user}
                                    friend_id={conversation.user.id}
                                    username={conversation.user.username}
                                    latestMessage={conversation.latestMessage}
                                    showChatWindow={showChatWindow}
                                    inspectPrivateConversation={inspectPrivateConversation}
                                />
                            )
                        )
                    ) : (
                        <p>No matches</p>
                    )
                ) : allConversations.length > 0 ? (
                    allConversations.map((conversation, index) =>
                        conversation.group ? (
                            <GroupConversationCard
                                setAllConversations={setAllConversations}
                                API_URL={API_URL}
                                latestGroupMessage={latestGroupMessage}
                                key={index}
                                group={conversation.group}
                                groupId={conversation.group.id}
                                latestMessage={conversation.latestMessage}
                                showChatWindow={showChatWindow}
                                inspectGroupChat={inspectGroupChat}
                            />
                        ) : (
                            <PrivateConversationCard
                                setAllConversations={setAllConversations}
                                API_URL={API_URL}
                                latestPrivateMessage={latestPrivateMessage}
                                key={index}
                                user={conversation.user}
                                friend_id={conversation.user.id}
                                username={conversation.user.username}
                                latestMessage={conversation.latestMessage}
                                showChatWindow={showChatWindow}
                                inspectPrivateConversation={inspectPrivateConversation}
                            />
                        )
                    )
                ) : (
                    <p>No conversations yet</p>
                )}
            </div>
        </aside>
    )
}