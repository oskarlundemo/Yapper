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


export const DashboardChatWindow = ({setReceiver, setFriend,
                                        moreUsers, userFriends, messages, setMessages, friend, showMessage, receiver}) => {

    const [channel, setChannel] = useState(null);
    const [receivers, setReceivers] = useState([]);
    const {user} = useAuth();
    const {showMinibar, showUserInfo} = useDynamicStyles();


    const {groupChat, API_URL, loadingMessages} = useDashboardContext();

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
                            await fetch(`${API_URL}/messages/new/private/${newMessage.id}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            })
                                .then(res => res.json())
                                .then(async data => {
                                    setMessages((prevMessages) => [...prevMessages, data]);
                                    const audio = new Audio('notification.mp3');
                                    await audio.play();
                                })
                                .catch(err => console.log(err));
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

                        await fetch(`${API_URL}/messages/new/group/${newMessage.group_id}/${newMessage.id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })
                            .then(res => res.json())
                            .then(async data => {
                                setMessages((prevMessages) => [...prevMessages, data]);
                                const audio = new Audio('notification.mp3');
                                await audio.play();
                            })
                            .catch(err => console.log(err));
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
                const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY');

                rendered.push(
                    <MessageSplitter key={`split-${message.id}`} date={formattedDate} />
                );
                lastDate = currDate;
            }

            rendered.push(
                <MessageCard
                    key={message.id}
                    showUserInfo={showUserInfo}
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



    const {showChatWindow} = useDynamicStyles();

    return (

        <section className={`dashboard-chat-window ${showMinibar ? "" : "stretch"} ${showChatWindow ? '' : 'hide'} } `}>
                <>
                    <div className={`dashboard-message-container`}>
                        {showMessage ? (
                            <NewMessage moreUsers={moreUsers} userFriends={userFriends}
                                        setGroupChat={setGroupChat} receivers={receivers}
                                        setReceivers={setReceivers} API_URL={API_URL} />
                        ) : (

                            <ConversationHeader />
                        )}

                        <div className="dashboard-message-content">
                            {showMessage ? (
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
                        setReceiver={setReceiver} setFriend={setFriend} friend={friend}
                        setReceivers={setReceivers} receivers={receivers}
                        receiver={receiver} />
                </>
        </section>
    );
};
