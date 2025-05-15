import '../../styles/Dashboard/DashBoardChatWindow.css';
import {DashboardMessageArea} from "./DashboardMessageArea.jsx";
import {MessageCard} from "./MessageCard.jsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {NewMessage} from "./NewMessage.jsx";
import {supabase} from "../../services/supabaseClient.js";
import {MessageSplitter} from "./MessageSplitter.jsx";
import {RecipientsOfNewMessage} from "./RecipientsOfNewMessage.jsx";
import {ConversationHeader} from "./ConversationHeader.jsx";
import moment from 'moment-timezone';
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {soundEffect} from "../../services/helperFunctions.js";


/**
 * This is the chat window where users can see the chat and the messages sent in the conversation.
 *
 * @param setReceiver // Recipients of the message
 * @param moreUsers // Users that are not friends
 * @param userFriends // Friends to the user
 * @param receiver // Recipient of the message
 * @returns {JSX.Element}
 * @constructor
 */





export const DashboardChatWindow = ({setReceiver, moreUsers,
                                        userFriends}) => {

    const [channel, setChannel] = useState(null); // Channel for Supabase
    const [receivers, setReceivers] = useState([]); // Set the recipient of new message
    const {user} = useAuth(); // Get the jwt token form the context
    const {showMinibar, showChatWindow} = useDynamicStyles(); // These bools are used for updating the UI

    const {messages, setMessages, loadingMessages, receiver,
        API_URL, groupChat, showNewMessage} = useDashboardContext();

    const messagesEndRef = useRef(null); // Used to automatically always scroll down once a new message is added

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // Listen for new messages and scroll down automatically
    }, [messages]);


    useEffect(() => {
        if (!receiver) return;

        const channelName = groupChat
            ? `realtime-group-chat-${receiver}`  // channel for group message
            : `realtime-private-chat-${[user.id, receiver].sort().join("-")}`; // joined channel for private channels

        const newChannel = supabase.channel(channelName); // Create channel

        if (groupChat) { // If this is a group chat, create this channel
            newChannel.on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "GroupMessages"
                },
                async (payload) => {
                    const newMessage = payload.new; // New group message

                    try {
                        const res = await fetch(`${API_URL}/messages/new/group/${newMessage.group_id}/${newMessage.id}`); // Fetch the enirched message from backend
                        const data = await res.json();

                        // Add it to the messages displayed in the chat window
                        setMessages(prev => {
                            const alreadyExists = prev.some(msg => msg.id === data.id);
                            if (alreadyExists) return prev;

                            return [...prev, data];
                        });
                        await soundEffect(); // Play sound effect
                    } catch (err) {
                        console.error("Error fetching group message:", err);
                    }
                }
            );
        } else { // Create this channel for private conversations
            newChannel.on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                async (payload) => {
                    const newMessage = payload.new;

                    // If user is either sender or receiver of the latest message inserted into the messages table, fetch enriched message
                    const isRelevant =
                        (newMessage.sender_id === user.id && newMessage.receiver_id === receiver) ||
                        (newMessage.sender_id === receiver && newMessage.receiver_id === user.id);

                    // Neither recipient or sender, return
                    if (!isRelevant) return;

                    try {
                        // Recipient or sender, fetch enriched message
                        const res = await fetch(`${API_URL}/messages/new/private/${newMessage.id}`);
                        const data = await res.json();

                        // Add message to conversation
                        setMessages(prev => {
                            const alreadyExists = prev.some(msg => msg.id === data.id);
                            if (alreadyExists) return prev;
                            return [...prev, data];
                        });

                        await soundEffect(); // Play sound effect
                    } catch (err) {
                        console.error("Error fetching private message:", err);
                    }
                }
            );
        }

        // Subscribe to the new real-time channel to start listening for events (like new messages)
        newChannel.subscribe();

        setChannel(prevChannel => {
            // If there's an existing channel (from a previous conversation), remove it to prevent duplicate listeners
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }

            // Set the new channel as the active one
            return newChannel;
        });


        // Cleanup function for when the component unmounts or dependencies (like groupChat or receiver) change
        // This ensures that the old channel is properly unsubscribed from to avoid memory leaks or duplicate event
        return () => {
            supabase.removeChannel(newChannel);
        };

    }, [groupChat, receiver]);


    // Parse the messages into an array of messages to be displayed
    const renderedMessages = useMemo(() => {
        const rendered = []; // Array of rendered messages
        let lastDate = null; // Track the date of the messages

        // Loop through the message
        messages.forEach((message) => {

            const currDate = moment.utc(message.created_at).tz("Europe/Stockholm"); // Set the current time to now

            // This is used for checking if the message was sent during the same day or not, if so content, else add a MessageSplitter
            const isNewDay =
                !lastDate ||
                currDate.year() !== lastDate.year() ||
                currDate.month() !== lastDate.month() ||
                currDate.date() !== lastDate.date();


            if (isNewDay) { // New day, insert a MessageSplitter component in the chat window
                const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY');
                rendered.push(
                    <MessageSplitter key={`split-${message.id}`} date={formattedDate}/>
                );
                lastDate = currDate; //
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
                    files={message.attachments || message.AttachedFile || []}/>);
            });

            return rendered;
    }, [messages]);


    return (

        <section className={`dashboard-chat-window ${showMinibar ? "" : "stretch"} ${showChatWindow ? '' : 'hide'} } `}>
                <>
                    <div className={`dashboard-message-container`}>

                        {showNewMessage ? ( // If users click on write a new message, display that component instead
                            <NewMessage moreUsers={moreUsers} userFriends={userFriends}
                                        receivers={receivers} setReceivers={setReceivers} />
                            ) : (
                               <ConversationHeader/>
                            )
                        }

                        <div className="dashboard-message-content">
                            {showNewMessage ? ( // If users wants to write a new message, show the recipients that are updated in realtime
                                <RecipientsOfNewMessage receivers={receivers}/>
                            ) : (
                                <>
                                    {loadingMessages ? ( // Are messages done loading, if not show loading animation
                                        <>
                                            {/* Mock up grey squares */}
                                            <div className="loading-messages-card"/>
                                            <div className="loading-messages-card"/>

                                            <div className="loading-messages-card"/>
                                            <div className="loading-messages-card"/>
                                        </>
                                    ) : (
                                        // Messages done loading, display in chat
                                        <>
                                            {/* Messages from in the conversation */}
                                            {renderedMessages}

                                            {/* This is used for automatically scrolling down for new message */}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* This is the component where the enters the message, the input area */}
                    <DashboardMessageArea
                        setReceiver={setReceiver} setReceivers={setReceivers}
                        receivers={receivers} receiver={receiver}/>
                </>
        </section>
    );
};
