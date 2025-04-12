import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";




export const DashboardMessageArea = ({receiver, friend, setReceivers, groupChat, receivers, API_URL}) => {

    const {user} = useAuth();
    const [message, setMessage] = useState('');
    const [focusedChat, setFocusedChat] = useState(null);

    const sendFriendRequest = async () => {
        await fetch(`${API_URL}/notifications/friends/${receiver}/${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    const acceptFriendRequest = async () => {
        await fetch(`${API_URL}/friends/accept/request/${receiver}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    useEffect(() => {
        console.log("Current message state:", message);
    }, [message]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${API_URL}/messages/conversation/${user.id}/${receiver}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message, receivers, groupChat }),
            });

            const data = await res.json();
            setFocusedChat(data.id);
            console.log(data);

            if (!friend) {
                await sendFriendRequest();
                await acceptFriendRequest();
            }

            setMessage("");

        } catch (err) {
            console.error("Message send error:", err);
        }
        setReceivers([]); // this can stay here
    };

    return (
        <div className={'dashboard-message-input'}>
            <div className="message-card">

                {!friend && (
                    <div className="friend-request-alert">
                        <p>By answering to a message you automatically become friends</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="message-card-body">

                    <input
                        type="text"
                        id="message"
                        name="message"
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        placeholder="Aa"
                    />

                    <div className={'message-area-icons'}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm240-160h60v-240h-60v240Zm-160 0h80q17 0 28.5-11.5T400-400v-80h-60v60h-40v-120h100v-20q0-17-11.5-28.5T360-600h-80q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h60v-80h80v-60h-80v-40h120v-60H560v240ZM200-200v-560 560Z"/>
                        </svg>
                    </div>
                </form>
            </div>
        </div>
    );
}
