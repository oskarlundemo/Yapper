import {useEffect, useState} from "react";

import '../../styles/Dashboard/Notifications.css'
import {supabase} from "../../../../server/controllers/supabaseController.js";
import {useAuth} from "../../context/AuthContext.jsx";
import {PrivateConversationCard} from "./PrivateConversationCard.jsx";

export const Notifications = ({API_URL, showChatWindow, inspectConversation}) => {

    const [friendRequest, setFriendRequest] = useState([]);
    const [groupRequest, setGroupRequest] = useState([]);
    const [channel, setChannel] = useState(null); // Store the subscription channel

    const {user} = useAuth();

    useEffect(() => {

        fetch(`${API_URL}/notifications/friend/requests/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(data => {
                    setFriendRequest(data);
                })
                .catch(err => console.log(err));



         fetch(`${API_URL}/notifications/group/requests/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(res => res.json())
                .then(data => {
                    setGroupRequest(data);
                })
                .catch(err => console.log(err));

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
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });

        return () => {
            supabase.removeChannel(newChannel);
        };

    }, [])



    return (
        <div className={'notifications-container'}>

            <div className="friendrequests-container">
                <h2>Friend requests</h2>
                    <div className={'cards-container'}>
                        {friendRequest.length > 0 ? (
                            friendRequest.map((sender) => (
                                <PrivateConversationCard
                                    showChatWindow={showChatWindow}
                                    className="request-card"
                                    key={sender.sender_id}
                                    conversationId={sender.sender_id}
                                    inspectConversation={inspectConversation}
                                    username={sender?.Sender.username}
                                    message={sender?.Sender.messagesSent[0].content}
                                    timeStamp={sender?.Sender.messagesSent[0].created_at}
                                />
                            ))
                        ) : (
                            <p>No friend request</p>
                        )}
                    </div>
            </div>

            <div className="grouprequests-container">
                <h2>Group invites</h2>

                <div className="cards-container">
                    {groupRequest.length > 0 ? (
                        groupRequest.map((groupAdmin) => (
                            <PrivateConversationCard
                                showChatWindow={showChatWindow}
                                className="request-card"
                                key={groupAdmin.id}
                                conversationId={groupAdmin.Group.id}
                                inspectConversation={inspectConversation}
                                username={groupAdmin.Group.name || ''}
                                message={groupAdmin?.Group.GroupMessages[0].content}
                                groupChat={true}
                                timeStamp={groupAdmin.Group.GroupMessages[0].created_at}
                            />
                        ))
                    ) : (
                        <p>No group request</p>
                    )}
                </div>
            </div>
        </div>
    )

}