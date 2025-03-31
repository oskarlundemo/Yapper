import '../../styles/Dashboard/DashBoardChatWindow.css';
import { DashboardMessageArea } from "./DashboardMessageArea.jsx";
import { DashboardMessage } from "./DashboradMessage.jsx";
import {UserProfile} from "./UserProfile.jsx";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";



const supabase = createClient(import.meta.env.VITE_SUPABASE_ANON_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

export const DashboardChatWindow = ({ API_URL, showProfile }) => {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error.message);
            } else {
                console.log("Fetched messages:", data); // 🔍 Debugging log
                setMessages(data);
            }
        };

        fetchMessages();

        const channel = supabase
            .channel("realtime-chat")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);


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
                                    user_id={message.user_id}
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
