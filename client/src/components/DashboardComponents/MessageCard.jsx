import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment";


export const MessageCard = ({API_URL, content, user_id, time, sender, username}) => {

    const {user} = useAuth();

    return (
        <div className={`dashboard-message ${user.id === user_id ? '' : 'other'}`}>

            <div className={"dashboard-message-avatar"}>
                <UserAvatar height={20} width={20}/>
            </div>

            <div className={`dashboard-message-text-container ${user.id === user_id ? '' : 'other'}`}>
                <div className={`dashboard-message-header ${user.id === user_id ? '' : 'other'}`}>
                    <h3>{moment(time).format("h:mm A")}</h3>
                    <h3>{username}</h3>
                </div>

                <div className={`dashboard-message-body ${user.id === user_id ? '' : 'other'}`}>
                    <p>{content}</p>
                </div>

            </div>

        </div>
    )
}