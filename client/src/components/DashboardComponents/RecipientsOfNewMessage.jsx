import {UserAvatar} from "../UserAvatar.jsx";


export const RecipientsOfNewMessage = ({receivers}) => {


    return (
        <div className="new-conversation-info">
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