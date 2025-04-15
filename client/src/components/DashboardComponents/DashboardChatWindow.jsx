import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { MessageCard } from "./MessageCard.jsx";
import {useEffect, useRef, useState} from "react";
import {UserProfile} from "./UserProfile.jsx";
import {supabase} from "../../../../server/controllers/supabaseController.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {NewMessage} from "./NewMessage.jsx";
import {UserAvatar} from "../UserAvatar.jsx";



export const DashboardChatWindow = ({API_URL, showUserInfo, chatName, inspectedUser, miniBar, setMiniBar, groupChat, setGroupChat, showChatWindow, messages, setMessages, friend, showMessage, inspectConversation, receiver, showProfile, showRequests}) => {

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
                                .select(`*, sender:sender_id (
                                id, username)`)
                                .eq("id", newMessage.id)
                                .single();
                            if (error) {
                                console.error("Error enriching message:", error.message);
                                return;
                            }
                            setMessages((prevMessages) => [...prevMessages, enrichedMessage]);
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
                    async () => {
                        {
                            const { data: enrichedMessage, error } = await supabase
                                .from("GroupMessages")
                                .select(`*, sender:sender_id ( id, username )`)
                                .eq("group_id", receiver)
                                .order("created_at", { ascending: false })
                                .limit(1)
                                .single();

                            if (error) {
                                console.error("Error enriching message:", error.message);
                                return;
                            }
                            setMessages((prevMessages) => [...prevMessages, enrichedMessage]);
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
        }

    }, [receiver]);

    return (
        <section className={`dashboard-chat-window`}>
                <>
                    <div className={`dashboard-message-container ${miniBar ? '' : 'mini'}`}>
                        {showMessage ? (
                            <NewMessage setGroupChat={setGroupChat} receivers={receivers} setReceivers={setReceivers} API_URL={API_URL} />
                        ) : (
                            <div className={'conversation-header'}>
                                <h2>{chatName}</h2>
                            </div>
                        )}

                        <div className="dashboard-message-content">
                            {showMessage ? (
                                <div className="new-conversation-info">
                                    <div className="avatar-section-new-convo">
                                        {receivers.length > 0 &&
                                            receivers.map((receiver) => (
                                                <UserAvatar
                                                    width={40} height={40}
                                                    key={receiver.id}
                                                    user={receiver}

                                                />
                                            ))
                                        }

                                        <div className="new-convo-section-username">
                                            {receivers.length > 0 &&
                                                receivers.map((receiver) => (
                                                    <p key={receiver.id}>{receiver.username}</p>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.length > 0 &&
                                        messages.map((message) => (
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
                                            />
                                        ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                    </div>
                    <UserProfile inspectedUser={inspectedUser} API_URL={API_URL} miniBar={miniBar} setMiniBar={setMiniBar} />
                    <DashboardMessageArea miniBar={miniBar} groupChat={groupChat} friend={friend} setReceivers={setReceivers} receivers={receivers} API_URL={API_URL} receiver={receiver} />
                </>
        </section>
    );
};
