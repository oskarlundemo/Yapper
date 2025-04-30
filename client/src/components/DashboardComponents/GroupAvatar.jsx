import {useEffect, useRef, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {supabase} from "../../services/supabaseClient.js";


export const GroupAvatar = ({height, width, user = null, group = null,
                               setSaveChanges = null, setNewAvatar = null,
                               selectPicture = false, file = null, setFile = null}) => {

    const [currentAvatar, setCurrentAvatar] = useState(group?.avatar);

    useEffect(() => {
        const fetchImage = async () => {
            if (!group?.avatar) {
                setCurrentAvatar(null);
              //setFile(null);
                return;
            }
            const { data, error } = supabase.storage
                .from("yapper")
                .getPublicUrl(`groupavatars/${group.avatar}`);
            if (error) {
                console.error("Error getting public URL:", error);
            } else {
                setCurrentAvatar(data.publicUrl);
            }
        };
        fetchImage();
    }, [group]);


    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setSaveChanges(true)

        if (selectedFile) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setFile(previewUrl);
            setNewAvatar(selectedFile);
        }
    };

    return (
        <>
            {selectPicture && group?.admin_id === user?.id ? (
                <div className="user-avatar-select-picture"
                     style={{
                         backgroundImage: `url(${file || currentAvatar || '/default.jpg'})`,
                         height,
                         width,
                     }}>

                    <div className="user-avatar-select-box">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        <button
                            onClick={handleButtonClick}
                        />
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>

                </div>
            ) : (
                <img
                    className="user-avatar-select-picture-default"
                    src={currentAvatar || "/default.jpg"}
                    alt="user-avatar"
                    style={{ height, width }}
                />
            )}
        </>
    );
};