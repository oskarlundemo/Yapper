import {useEffect, useState} from "react";

import '../../styles/Dashboard/Notifications.css'
import {supabase} from "../../../../server/controllers/supabaseController.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {ConversationCard} from "./ConversationCard.jsx";

export const Notifications = ({API_URL, showChatWindow, inspectConversation}) => {

    const [friendRequest, setFriendRequest] = useState([]);
    const [groupRequest, setGroupRequest] = useState([]);
    const [channel, setChannel] = useState(null); // Store the subscription channel

    const {user} = useAuth();

    useEffect(() => {
        const fetchFriendRequest = async () => {
            await fetch(`${API_URL}/notifications/friend/requests/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setFriendRequest(data);
                })
                .catch(err => console.log(err));
        }

        fetchFriendRequest();

        const newChannel = supabase
            .channel('realtime-requests')
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'PendingFriendRequests'
                },
                (payload) => {
                const newFriendRequest = payload.new;

                if(newFriendRequest.receiver_id === user.id) {
                     setFriendRequest((prevReq) => [...prevReq, newFriendRequest]);
                }
            })
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

    }, [])



    return (
        <div className={'notifications-container'}>

            <div className="friendrequests-container">
                <h2>Friend requests</h2>
                    <div className={'cards-container'}>
                        {friendRequest.length > 0 ? (
                            friendRequest.map((sender) => (
                                <ConversationCard
                                    showChatWindow={showChatWindow}
                                    className="request-card"
                                    key={sender.sender_id}
                                    conversationId={sender.sender_id}
                                    inspectConversation={inspectConversation}
                                    username={sender.Sender.username}
                                    message={sender?.Sender.messagesSent[0].content}
                                />
                            ))
                        ) : (
                            <p>No friend request yet</p>
                        )}
                    </div>
            </div>

            <div className="grouprequests-container">
                <h2>Group invites</h2>

                <div className="cards-container">
                    {groupRequest.length > 0 ? (
                        <h2>Fake friend request</h2>
                    ) : (
                        <p>No group request yet</p>
                    )}
                </div>
            </div>
        </div>
    )

}