import {ConversationCard} from "./ConversationCard.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/DashboardConversation.css'
import {useAuth} from "../../context/AuthContext.jsx";


export const DashboardConversations = ({inspectConversation, showChatWindow, API_URL, showProfile}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [conversations, setConversations] = useState([])
    const {user} = useAuth();

    useEffect(() => {
        fetch(`${API_URL}/conversations/${user.id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            }
        })
            .then(response => response.json())
            .then(data => {
                setConversations(data)
                console.log(data)
            })
            .catch(error => console.log(error));
    }, [])

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             await fetch(`${API_URL}/conversations/filter/${searchQuery}/${user.id}`,
                 {
                     method: "GET",
                     headers: {
                         "Content-Type": "application/json",
                     }
                 })
                 .then(response => response.json())
                 .then(data => {
                     console.log(data);
                     setConversations(data)
                 })
                 .catch(err => console.log(err));
        } catch (err) {
            console.error(err);
        }
    }


    return (
        <aside className={'dashboard-conversation'}>
            <div className="conversation-search-area">
                <form onSubmit={handleSubmit} className="search-bar">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
                    <input
                        onChange={handleSearchChange}
                        value={searchQuery}
                        type="text"
                        id="search"
                        placeholder="Search in Yapper"
                        name="search"
                    />
                </form>
            </div>

            <div className="conversations-container">
                {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                        <ConversationCard
                            friend_id={conversation.id}
                            showChatWindow={showChatWindow}
                            inspectConversation={inspectConversation}
                            username={conversation.username}
                            key={conversation.id}
                            conversationId={conversation.id}
                            latestMessage={conversation.latestMessage}
                        />))
                ) : (
                    <p>No conversations yet</p>
                )}
            </div>

        </aside>
    )
}