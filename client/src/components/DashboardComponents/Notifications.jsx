import {useState} from "react";

import '../../styles/Dashboard/Notifications.css'

export const Notifications = () => {

    const [friendRequest, setFriendRequest] = useState([]);
    const [groupRequest, setGroupRequest] = useState([]);

    return (
        <div className={'notifications-container'}>

            <div className="friendrequests-container">
                <h2>Friend requests</h2>
                <div className={'cards-container'}>
                    {friendRequest.length > 0 ? (
                        <h2>Fake friend request</h2>
                    ) : (
                        <p>No friend request yet</p>
                    )}
                </div>
            </div>

            <div className="grouprequests-container">
                <h2>Group invites</h2>

                <div className="cards-container">
                    {groupRequest.length > 0 ? (
                        <h2>Fake friend request</h2>
                    ) : (
                        <p>No group request yet</p>
                    )}
                </div>
            </div>
        </div>
    )

}