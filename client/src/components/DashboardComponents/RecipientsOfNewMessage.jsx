import {UserAvatar} from "../UserAvatar.jsx";

/**
 * This component is used for displaying the username and avatars
 * of the users who are receiving the new message
 *
 *
 * @param receivers of the new message
 * @returns {JSX.Element}
 * @constructor
 */




export const RecipientsOfNewMessage = ({receivers}) => {

    return (
        <div className="new-conversation-info">
            {/* Show all the receivers avatars so it is clear who are in the new conversation*/}
            <div className="avatar-section-new-convo">
                {receivers.length > 0 &&
                    receivers.map((receiver) => (
                        <UserAvatar
                            width={40} height={40}
                            key={receiver.id}
                            user={receiver}
                        />
                    ))
                }
            </div>

            {/* Add all their usernames so it is clear who are in the chat */}
            <div className="new-convo-section-username">
                    {receivers.length > 0 &&
                        <h2>
                            {receivers.map(r => r.username).join(', ')}
                        </h2>
                    }
            </div>
        </div>
    )
}