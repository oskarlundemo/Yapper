


import '../../styles/Dashboard/ConversationCard.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {parseLatestMessage, parseLatestTimestamp} from "../../services/helperFunctions.js";


/**
 * This component is used for printing a clickable card that represent a
 * conversations with another user, a 1-on-1 conversation
 *
 *
 * @param friend_id the id of the friend
 * @param oppositeUser the opposite user
 * @param setAllConversations set the array of all the conversations
 * @param latestPrivateMessage latest messages inserted on the PrivateMessages table
 * @param latestMessage the latest message that was sent between two users in a conversation
 * @param username of the other user
 * @returns {JSX.Element}
 * @constructor
 */





export const PrivateConversationCard = ({friend_id, user: oppositeUser, setAllConversations,
                                            latestPrivateMessage = null,
                                            latestMessage = null}) => {

    const {user: loggedIn} = useAuth(); // Get the logged in users token

    const {clickOnChat} = useDynamicStyles(); // Context to update the UI
    const {showChatWindow, inspectPrivateConversation, API_URL} = useDashboardContext(); // Context to update UI

    useEffect( () => {
        const fetchMessageData = async () => {
            await fetch(`${API_URL}/conversations/new/private/${latestPrivateMessage.id}/${latestPrivateMessage.receiver_id}
            /${latestPrivateMessage.sender_id}/${loggedIn.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {

                    // Sort the conversations desc, so the one with latest message lands on top
                    setAllConversations(prev =>
                        [
                            ...prev.filter(conv => conv.user?.id !== data.user.id),
                            data
                        ].sort((a, b) =>
                            new Date(b.latestMessage?.created_at || 0) - new Date(a.latestMessage?.created_at || 0)
                        )
                    );
                })
                .catch(error => console.log(error))
        }

        // If the latest message that was inserted into the PrivateMessages table was either sent or received by the user and their friend, update the conversation
        if (
            (latestPrivateMessage?.sender_id === loggedIn.id && latestPrivateMessage?.receiver_id === friend_id) ||
            (latestPrivateMessage?.sender_id === friend_id && latestPrivateMessage?.receiver_id === loggedIn.id)
        )
            fetchMessageData();

    }, [latestPrivateMessage]);


    return (
        <div onClick={() => {
            showChatWindow();
            inspectPrivateConversation(friend_id, oppositeUser.username);
            clickOnChat();
        }}  className="conversation-card">
            <div className="conversation-card-avatar">
                {/* Show the avatar of the opposite user*/}
                <UserAvatar user={oppositeUser} height={40} width={40} />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>
                    {oppositeUser.username}
                    <span>
                        {parseLatestTimestamp(latestMessage)}
                    </span>
                </h3>

                {/* If the sender of the latest message was the logged-in user, preface with you: */}
                <p className={'conversation-content'}>
                    {loggedIn.id === (latestMessage?.sender?.id || latestMessage?.sender_id) && <span>You: </span>}
                    {parseLatestMessage(latestMessage)}
                </p>
            </div>
        </div>
    )
}


