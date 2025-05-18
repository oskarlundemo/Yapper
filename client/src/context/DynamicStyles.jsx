import {createContext, useContext, useEffect, useState} from "react";


/**
 * This context is used for configuring the layout when the
 * viewport is less than 800 px in width, then I want to show
 * conversation, chat window separately and not at the same time
 * as in a regular webpage
 *
 *
 * @type {React.Context<unknown>}
 */





const DynamicContext = createContext();


export const DynamicContextProvider = ({ children }) => {


    const [showConversations, setShowConversations] = useState(false);  // Only show the users conversations state
    const [showChatWindow, setShowChatWindow] = useState(true);        // Only show the chat window state
    const [showUser, setShowUser] = useState(true);                    // Only show the user profile window
    const [showMinibar, setShowMinibar] = useState(false);             // Show the sidebar in the chat window
    const [phoneUI, setPhoneUI] = useState(false);                    // Set the state to true if on phone device
    const [showUserMenu, setShowUserMenu] = useState(false);           // Show the user menu component in the left corner
    const [isCenterScreen, setIsCenterScreen] = useState(false);      // State to check if div is center of the screen
    const [firstLogin, setFirstLogin] = useState(false);             // State to keep track if is first time logging in, then show conversations, else messages

    // This hook is used to listen to resizing the app and trigger different UI once it goes below 800 px
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 800px)");

        const handleResize = (e) => {
            const isMobile = e.matches;

            if (isMobile && firstLogin) {
                setShowConversations(true); // Only show conersations
                setShowChatWindow(false);
                setShowUser(false);
                setShowUserMenu(true);
                setShowMinibar(false);
                setPhoneUI(true);
                setFirstLogin(false);
            } else if (isMobile && !firstLogin) {
                setShowConversations(false);
                setShowChatWindow(true); // Only show chat window
                setShowUser(false);
                setShowUserMenu(false);
                setShowMinibar(false);
                setPhoneUI(true);
            } else {
                setShowConversations(true); // This is when it goes back to normal size on a desktop
                setShowChatWindow(true);
                setShowUser(true);
                setShowUserMenu(true);
                setPhoneUI(false);
            }
        };

        handleResize(mediaQuery);

        mediaQuery.addEventListener("change", handleResize); // Attach event

        // Clean up and remove
        return () => {
            mediaQuery.removeEventListener("change", handleResize);
        };
    }, [firstLogin]);


    // This function is triggered when a user clciks on a conversation on their phone
    const clickOnChat = () => {
        const isPhone = window.matchMedia("(max-width: 800px)").matches; // Check if it is below 800 px

        if (isPhone) {
            setShowUserMenu(false)
            setShowConversations(false);
            setShowChatWindow(true); // Only show the inspected chat
        }
    };


    // This function is triggered once a user want to write a new message on their phone
    const clickOnNewMessage = () => {
        const isPhone = window.matchMedia("(max-width: 800px)").matches; // Check if it is below 800 px

        if (isPhone) {
            setShowUserMenu(false)
            setShowConversations(false);
            setShowChatWindow(true); //
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