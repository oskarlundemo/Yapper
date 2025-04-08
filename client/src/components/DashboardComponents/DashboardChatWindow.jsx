import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { MessageCard } from "./MessageCard.jsx";
import {useEffect, useRef, useState} from "react";
import {UserProfile} from "./UserProfile.jsx";
import {supabase} from "../../../../server/controllers/supabaseController.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {Notifications} from "./Notifications.jsx";
import {NewMessage} from "./NewMessage.jsx";



export const DashboardChatWindow = ({API_URL, showChatWindow, showMessage, inspectConversation, receiver, showProfile, showRequests}) => {

    const [receiverUsername, setReceiverUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState(null); // Store the subscription channel
    const [receivers, setReceivers] = useState([]);
    const {user} = useAuth();

    useEffect(() => {
        if (!receiver) return;
        fetch(`${API_URL}/conversations/receiver/username/${receiver}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setReceiverUsername(data.username);
            })
            .catch(err => console.log(err));

    }, [receiver]);


    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    useEffect(() => {

        if (!receiver) return;

        fetch(`${API_URL}/messages/conversation/${user.id}/${receiver}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(err => console.log(err));


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
                            .select(`
                        *,
                        sender:sender_id (
                            id,
                            username
                        )
                    `)
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
    }, [receiver]);

    return (
        <section className={'dashboard-chat-window'}>
            {showProfile ? (
                <UserProfile />
            ) : showRequests ? (
                <Notifications showChatWindow={showChatWindow} inspectConversation={inspectConversation} API_URL={API_URL} />
            ) : (
                <>
                    <div className={'dashboard-message-container'}>

                        {showMessage ? (
                            <NewMessage receivers={receivers} setReceivers={setReceivers} API_URL={API_URL} />
                        ) : (
                            <div className={'conversation-header'}>
                                <h2>{receiverUsername}</h2>
                            </div>
                        )}

                        <div className="dashboard-message-content">
                            {showMessage ? (
                                <p>New convo</p>
                            ) : (
                                <>
                                    {messages.length > 0 &&
                                        messages.map((message) => (
                                            <MessageCard
                                                API_URL={API_URL}
                                                key={message.id}
                                                message={message}
                                                content={message.content}
                                                time={message.created_at}
                                                user_id={message.sender_id}
                                                username={message.sender.username}
                                            />
                                        ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>
                    </div>
                    <DashboardMessageArea setReceivers={setReceivers} receivers={receivers} API_URL={API_URL} receiver={receiver} />
                </>
            )}
        </section>
    );
};
