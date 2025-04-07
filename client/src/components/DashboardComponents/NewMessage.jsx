import {Inputfield} from "../Inputfield.jsx";
import {use, useEffect, useState} from "react";
import '../../styles/Dashboard/NewMessage.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {ConversationCard} from "./ConversationCard.jsx";
import {ContactCard} from "./ContactCard.jsx";

export const NewMessage = ({API_URL}) => {

    const [userSearchString, setUserSearchString] = useState("");
    const [receivers, setReceivers] = useState([]);
    const [inputFocused, setInputFocused] = useState(false);
    const [filteredContacts, setFilteredContacts] = useState([]);

    const [userFriends, setUserFriends] = useState([]);
    const {user} = useAuth()

    useEffect(() => {

        fetch(`${API_URL}/friends/all/${user.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserFriends(data);
            })
            .catch(err => console.log(err))

    }, [])


    useEffect(() => {
        const filtered = userFriends.filter((entry) =>
            entry.friend.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [userSearchString, userFriends]);


    const addToConversation = (user) => {
        const alreadyAdded = receivers.find((receiver) => receiver.id === user.id);
        if (!alreadyAdded) {
            setReceivers([...receivers, user]);
        }
    }

    const removeFromConversation = (user) => {
        setReceivers(receivers.filter(receiver => receiver.id !== user.id));
    }


    return (
        <div className="new-message">

            <h2>To:</h2>

            <div className="username-container">
                {receivers.length > 0 && (
                    receivers.map((receiver, index) => (
                        <div className={'group-member-receiver'} key={receiver.id}>
                            <p>{receiver.username}</p>
                            <svg onClick={() => removeFromConversation(receiver)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>
                    ))
                )}
            </div>

            <div className="new-message-input-container">

                <input
                    type="text"
                    id="message"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    value={userSearchString}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setTimeout(() => setInputFocused(false), 150)} // timeout to allow click on dropdown
                    onChange={(e) => setUserSearchString(e.target.value)}
                />

                {inputFocused && (
                    <div className="new-message-search-results">
                        <p>Your contacts</p>
                        {filteredContacts.length > 0 ? (
                            filteredContacts.map((friend) => (
                                <ContactCard
                                    addToConversation={addToConversation}
                                    friend={friend}
                                    key={friend.id}/>
                            ))
                        ) : (
                            <p>No matches found</p>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}