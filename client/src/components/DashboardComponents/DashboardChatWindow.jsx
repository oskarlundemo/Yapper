import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { DashboardMessage } from "./DashboradMessage.jsx";
import {useEffect, useState} from "react";
import {UserProfile} from "./UserProfile.jsx";
import {supabase} from "../../../../server/controllers/supabaseController.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {Notifications} from "./Notifications.jsx";



export const DashboardChatWindow = ({ API_URL, receiver, showProfile, showRequests}) => {


    const [receiverUsername, setReceiverUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [channel, setChannel] = useState(null); // Store the subscription channel
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



    useEffect(() => {
        if (!receiver) return;

        console.log("Fetching messages for receiver:", receiver);

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .or(
                    `and(sender_id.eq.${user.id},receiver_id.eq.${receiver}), and(sender_id.eq.${receiver},receiver_id.eq.${user.id})`
                )
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error.message);
            } else {
                setMessages(data);
            }
        };

        fetchMessages();

        // Remove previous subscription before setting a new one
        const newChannel = supabase
            .channel(`realtime-chat-${receiver}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages"
                },
                (payload) => {
                    const newMessage = payload.new;
                    if (
                        (newMessage.sender_id === user.id && newMessage.receiver_id === receiver) ||
                        (newMessage.sender_id === receiver && newMessage.receiver_id === user.id)
                    ) {
                        setMessages((prevMessages) => [...prevMessages, newMessage]); // Append new message
                    }
                }
            )
            .subscribe();

        setChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel); // Ensure old channel is removed
            }
            return newChannel; // Store the latest channel in state
        });

        return () => {
            supabase.removeChannel(newChannel); // Cleanup function with latest channel reference
        };
    }, [receiver]);





    return (
        <section className={'dashboard-chat-window'}>
            {showProfile ? (
                <UserProfile />
            ) : showRequests ? (
                <Notifications />
            ) : (
                <>
                    <div className={'dashboard-message-container'}>
                        <div className={'conversation-header'}>
                            <h2>{receiverUsername}</h2>
                        </div>
                        <div className={'dashboard-message-content'}>
                            {messages.length > 0 && messages.map((message) => (
                                <DashboardMessage
                                    API_URL={API_URL}
                                    key={message.id}
                                    message={message}
                                    content={message.content}
                                    time={message.created_at}
                                    user_id={message.sender_id}
                                />
                            ))}
                        </div>
                    </div>
                    <DashboardMessageArea receiver={receiver} />
                </>
            )}
        </section>
    );
};
