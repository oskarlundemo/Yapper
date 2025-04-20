import {useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {GifContainer} from "./GifContainer.jsx";
import {FileSelect} from "../FileSelect.jsx";
import {FileContainer} from "./FileContainer.jsx";
import '../../styles/Dashboard/FileContainer.css'

export const DashboardMessageArea = ({receiver, friend, miniBar, setReceivers, groupChat, receivers, API_URL}) => {

    const {user} = useAuth();
    const [message, setMessage] = useState('');
    const [gifs, showGifs] = useState(false);
    const [files, setFiles] = useState([]);


    const acceptFriendRequest = async () => {
        await fetch(`${API_URL}/friends/accept/request/${receiver}/${user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });


        formData.append('receivers', JSON.stringify(receivers));
        formData.append('groupChat', groupChat);
        formData.append('message', message);

        try {
            await fetch(`${API_URL}/messages/conversation/${user.id}/${receiver}`, {
                method: "POST",
                body: formData
            });

            setMessage("");
            setFiles([]);
            setReceivers([]);

        } catch (err) {
            console.error("Message send error:", err);
        }

        if (!friend) {
            await acceptFriendRequest();
        }
        setMessage("");
        setReceivers([]);
    };


    const handleFileAdd = (e) => {
        const selectedFile = e.target.files[0];
        setFiles([...files, selectedFile]);
    }

    const handleFileRemove = (name) => {
        setFiles(files.filter((f) => f.name !== name));
    }

    return (
        <div className={`dashboard-message-input ${miniBar ? '' : 'mini'}`}>
            <div className="message-card">

                {!friend && (
                    <div className="friend-request-alert">
                        <p>By answering to a message you automatically become friends</p>
                    </div>
                )}

                {files.length > 0 && (
                    <FileContainer removeFile={handleFileRemove} files={files}/>
                )}

                <div className="message-card-body">


                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="message"
                            name="message"
                            onChange={e => setMessage(e.target.value)}
                            value={message}
                            placeholder="Aa"
                        />
                    </form>

                    <div className={'message-area-icons'}>

                        <svg onClick={(e) => handleSubmit(e)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>

                        <GifContainer groupChat={groupChat} API_URL={API_URL} receiver={receiver} sender={user.id} showGifs={gifs} setShowGifs={showGifs} />

                        <FileSelect handleFileAdd={handleFileAdd} />

                        <svg onClick={() => showGifs(!gifs)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm240-160h60v-240h-60v240Zm-160 0h80q17 0 28.5-11.5T400-400v-80h-60v60h-40v-120h100v-20q0-17-11.5-28.5T360-600h-80q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h60v-80h80v-60h-80v-40h120v-60H560v240ZM200-200v-560 560Z"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
