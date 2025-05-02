import {PrivateConversationCard} from "./PrivateConversationCard.jsx";
import {use, useEffect, useState} from "react";
import '../../styles/Dashboard/DashboardConversation.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {GroupConversationCard} from "./GroupConversationCard.jsx";
import {LoadingExample} from "./LoadingExample.jsx";
import {supabase} from "../../services/supabaseClient.js";


export const DashboardConversations = ({inspectPrivateConversation, updatedMessage, setMiniBar,
                                           setUpdatedMessage, inspectGroupChat, setShowNewMessage,
                                           showNewMessages, showChatWindow, API_URL}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [allConversations, setAllConversations] = useState([])
    const [loading, setLoading] = useState(true)
    const [privateChannel, setPrivateChannel] = useState(null)
    const [groupChannel, setGroupChannel] = useState(null);
    const [filteredContacts, setFilteredContacts] = useState([]);


    const {user} = useAuth();


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

                    console.log('Payload:', payload);
                    const block = payload.old;
                    console.log('Block:', block)


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
                        console.log(allConversations);
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

                    if (pendingRequest.receiver_id !== user.id && pendingRequest.sender_id !== user.id) return;

                    const { data: enrichedMessage, error } = await supabase
                        .from('PendingFriendRequests')
                        .select('*, sender:sender_id (id, username)')
                        .eq('sender_id', pendingRequest.sender_id)
                        .eq('receiver_id', pendingRequest.receiver_id)
                        .single();

                    if (error) {
                        console.log(error);
                        return;
                    }

                    const response = await fetch(`${API_URL}/conversations/new/${pendingRequest.sender_id}/${pendingRequest.receiver_id}/${user.id}/`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });

                    const newConversation = await response.json();

                    const audio = new Audio('notification.mp3');
                    await audio.play()

                    setAllConversations(prev => [newConversation, ...prev]);
                }
            )
            .subscribe();

        setPrivateChannel(newChannel);

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id]);



    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel('realtime-conversation-group')
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

                    const { data: enrichedMessage, error } = await supabase
                        .from('GroupMembers')
                        .select('*')
                        .eq('group_id', groupMemberEntry.group_id)
                        .eq('member_id', user.id)
                        .single();

                    if (error) {
                        console.log(error);
                        return;
                    }

                    const response = await fetch(`${API_URL}/conversations/new/group/${groupMemberEntry.group_id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    });

                    const newGroupConversation = await response.json();
                    const audio = new Audio('notification.mp3');
                    await audio.play()

                    setAllConversations(prev => [newGroupConversation, ...prev]);
                }
            )
            .subscribe();

        setGroupChannel(newChannel);

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
        if (!updatedMessage) return;

        setAllConversations(prevConversations => {
            const updated = prevConversations.map(conv => {
                if (conv.group && updatedMessage.group_id && conv.group.id === updatedMessage.group_id) {
                    return { ...conv, latestMessage: updatedMessage };
                }

                if (!conv.group && conv.user.id === (user.id === updatedMessage.sender_id ? updatedMessage.receiver_id : updatedMessage.sender_id)) {
                    return { ...conv, latestMessage: updatedMessage };
                }

                return conv;
            });

            return [...updated].sort((a, b) =>
                new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
            );
        });
    }, [updatedMessage]);



    useEffect(() => {
        const filtered = allConversations.filter((entry) =>
            (
                entry.user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entry.group?.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredContacts(filtered);
        console.log(filtered);
    }, [searchQuery, allConversations]);


    const [filteredConversations, setFilteredConversations] = useState([]);

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

    const conversationCards = filteredConversations.map((conversation, index) => {
        if (conversation.group?.id) {
            return (
                <GroupConversationCard
                    API_URL={API_URL}
                    key={index}
                    group={conversation.group}
                    groupId={conversation.group.id}
                    latestMessage={conversation.latestMessage}
                    showChatWindow={showChatWindow}
                    setUpdatedMessage={setUpdatedMessage}
                    inspectGroupChat={inspectGroupChat}
                />
            );
        } else {
            return (
                <PrivateConversationCard
                    API_URL={API_URL}
                    key={index}
                    user={conversation.user}
                    friend_id={conversation.user.id}
                    username={conversation.user.username}
                    latestMessage={conversation.latestMessage}
                    showChatWindow={showChatWindow}
                    setUpdatedMessage={setUpdatedMessage}
                    inspectPrivateConversation={inspectPrivateConversation}
                />
            );
        }
    });


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
                    />
                </div>
            </div>


            <div className={`conversations-container ${loading ? 'loading' : ''}`}>
                {loading ? (
                    <>
                        <LoadingExample />
                        <LoadingExample />
                        <LoadingExample />
                    </>
                ) : filteredConversations.length === 0 ? (
                    <p>{allConversations.length === 0 ? 'No conversations' : 'No matches found'}</p>
                ) : (
                    <>
                        {conversationCards}
                    </>
                )}
            </div>


        </aside>
    )
}