import {useEffect, useState} from "react";
import '../../styles/Dashboard/NewMessage.css'
import {useAuth} from "../../context/AuthContext.jsx";
import {ContactCard} from "./ContactCard.jsx";
import {DropDownWithUsersComponent} from "./DropDownWithUsers.jsx";

export const NewMessage = ({API_URL, receivers, setReceivers, setGroupChat, userFriends, moreUsers}) => {

    const [userSearchString, setUserSearchString] = useState("");
    const [inputFocused, setInputFocused] = useState(false);
    const [filteredMoreUsers, setFilteredMoreUsers] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const {user} = useAuth()


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

            <DropDownWithUsersComponent
                filteredContacts={filteredContacts}
                filteredMoreUsers={filteredMoreUsers}
                setInputFocused={setInputFocused}
                userSearchString={userSearchString}
                inputFocused={inputFocused}
                setUserSearchString={setUserSearchString}
                addToConversation={addToConversation}
            />


        </div>
    )
}