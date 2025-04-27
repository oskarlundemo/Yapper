import {UserAvatar} from "../UserAvatar.jsx";


export const ContactCard = ({friend, addToConversation = null}) => {

    return (
        <div onClick={() => addToConversation(friend)} className="contact-card">
            <UserAvatar user={friend} height={20} width={20}/>
            <p>{friend.username}</p>
        </div>
    )
}