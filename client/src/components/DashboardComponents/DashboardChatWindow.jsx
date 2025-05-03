import '../../styles/Dashboard/DashBoardChatWindow.css';
import {DashboardMessageArea} from "./DashboardMessageArea.jsx";
import {MessageCard} from "./MessageCard.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {UserProfile} from "./UserProfile.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {NewMessage} from "./NewMessage.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {MessageSplitter} from "./MessageSplitter.jsx";
import {GroupMemberInfo} from "./GroupMemberInfo.jsx";
import {ConversationHeader} from "./ConversationHeader.jsx";
import moment from 'moment-timezone';
import {GroupProfile} from "./GroupProfile.jsx";


export const DashboardChatWindow = ({API_URL, setReceiver, currentGroupInfo, showGroupInfo, loadingProfile, showUserInfo, chatName, blockedUsers, setBlockedUsers, setFriend,
                                        selectedUser, miniBar, setMiniBar, groupChat, setChatName, moreUsers, userFriends, loadingMessages,
                                        setGroupChat, messages, setMessages, friend, showMessage, receiver, showGroupMembers}) => {

    const [channel, setChannel] = useState(null);
    const [receivers, setReceivers] = useState([]);
    const {user} = useAuth();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);


    useEffect(() => {

        if (!receiver) return;

        if (!groupChat) {
            const newChannel = supabase
                .channel(`realtime-chat-${receiver}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "messages"
                    },
                    async (payload) => {
                        const newMessage = payload.new;

                        if (
                            (newMessage.sender_id === user.id && newMessage.receiver_id === receiver) ||
                            (newMessage.sender_id === receiver && newMessage.receiver_id === user.id)
                        ) {
                            const { data: enrichedMessage, error } = await supabase
                                .from("messages")
                                .select(`*, sender:sender_id (id, username, avatar)`)
                                .eq("id", newMessage.id)
                                .single();
                            if (error) {
                                console.error("Error enriching message:", error.message);
                            } else {
                                const response = await fetch(`${API_URL}/messages/files/${newMessage.id}`, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                })
                                enrichedMessage.attachments = await response.json();
                                console.log(enrichedMessage);
                                const audio = new Audio('notification.mp3');
                                await audio.play();
                                setMessages((prevMessages) => [...prevMessages, enrichedMessage]);
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

        } else {
            const newChannel = supabase
                .channel(`realtime-chat-${receiver}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "GroupMessages"
                    },
                    async (payload) => {
                        const newMessage = payload.new;

                        const { data: enrichedMessage, error } = await supabase
                                .from("GroupMessages")
                                .select(`*, sender:sender_id ( id, username, avatar)`)
                                .eq("group_id", receiver)
                                .order("created_at", { ascending: false })
                                .limit(1)
                                .single();

                            if (error) {
                                console.error("Error enriching message:", error.message);
                                return;
                            }

                            const response = await fetch(`${API_URL}/messages/files/group/${newMessage.id}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                            enrichedMessage.attachments = await response.json();
                            const audio = new Audio('notification.mp3');
                            await audio.play();
                            setMessages((prevMessages) => [...prevMessages, enrichedMessage]);
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
        }

    }, [receiver]);


    const renderedMessages = useMemo(() => {
        const rendered = [];
        let lastDate = null;

        messages.forEach((message) => {
            const currDate = moment.utc(message.created_at).tz("Europe/Stockholm");

            const isNewDay =
                !lastDate ||
                currDate.year() !== lastDate.year() ||
                currDate.month() !== lastDate.month() ||
                currDate.date() !== lastDate.date();

            if (isNewDay) {
                const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY'); // ex: fredag 3 maj 2025

                rendered.push(
                    <MessageSplitter key={`split-${message.id}`} date={formattedDate} />
                );
                lastDate = currDate;
            }

            rendered.push(
                <MessageCard
                    key={message.id}
                    API_URL={API_URL}
                    showUserInfo={showUserInfo}
                    setMiniBar={setMiniBar}
                    miniBar={miniBar}
                    message={message}
                    content={message.content}
                    time={message.created_at}
                    user_id={message.sender_id}
                    sender={message.sender}
                    username={message.sender?.username || message.Sender?.username || "Unknown"}
                    files={message.attachments || message.AttachedFile || null}
                />
            );
        });

        return rendered;
    }, [messages]);




    return (

        <section className={`dashboard-chat-window`}>
                <>
                    <div className={`dashboard-message-container ${miniBar ? '' : 'mini'}`}>
                        {showMessage ? (
                            <NewMessage moreUsers={moreUsers} userFriends={userFriends} setGroupChat={setGroupChat} receivers={receivers} setReceivers={setReceivers} API_URL={API_URL} />
                        ) : (
                            <ConversationHeader loadingMessages={loadingMessages} showGroupInfo={showGroupInfo} groupChat={groupChat} chatname={chatName} />
                        )}

                        <div className="dashboard-message-content">
                            {showMessage ? (
                                <GroupMemberInfo selectedUser={selectedUser} receivers={receivers}/>
                            ) : (
                                <>
                                    {loadingMessages ? (
                                        <>
                                            <div className="loading-messages-card"/>
                                            <div className="loading-messages-card"/>
                                            <div className="loading-messages-card"/>
                                            <div className="loading-messages-card"/>
                                        </>
                                    ) : (
                                        <>
                                        {renderedMessages}
                                        <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                    </div>

                    {groupChat ? (
                        <GroupProfile headerName={setChatName} showGroupMembers={showGroupMembers} API_URL={API_URL} group={currentGroupInfo} miniBar={miniBar} setMiniBar={setMiniBar} />
                        ) : (
                            <UserProfile loadingProfile={loadingProfile} blockedUsers={blockedUsers} loadingMessages={loadingMessages}
                                         API_URL={API_URL} selectedUser={selectedUser} miniBar={miniBar}
                                         setMiniBar={setMiniBar} setBlockedUsers={setBlockedUsers} />
                        )}
                    <DashboardMessageArea
                        setReceiver={setReceiver} setFriend={setFriend}
                        miniBar={miniBar} groupChat={groupChat} friend={friend}
                        setReceivers={setReceivers} receivers={receivers} loadingMessages={loadingMessages}
                        API_URL={API_URL} receiver={receiver} />
                </>
        </section>
    );
};
