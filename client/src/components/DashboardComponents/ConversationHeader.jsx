import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";

/**
 * This component is the header inside the chat window, so users can see what user
 * they are conversation with, either privately or in a group
 *
 * @returns {JSX.Element}
 * @constructor
 */




export const ConversationHeader = ({}) => {

    const {clickOnBack, phoneUI, showMinibar, clickOnProfile} = useDynamicStyles(); // These are bools that updates the layout when users are interacting on a handheld device
    const {groupChat, loadingMessages, chatName, showGroupInfo} = useDashboardContext(); // Bools to set loading states and group chat settings


    return (
        <div className={`conversation-header ${phoneUI ? 'phone-header' : ''}`}>

            {phoneUI && ( // If users are on a phone (800 px <) set this layout
                <svg className={'back-arrow'} onClick={() => clickOnBack()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            )}


            {loadingMessages ? ( // Check if the messages in the conversation is loading, if so, display loading animation
                <div className={`loading-conversation-title ${phoneUI ? 'loading-center' : ''}`} />
            ) : (
                <h2>{chatName}</h2> // Set title to conversation name ex Group chat 1 or username
            )}


            {groupChat ? ( // This functions displays different icons, one for group and one for private conversations, and with the right functions
                (!showMinibar && ( //
                    <svg onClick={() => {showGroupInfo(); clickOnProfile()}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                ))
            ) : (
                (!showMinibar && (
                        <svg onClick={() => clickOnProfile()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                    ))
            )}
        </div>
    )
}