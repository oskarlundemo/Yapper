import {UserAvatar} from "../UserAvatar.jsx";


export const ContactCard = ({friend, addToConversation = null, addToGroup = null}) => {

    return (
        <div onClick={() => addToConversation ? addToConversation(friend) : addToGroup(friend)} className="contact-card">
            <UserAvatar user={friend} height={20} width={20}/>
            <p>{friend.username}</p>
        </div>
    )
}