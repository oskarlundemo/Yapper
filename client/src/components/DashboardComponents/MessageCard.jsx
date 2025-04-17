import {UserAvatar} from "../UserAvatar.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment";


export const MessageCard = ({content, user_id, showUserInfo, sender, time, setMiniBar, miniBar, username = ''}) => {

    const {user} = useAuth();
    const [isGif, setIsGif] = useState(false);

    useEffect(() => {
        content.endsWith(".gif") || content.includes('media.giphy.com') ? setIsGif(true) : setIsGif(false);
    }, [])

    return (
        <div className={`dashboard-message ${user.id === user_id ? '' : 'other'}`}>

            <div onClick={() => showUserInfo(sender)} className={"dashboard-message-avatar"}>
                <UserAvatar user={sender} height={30} width={30}/>
            </div>

            <div className={`dashboard-message-text-container ${user.id === user_id ? '' : 'other'}`}>
                <div className={`dashboard-message-header ${user.id === user_id ? '' : 'other'}`}>
                    <h3>{moment(time).format("h:mm A")}</h3>
                    <h3>{username}</h3>
                </div>

                <div className={`dashboard-message-body ${user.id === user_id ? '' : 'other'} ${isGif ? 'gif' : ''}`}>
                    {isGif ? (
                        <img src={content}  alt={content}/>
                    ) : (
                        <p>{content}</p>
                    )}
                </div>

            </div>

        </div>
    )
}