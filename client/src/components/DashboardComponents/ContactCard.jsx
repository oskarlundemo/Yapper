import {UserAvatar} from "../UserAvatar.jsx";


/**
 * This component is used for rendering cards of contacts when a user searches for
 * new conversations with other users. It us used for example in DropDownWithUsersComponent.jsx
 *
 *
 * @param friend // Check if the user is a friend
 * @param addToConversation // Add a user to a new group chat
 * @param setUserSearchString // Set the string of searching for other users
 * @param addToGroup  // Function to add users to group chat
 * @returns {JSX.Element}
 * @constructor
 */



export const ContactCard = ({friend, addToConversation = null,
                                setUserSearchString = '', addToGroup = null}) => {

    return (
        <div onClick={() => {
            addToConversation ? addToConversation(friend) : addToGroup(friend); setUserSearchString('')
        }} className="contact-card">
            <UserAvatar user={friend} height={20} width={20}/>
            <p>{friend.username}</p>
        </div>
    )
}