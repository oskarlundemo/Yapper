import {UserAvatar} from "../UserAvatar.jsx";


export const ContactCard = ({friend, addToConversation = null, setUserSearchString = '', addToGroup = null}) => {

    return (
        <div onClick={() => {addToConversation ? addToConversation(friend) : addToGroup(friend); setUserSearchString('') }} className="contact-card">
            <UserAvatar user={friend} height={20} width={20}/>
            <p>{friend.username}</p>
        </div>
    )
}