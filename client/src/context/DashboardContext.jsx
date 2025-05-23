import {createContext, useContext, useState} from "react";
import {useAuth} from "./AuthContext.jsx";


/**
 * This context is mainly used for UI related state, updating the
 * layout once thw viewport 800 px <.
 *
 *
 * @type {React.Context<unknown>}
 */



const DashboardContext = createContext();

export const DashboardContextProvider = ({ children }) => {

    const [inspectedUser, setInspectedUser] = useState(null); // Set the inspected user in a conversation

    const API_URL = import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_BASE_URL
        : "/api";

    const [receiver, setReceiver] = useState(null);                         // Set receiver of a message
    const [groupChat, setGroupChat] = useState(false);             // Set group chat to either true or false
    const [miniBar, setMiniBar] = useState(false);                 // State to control layout, showing the user/profile and therefore minimizing the chat window
    const [selectedUser, setSelectedUser] = useState(null);                 // Set the selected user in a conversation
    const [hideOverlay, setHideOverlay] = useState(true);          // Hide or show overlay
    const [hideGroupPopUp, setHideGroupPopUp] = useState(true);   // Hide or show the group pop-up window
    const [loadingMessages, setLoadingMessages] = useState(true); // State to check loading message
    const [loadingProfile, setLoadingProfile] = useState(true);   // State to check if profile is done loading
    const [showGroupProfile, setShowGroupProfile] = useState(true); // State to check if users inspects a group chat or a user profile
    const [chatName, setChatName] = useState("");                  // Set the title of the conersation, either the group chat name or username
    const [currentGroupInfo, setCurrentGroupInfo] = useState(null);        // The group chat the user has inspected currently

    const [showProfile, setShowProfile] = useState(false);       // Show the users profile state
    const [showRequests, setShowRequests] = useState(false);     // Show requests
    const [showNewMessage, setShowNewMessage] = useState(false); // Show the new message window

    const [messages, setMessages] = useState([]);   // This state is used for loading and setting all the messages in a conversation
    const [friend, setFriend] = useState(null);            // This state is used for checking if the two users in a 1v1 conversation are friends

    const {user} = useAuth();

    // This function removes the new message window
    const hideNewMessage = () => {
        setShowNewMessage(false);
    }

    // This function shows the new message window
    const showNewMessages = () => {
        setShowNewMessage(true);
        setReceiver(null);
        setShowProfile(false);
    }

    // This function shows the chat window
    const showChatWindow = () => {
        setShowProfile(false);
        setShowRequests(false);
        setShowNewMessage(false);
    }

    // This function is called when a user clicks on another users avatar in a conversation and want to check their profile
    const showUserInfo = async (inspectedUser = null) => {

        setMiniBar(true); // Set to true so we can see the info
        setLoadingProfile(true);  // Set to loading while waiting

        await fetch(`${API_URL}/users/${inspectedUser.id}/profile/info`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setSelectedUser(data);
                setLoadingProfile(false);
            })
            .catch(error => console.log(error));
    }


    // This function is called when a user clicks on a GroupConversationCard.jsx component and wants to inspect / write in a group chat
    const inspectGroupChat = async (groupID, groupname, initialLoad) => {

        // This only runs when it is the first time a users signs in, otherwise it would trigger the loading
        if (!initialLoad) {
            setLoadingMessages(true);
        }

        setGroupChat(true);  // Now we are in a group chat
        setReceiver(groupID); // ID of the group
        showChatWindow();    // Show the chat window
        setChatName(groupname);  // Set the title of the conversation to the group name
        fetch(`${API_URL}/messages/group/conversation/${user.id}/${groupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.groupMessages); // Set the messages from the group chat
                setCurrentGroupInfo(data.group);  // Set the group object to currentInfo
                setLoadingMessages(false);  // Done loading, set false
            })
            .catch(err => console.log(err));
    }


    // This function is called once a user clicks on a PrivateConversationCard.jsx component, meaning they want to write / inspect a 1-on-1 conversation with another user
    const inspectPrivateConversation = async (recipientID, recipientUsername = '', initialLoad) => {

        if (!user)
            return

        if (!initialLoad) {
            setLoadingMessages(true);
        }

        setGroupChat(false);  // Not a group chat
        setReceiver(recipientID);  // Set the receiver here
        setChatName(recipientUsername);  // Set the title of the converastion
        showChatWindow();

        // Check if they are friends
        await fetch(`${API_URL}/friends/check/${recipientID}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setFriend(data); // Set the friendship to true or false
            })
            .catch(err => console.log(err));

        // Fetch all the messages between theese two users
        await fetch(`${API_URL}/messages/private/conversation/${user.id}/${recipientID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);  // Set messages
                setSelectedUser(data.user || data.otherUser); // Set the selected user
                setLoadingMessages(false); // Loading done
                setLoadingProfile(false) // Set loading profile done to
            })
            .catch(err => console.log(err));
    }


    // This function is used when the user is on a phone to show the group chat pop-up window
    const showGroupMembers = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

    // This function is triggered when a user clicks on the overlay which hide the GroupMemberPopUp.jsx module
    const clickOnOverlay = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

    // This function is triggered once a user clicks on a group avatar and want to inspect the info of the group
    const showGroupInfo = () => {
        setMiniBar(true);
        setShowGroupProfile(true);
    }


    return (
        <DashboardContext.Provider value={{
            inspectedUser,
            setInspectedUser,
            API_URL,
            groupChat,
            setGroupChat,
            miniBar,
            setMiniBar,
            selectedUser,
            setSelectedUser,
            hideOverlay,
            setHideOverlay,
            hideGroupPopUp,
            setHideGroupPopUp,
            loadingMessages,
            setLoadingMessages,
            loadingProfile,
            setLoadingProfile,
            showGroupProfile,
            setShowGroupProfile,
            chatName,
            setChatName,
            currentGroupInfo,
            setCurrentGroupInfo,
            receiver,
            setReceiver,
            showProfile,
            showRequests,
            showNewMessage,
            setShowNewMessage,
            messages,
            setMessages,
            friend,
            setFriend,


            showUserInfo,
            showGroupMembers,
            clickOnOverlay,
            showGroupInfo,
            inspectGroupChat,
            showNewMessages,
            hideNewMessage,
            inspectPrivateConversation,
            showChatWindow,
        }}>
            {children}
        </DashboardContext.Provider>
    );
}


export const useDashboardContext = () => useContext(DashboardContext);