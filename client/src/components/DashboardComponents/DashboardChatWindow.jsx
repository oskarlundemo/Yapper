import '../../styles/Dashboard/DashBoardChatWindow.css';
import {DashboardMessageArea} from "./DashboardMessageArea.jsx";
import {MessageCard} from "./MessageCard.jsx";
import {useEffect, useRef, useState} from "react";
import {UserProfile} from "./UserProfile.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {NewMessage} from "./NewMessage.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {MessageSplitter} from "./MessageSplitter.jsx";
import {GroupMemberInfo} from "./GroupMemberInfo.jsx";
import {ConversationHeader} from "./ConversationHeader.jsx";
import {GroupProfile} from "./GroupProfile.jsx";


export const DashboardChatWindow = ({API_URL, currentGroupInfo, showGroupInfo, showUserInfo, chatName,
                                        selectedUser, miniBar, setMiniBar, groupChat,
                                        setGroupChat, messages, setMessages, friend, showMessage, receiver}) => {

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



    const renderedMessages = [];
    let lastDate = null;

    messages.forEach((message) => {
        const currDate = new Date(message.created_at);

        const isNewDay =
            !lastDate ||
            currDate.getFullYear() !== lastDate.getFullYear() ||
            currDate.getMonth() !== lastDate.getMonth() ||
            currDate.getDate() !== lastDate.getDate();

        if (isNewDay) {
            const formattedDate = currDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            renderedMessages.push(
                <MessageSplitter key={`split-${message.id}`} date={formattedDate} />
            );
            lastDate = currDate;
        }

        renderedMessages.push(
            <MessageCard
                showUserInfo={showUserInfo}
                setMiniBar={setMiniBar}
                miniBar={miniBar}
                API_URL={API_URL}
                key={message.id}
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




    return (

        <section className={`dashboard-chat-window`}>
                <>
                    <div className={`dashboard-message-container ${miniBar ? '' : 'mini'}`}>
                        {showMessage ? (
                            <NewMessage setGroupChat={setGroupChat} receivers={receivers} setReceivers={setReceivers} API_URL={API_URL} />
                        ) : (
                            <ConversationHeader showGroupInfo={showGroupInfo} groupChat={groupChat} showUserInfo={showUserInfo} chatname={chatName} />
                        )}

                        <div className="dashboard-message-content">
                            {showMessage ? (
                                <GroupMemberInfo selectedUser={selectedUser} receivers={receivers}/>
                            ) : (
                                <>
                                    {renderedMessages}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                    </div>

                    {groupChat ? (
                        <GroupProfile g API_URL={API_URL} group={currentGroupInfo} miniBar={miniBar} setMiniBar={setMiniBar} />
                        ) : (
                            <UserProfile API_URL={API_URL} selectedUser={selectedUser} miniBar={miniBar} setMiniBar={setMiniBar} />
                        )}
                    <DashboardMessageArea miniBar={miniBar} groupChat={groupChat} friend={friend} setReceivers={setReceivers} receivers={receivers} API_URL={API_URL} receiver={receiver} />
                </>
        </section>
    );
};
