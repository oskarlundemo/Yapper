import {useEffect, useState} from "react";
import '../../styles/Dashboard/NewMessage.css'
import {DropDownWithUsersComponent} from "./DropDownWithUsers.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";

/**
 * This component is used for showing the new message window, where users can
 * start new conversations with each-other
 *
 *
 * @param receivers of the new message
 * @param setReceivers setting the receivers of the new message
 * @param userFriends friends with the user
 * @param moreUsers users who are not friends
 * @returns {JSX.Element}
 * @constructor
 */




export const NewMessage = ({receivers, setReceivers, userFriends, moreUsers}) => {


    const [userSearchString, setUserSearchString] = useState("");   // Search string for new users
    const [inputFocused, setInputFocused] = useState(false);  // Set state to check if input has focus
    const [filteredMoreUsers, setFilteredMoreUsers] = useState([]);  // Filtered array of users who are not friends
    const [filteredContacts, setFilteredContacts] = useState([]); // Filtered array of users friends
    const {phoneUI} = useDynamicStyles();

    const {clickOnBack} = useDynamicStyles();
    const {setGroupChat} = useDashboardContext();


    // This hook is used to popularize the array based on the search string
    useEffect(() => {
        const filtered = userFriends.filter((entry) =>
            entry.friend.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredContacts(filtered);
    }, [userSearchString, userFriends]);


    // This hook is used to popularize the array based on the search string
    useEffect(() => {
        const filtered = moreUsers.filter((entry) =>
            entry.username.toLowerCase().includes(userSearchString.toLowerCase())
        );
        setFilteredMoreUsers(filtered);
    }, [userSearchString, moreUsers]);


    // This hook is used for deciding if the user is starting a group chat or a 1 on 1
    useEffect(() => {
        receivers.length  >= 2 ? setGroupChat(true) : setGroupChat(false);
    }, [receivers]);


    // This function is used for adding new users to the conversation
    const addToConversation = (user) => {
        const alreadyAdded = receivers.find((receiver) => receiver.id === user.id);
        if (!alreadyAdded) {
            setReceivers([...receivers, user]);
        }
    }

    // This function is used for removing the new users in the conversation
    const removeFromConversation = (user) => {
        setReceivers(receivers.filter(receiver => receiver.id !== user.id));
    }


    return (
        <div className={`new-message ${phoneUI ? 'phone' : ''}`}>

            {/* Display if device is phone */ }
            {phoneUI && (
                <svg className={'back-arrow'} onClick={() => clickOnBack()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            )}

            <h2>To:</h2>

            {/* For each receiver of the new message, print their username */}
            <div className="username-container">
                {receivers.length > 0 && (
                    receivers.map((receiver, index) => (
                        <div className={'group-member-receiver'} key={receiver.id}>
                            <p>{receiver.username}</p>
                            <svg onClick={() => removeFromConversation(receiver)}
                                 xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                                 width="24px" fill="#e3e3e3">
                                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
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