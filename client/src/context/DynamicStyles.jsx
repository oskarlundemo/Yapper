import {createContext, use, useContext, useEffect, useState} from "react";



const DynamicContext = createContext();


export const DynamicContextProvider = ({ children }) => {

    const [showConversations, setShowConversations] = useState(false);
    const [showChatWindow, setShowChatWindow] = useState(true);
    const [showUser, setShowUser] = useState(true);
    const [showMinibar, setShowMinibar] = useState(false);
    const [phoneUI, setPhoneUI] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isCenterScreen, setIsCenterScreen] = useState(false);
    const [firstLogin, setFirstLogin] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 800px)");

        const handleResize = (e) => {
            const isMobile = e.matches;

            if (isMobile && firstLogin) {
                setShowConversations(true);
                setShowChatWindow(false);
                setShowUser(false);
                setShowUserMenu(true);
                setShowMinibar(false);
                setPhoneUI(true);
                setFirstLogin(false);
            } else if (isMobile && !firstLogin) {
                setShowConversations(false);
                setShowChatWindow(true);
                setShowUser(false);
                setShowUserMenu(false);
                setShowMinibar(false);
                setPhoneUI(true);
            } else {
                setShowConversations(true);
                setShowChatWindow(true);
                setShowUser(true);
                setShowUserMenu(true);
                setPhoneUI(false);
            }
        };

        handleResize(mediaQuery);

        mediaQuery.addEventListener("change", handleResize);

        return () => {
            mediaQuery.removeEventListener("change", handleResize);
        };
    }, [firstLogin]);


    const clickOnChat = () => {
        const isPhone = window.matchMedia("(max-width: 800px)").matches;

        if (isPhone) {
            setShowUserMenu(false)
            setShowConversations(false);
            setShowChatWindow(true);
        }
    };


    const clickOnNewMessage = () => {
        const isPhone = window.matchMedia("(max-width: 800px)").matches;

        if (isPhone) {
            setShowUserMenu(false)
            setShowConversations(false);
            setShowChatWindow(true);
        }
    }

    const clickOnBack = () => {
        setShowChatWindow(false);
        setShowConversations(true);
        setShowUserMenu(true)
    }

    const clickBackToChat = () => {
        setShowChatWindow(true);
        setShowMinibar(false);
        setShowConversations(false);
    }

    const clickOnProfile = () => {
        if (phoneUI) {
            setShowConversations(false);
            setShowChatWindow(false);
            setShowUser(true);
            setShowMinibar(true);
        }
        setShowMinibar(true);
    }


    return (
        <DynamicContext.Provider value={{
            showConversations,
            setShowConversations,
            showChatWindow,
            setShowChatWindow,
            showUser,
            setShowUser,
            clickOnChat,
            clickOnBack,
            clickOnProfile,
            showMinibar,
            setShowMinibar,
            phoneUI,
            clickBackToChat,
            clickOnNewMessage,
            setIsCenterScreen,
            isCenterScreen,
            firstLogin,
            setFirstLogin,
            showUserMenu,
        }}>
            {children}
        </DynamicContext.Provider>
    );
}


export const useDynamicStyles = () => useContext(DynamicContext);