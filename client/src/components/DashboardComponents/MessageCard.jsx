import {UserAvatar} from "../UserAvatar.jsx";
import {use, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment-timezone";
import {Attachment} from "./Attachment.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";



export const MessageCard = ({content, files = null, user_id, sender, time, username = ''}) => {

    const {user} = useAuth();
    const [isGif, setIsGif] = useState(false);

    const {clickOnProfile} = useDynamicStyles();
    const {setShowGroupProfile, API_URL, showUserInfo} = useDashboardContext();

    useEffect(() => {
        content?.endsWith(".gif") || content.includes('media.giphy.com') ? setIsGif(true) : setIsGif(false);
    }, [])

    return (
        <>
            <div className={`dashboard-message ${user.id === user_id ? '' : 'other'}`}>
                <div onClick={() => {
                    showUserInfo(sender);
                    setShowGroupProfile(false);
                    clickOnProfile();
                }} className="dashboard-message-avatar">
                    <UserAvatar API_URL={API_URL} user={sender} height={30} width={30} />
                </div>

                <div className={`dashboard-message-text-container ${user.id === user_id ? '' : 'other'}`}>
                    <div className={`dashboard-message-header ${user.id === user_id ? '' : 'other'}`}>
                        <h3>{moment.utc(time).tz("Europe/Stockholm").format("HH:mm")}</h3>
                        <h3>{username}</h3>
                    </div>

                    <div className={`dashboard-message-body ${user.id === user_id ? '' : 'other'} ${isGif ? 'gif' : ''}`}>
                        {isGif ? (
                            <img src={content} alt={content} />
                        ) : (
                            <>
                                {content && <p>{content}</p>}
                                {files?.length > 0 && files.map((file, i) => (
                                    <Attachment file={file} key={i} />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}