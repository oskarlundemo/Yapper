import '../../styles/Dashboard/DashBoardChatWindow.css';
import {DashboardMessageArea} from "./DashboardMessageArea.jsx";
import {MessageCard} from "./MessageCard.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {NewMessage} from "./NewMessage.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {MessageSplitter} from "./MessageSplitter.jsx";
import {GroupMemberInfo} from "./GroupMemberInfo.jsx";
import {ConversationHeader} from "./ConversationHeader.jsx";
import moment from 'moment-timezone';
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


export const DashboardChatWindow = ({setReceiver, moreUsers,
                                        userFriends, receiver}) => {

    const [channel, setChannel] = useState(null);
    const [receivers, setReceivers] = useState([]);
    const {user} = useAuth();
    const {showMinibar, showChatWindow} = useDynamicStyles();

    const {messages, setMessages, setFriend,
        friend, loadingMessages,
        API_URL, groupChat, showMessage, showNewMessage} = useDashboardContext();

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages]);


    useEffect(() => {
        if (!receiver) return;

        const channelName = groupChat
            ? `realtime-group-chat-${receiver}`
            : `realtime-private-chat-${receiver}`;

        const newChannel = supabase.channel(channelName);

        if (groupChat) {
            newChannel.on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "GroupMessages"
                },
                async (payload) => {
                    const newMessage = payload.new;

                    try {
                        const res = await fetch(`${API_URL}/messages/new/group/${newMessage.group_id}/${newMessage.id}`);
                        const data = await res.json();

                        setMessages(prev => {
                            const exists = prev.some(msg => msg.id === data.id);
                            if (exists) {
                                console.log("Message already exists, skipping:", data.id);
                                return prev;
                            }

                            const updated = [...prev, data];
                            updated.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                            console.log("Updating messages with:", data);
                            return updated;
                        });
                        const audio = new Audio('notification.mp3');
                        await audio.play();
                    } catch (err) {
                        console.error("Error fetching group message:", err);
                    }
                }
            );
        } else {
            newChannel.on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                async (payload) => {
                    const newMessage = payload.new;

                    const isRelevant =
                        (newMessage.sender_id === user.id && newMessage.receiver_id === receiver) ||
                        (newMessage.sender_id === receiver && newMessage.receiver_id === user.id);

                    if (!isRelevant) return;

                    try {
                        // Fetch enriched message directly from Supabase
                        const { data, error } = await supabase
                            .from("messages")
                            .select(`
                                *,
                             sender:users!messages_sender_id_fkey (*),
                             attachments:PrivateMessagesAttachment(*)
                                `)
                            .eq("id", newMessage.id)
                            .single();

                        if (error) {
                            console.error("Error fetching message:", error);
                        } else {
                            console.log("Fetched message with attachments:", data);
                        }

                        setMessages(prev => {
                            const exists = prev.some(msg => msg.id === data.id);
                            if (exists) {
                                console.log("Message already exists, skipping:", data.id);
                                return prev;
                            }

                            const updated = [...prev, data];
                            updated.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                            console.log("Message added:", data);
                            return updated;
                        });

                        const audio = new Audio('notification.mp3');
                        await audio.play();

                    } catch (err) {
                        console.error("Error fetching private message via Supabase:", err);
                    }
                }
            );
        }

        newChannel.subscribe();
        setChannel(prevChannel => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });

        return () => {
            supabase.removeChannel(newChannel);
        };

    }, [groupChat, receiver]);


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
                    const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY');

                    rendered.push(
                        <MessageSplitter key={`split-${message.id}`} date={formattedDate}/>
                    );
                    lastDate = currDate;
                }

                rendered.push(
                    <MessageCard
                        key={message.id}
                        message={message}
                        content={message.content}
                        time={message.created_at}
                        user_id={message.sender_id}
                        sender={message.sender}
                        username={message.sender?.username || message.Sender?.username || "Unknown"}
                        files={message.attachments || message.AttachedFile || []}
                    />
                );
            });
            return rendered;
    }, [messages]);




    return (

        <section className={`dashboard-chat-window ${showMinibar ? "" : "stretch"} ${showChatWindow ? '' : 'hide'} } `}>
                <>
                    <div className={`dashboard-message-container`}>
                        {showNewMessage ? (
                            <NewMessage moreUsers={moreUsers} userFriends={userFriends}
                                        receivers={receivers} setReceivers={setReceivers} />
                            ) : (
                               <ConversationHeader />
                        )}

                        <div className="dashboard-message-content">
                            {showNewMessage ? (
                                <GroupMemberInfo receivers={receivers}/>
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

                    <DashboardMessageArea
                        setReceiver={setReceiver} setReceivers={setReceivers}
                        receivers={receivers} receiver={receiver}
                    />
                </>
        </section>
    );
};
