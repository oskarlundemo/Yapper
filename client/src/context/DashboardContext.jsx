import {createContext, useContext, useState} from "react";
import {useAuth} from "./AuthContext.jsx";

const DashboardContext = createContext();

export const DashboardContextProvider = ({ children }) => {


    const [inspectedUser, setInspectedUser] = useState(null);

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;
    const API_URL = import.meta.env.PROD
        ? PRODUCTION_URL
        : "/api";


    const [receiver, setReceiver] = useState(null);
    const [groupChat, setGroupChat] = useState(false);
    const [miniBar, setMiniBar] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [hideOverlay, setHideOverlay] = useState(true);
    const [hideGroupPopUp, setHideGroupPopUp] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [showGroupProfile, setShowGroupProfile] = useState(true);
    const [chatName, setChatName] = useState("");
    const [currentGroupInfo, setCurrentGroupInfo] = useState(null);

    const [showProfile, setShowProfile] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showNewMessage, setShowNewMessage] = useState(false);

    const {user} = useAuth();

    const hideNewMessage = () => {
        setShowNewMessage(false);
    }

    const showNewMessages = () => {
        setShowNewMessage(true);
        setReceiver(null);
        setShowProfile(false);
    }

    const showChatWindow = () => {
        setShowProfile(false);
        setShowRequests(false);
        setShowNewMessage(false);
    }

    const showUserInfo = async (inspectedUser = null) => {

        setMiniBar(true);
        setLoadingProfile(true);

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




    const inspectGroupChat = async (receiver_id, chatname, initialLoad) => {

        if (!initialLoad) {
            setLoadingMessages(true);
        }

        setGroupChat(true);
        setReceiver(receiver_id);
        showChatWindow();
        setChatName(chatname);
        fetch(`${API_URL}/messages/group/conversation/${user.id}/${receiver_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.groupMessages);
                setCurrentGroupInfo(data.group);
                setLoadingMessages(false);
            })
            .catch(err => console.log(err));
    }


    const inspectPrivateConversation = async (receiver_id, chatname = '', initialLoad) => {

        if (!user)
            return


        if (!initialLoad) {
            setLoadingMessages(true);
        }


        setGroupChat(false);
        setReceiver(receiver_id);
        setChatName(chatname);
        showChatWindow();


        await fetch(`${API_URL}/friends/check/${receiver_id}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setFriend(data);
            })
            .catch(err => console.log(err));

        await fetch(`${API_URL}/messages/private/conversation/${user.id}/${receiver_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(data.messages);
                setSelectedUser(data.user || data.otherUser);
                setLoadingMessages(false);
                setLoadingProfile(false)
            })
            .catch(err => console.log(err));
        toggleShowMessage(false);
    }



    const showGroupMembers = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

    const clickOnOverlay = () => {
        setHideGroupPopUp(false);
        setHideOverlay(false);
    }

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


            showUserInfo,
            showGroupMembers,
            clickOnOverlay,
            showGroupInfo,
            inspectGroupChat,
            showNewMessages,
            hideNewMessage,
            inspectPrivateConversation,
        }}>
            {children}
        </DashboardContext.Provider>
    );
}


export const useDashboardContext = () => useContext(DashboardContext);