import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { DashboardMessage } from "./DashboradMessage.jsx";
import {UserProfile} from "./UserProfile.jsx";
import { useEffect, useState } from "react";
import {supabase} from "../../../../server/controllers/supabaseController.js";





export const DashboardChatWindow = ({ API_URL, showProfile }) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Function to fetch initial messages
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error.message);
            } else {
                setMessages(data); // Set initial messages in state
            }
        };

        fetchMessages(); // Fetch messages on component mount

        // Set up real-time subscription
        const channel = supabase
            .channel("realtime-chat")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },  // Ensure correct table name
                (payload) => {
                    console.log("New message received:", payload.new);
                    setMessages((prevMessages) => [...prevMessages, payload.new]); // Add new message
                }
            )
            .subscribe();

        // Clean up real-time subscription when component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);  // Empty dependency array ensures this only runs once on mount


    return (
        <section className={'dashboard-chat-window'}>
            {showProfile ? (
                <UserProfile />
            ) : (
                <>
                    <div className={'dashboard-message-container'}>
                        <div className={'conversation-header'}>
                            <h2>Server</h2>
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
                    <DashboardMessageArea/>
                </>
            )}
        </section>
    );
};
