import {useEffect, useState} from "react";
import '../../styles/Dashboard/NewMessage.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {ContactCard} from "./ContactCard.jsx";

export const NewMessage = ({API_URL, receivers, setReceivers, setGroupChat}) => {

    const [userSearchString, setUserSearchString] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const [moreUsers, setMoreUsers] = useState([]);
    const [filteredMoreUsers, setFilteredMoreUsers] = useState([]);

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


        fetch(`${API_URL}/users/${user.id}/filter`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setMoreUsers(data);
            })
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        const filtered = userFriends.filter((entry) =>
            entry.friend.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [userSearchString, userFriends]);


    useEffect(() => {
        const filtered = moreUsers.filter((entry) =>
            entry.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredMoreUsers(filtered);
    }, [userSearchString, moreUsers]);


    useEffect(() => {
        receivers.length  >= 2 ? setGroupChat(true) : setGroupChat(false);
    }, [receivers]);


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
                        onBlur={() => setTimeout(() => setInputFocused(false), 150)} // timeout to allow click on dropdown onChange={(e) => setUserSearchString(e.target.value)}
                />

                {inputFocused && (
                    <div className="new-message-search-results">

                        {filteredContacts.length > 0 && (
                            <>
                                <p className="sub-header-contact">Your contacts</p>
                                {filteredContacts.map((friend) => (
                                    <ContactCard
                                        key={friend.id}
                                        friend={friend}
                                        addToConversation={addToConversation}
                                    />
                                ))}
                            </>
                        )}

                        {filteredMoreUsers.length > 0 && (
                            <>
                                <p className="sub-header-contact">Other users</p>
                                {filteredMoreUsers.map((user) => (
                                    <ContactCard
                                        key={user.id}
                                        friend={user}
                                        addToConversation={addToConversation}
                                    />
                                ))}
                            </>
                        )}

                        {filteredContacts.length === 0 && filteredMoreUsers.length === 0 && (
                            <p className="no-results-text">No users found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}