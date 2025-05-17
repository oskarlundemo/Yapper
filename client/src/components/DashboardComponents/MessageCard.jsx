import {UserAvatar} from "../UserAvatar.jsx";
import {use, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import moment from "moment-timezone";
import {Attachment} from "./Attachment.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This component is used for rendering each individual message in a chat
 *
 *
 *
 * !! The .other CSS-class is used for aligned messages to the left and setting a different background color
 *
 * @param content the message
 * @param files attached with the message
 * @param user_id the logged-in user
 * @param sender the sender of the message
 * @param time the timestamp of the message
 * @param username of the autor of the message
 * @returns {JSX.Element}
 * @constructor
 *
 */




export const MessageCard = ({content, files = null, user_id, sender, time, username = ''}) => {

    const {user} = useAuth();  // Get user token from context
    const [isGif, setIsGif] = useState(false); // Check if the message is a GIF or not

    const {clickOnProfile} = useDynamicStyles();  // Bools for dynamic styling
    const {setShowGroupProfile, showUserInfo} = useDashboardContext(); // UI functions

    // This hook is used checking if the message that was sent was a GIF
    useEffect(() => {
        content?.endsWith(".gif") || content.includes('media.giphy.com') ? setIsGif(true) : setIsGif(false);
    }, [])

    return (
        <>
            {/*If the logged-in user is the one who sent the message, add different css*/}
            <div className={`dashboard-message ${user.id === user_id ? '' : 'other'}`}>
                 <div onClick={() => {
                       showUserInfo(sender);
                       setShowGroupProfile(false);
                       clickOnProfile();
                 }} className="dashboard-message-avatar">
                    <UserAvatar user={sender} height={30} width={30} />
                </div>

                {/*If the logged-in user is the one who sent the message, add different css*/}
                <div className={`dashboard-message-text-container ${user.id === user_id ? '' : 'other'}`}>
                    <div className={`dashboard-message-header ${user.id === user_id ? '' : 'other'}`}>
                        {/* Convert the timestamp to Swedish time */}
                        <h3>{moment.utc(time).tz("Europe/Stockholm").format("HH:mm")}</h3>
                        <h3>{username}</h3>
                    </div>

                    <div className={`dashboard-message-body ${user.id === user_id ? '' : 'other'} ${isGif ? 'gif' : ''}`}>
                        {/* Check if the message was a GIF */}
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