import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {GifContainer} from "./GifContainer.jsx";
import {FileSelect} from "../FileSelect.jsx";
import {FileContainer} from "./FileContainer.jsx";
import '../../styles/Dashboard/FileContainer.css'
import {supabase} from "../../services/supabaseClient.js";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {MessageInputArea} from "./DashboardMessageAreaComponents/MessageInputArea.jsx";
import {MessageIconArea} from "./DashboardMessageAreaComponents/MessageIconArea.jsx";


/**
 *
 * This component is the input area where the user interact with the conversation,
 * sending messages, gifs or files
 *
 * @param receiver // The recipient of the message
 * @param miniBar // Bool that toggles information about the opposite user / or group in the conversation
 * @param setReceivers // Set array of recipient that is used when a user entities a new group or private conversation
 * @param receivers // Array of recipient that is used when a user entities a new group or private conversation
 * @returns {JSX.Element}
 * @constructor
 */

export const DashboardMessageArea = ({receiver, miniBar, setReceivers, receivers}) => {


    const {user} = useAuth(); // Get user token from context
    const [message, setMessage] = useState('');  // The message user is sending
    const [gifs, showGifs] = useState(false);  // Toggle the GIF pop-up container
    const [files, setFiles] = useState([]); // Array of attached files in message

    const {groupChat, API_URL, loadingMessages, friend, setFriend} = useDashboardContext();

    // This hook is used for updating the friendship once a user answers a new user, automatically becoming friend and removing the hint
    useEffect(() => {
        if (!user) return

        // Listen for new friendships
        const newChannel = supabase
            .channel('friendship-chanel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Friends'
                },
                async (payload) => {
                    const friendship = payload.new;

                    // If the user either sent the request or received the request, add them as a friend
                    if (friendship.user_id === user.id || friendship.friend_id === user.id) {
                        setFriend(true);
                    }
                }
            )
            .subscribe();

        // Close channel and clean up
        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id])


    // This function triggers once a user answers a message from a contact that is not their friend
    const acceptFriendRequest = async () => {
        if (!receiver) return;
        await fetch(`${API_URL}/friends/accept/request/${receiver}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    // This function handles the submit once user hits enter or send
    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!receiver && receivers.length === 0) { // If there is no set receiver, prevent send
            return;
        }

        const formData = new FormData(); // Create formdata so we can attach files instead of JSON.string

        // For all the files in the message, add them to the formdata
        files.forEach(file => {
            formData.append('files', file);
        });

        formData.append('receivers', JSON.stringify(receivers)); // Add the array or receivers
        formData.append('groupChat', groupChat); // Add the check whether the conversation is a group chat or not
        formData.append('message', message); // Append the message written by the user

        try {
            // POST the new message to DB
            await fetch(`${API_URL}/messages/conversation/${user.id}/${receiver}`, {
                method: "POST",
                body: formData
            });

            setMessage(""); // Clear message box
            setFiles([]);   // Empty the files
            setReceivers([]);     // Empty the receivers
        } catch (err) {
            console.error("Message send error:", err);
        }

        // If the user is not a friend and the conversation is not a groupchat, then accept their friend request once they answer
        if (!friend && !groupChat) {
            await acceptFriendRequest();
        }
        setMessage("");  // Safety set message to empty
        setReceivers([]); // Safety set array to empty
    };



    return (

        <div className={`dashboard-message-input ${miniBar ? '' : 'mini'}`}> {/* If the minibar is shown, minimize the message area*/}

            <div className="message-inputarea">

                {/* Friends, groupchat and loading message, dont show */}
                {(!friend && !groupChat && !loadingMessages) && (
                    <div className="friend-request-alert">
                        <p>By answering to a message you automatically become friends</p>
                    </div>
                )}

                {/* No files? Dont show the container */}
                {files.length > 0 && (
                    <FileContainer setFiles={setFiles} files={files}/>
                )}


                <div className="message-inputarea-body">

                    {/* The input field where they write their message */}
                    <MessageInputArea
                        handleSubmit={handleSubmit}
                        message={message}
                        setMessage={setMessage}
                    />

                    {/* Icons where they can send files or gifs */}
                    <MessageIconArea
                        receivers={receivers}
                        handleSubmit={handleSubmit}
                        files={files}
                        setFiles={setFiles}
                        gifs={gifs}
                        setReceivers={setReceivers}
                        showGifs={showGifs}
                    />

                </div>
            </div>
        </div>
    );
}
