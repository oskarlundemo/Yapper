import {useEffect, useRef, useState} from "react";
import {supabase} from "../../services/supabaseClient.js";


/**
 * This component is used for rendering the avatar of a group chat
 *
 *
 * @param height the height of the picture
 * @param width the width of the picture
 * @param user currently logged-in user
 * @param group the group chat
 * @param setSaveChanges state to set changes
 * @param setNewAvatar state to change the picture
 * @param selectPicture function so select the picture
 * @param file the file that has been selected
 * @param setFile function to set the file
 * @returns {JSX.Element}
 * @constructor
 */




export const GroupAvatar = ({height, width, user = null, group = null,
                               setSaveChanges = null, setNewAvatar = null,
                               selectPicture = false, file = null, setFile = null}) => {

    const [currentAvatar, setCurrentAvatar] = useState(null);


    // Set the current avatar to the group current avatar
    useEffect(() => {
        setCurrentAvatar(group?.avatar);
    }, [group]);


    // This hook is used for fetching the avatar from supabase
    useEffect(() => {
        const fetchImage = async () => {

            // If the group does not have an avatar, set it to null and show default img
            if (!group?.avatar) {
                setCurrentAvatar(null);
                return;
            }

            // Else fetch the avatar from supabase
            const { data, error } = supabase.storage
                .from("yapper")
                .getPublicUrl(`groupAvatars/${group.avatar}`);
            if (error) {
                console.error("Error getting public URL:", error);
            } else {
                setCurrentAvatar(data.publicUrl);
            }
        };

        fetchImage();
    }, [group]);


    // This is a reference to the file the user selects
    const fileInputRef = useRef(null);

    // This handle once a user clicks on a file
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // This handles the file changes a user makes
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
                // If the logged-in user is the group admin, they can set and select the group avatar
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

                        <button onClick={handleButtonClick}/>
                    </div>

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>

                </div>
            ) : (
                // If the user is not admin the group, just set image
                <img
                    key={group?.id || 'default'}
                    className="user-avatar-select-picture-default"
                    src={currentAvatar || "/default.jpg"}
                    alt="user-avatar"
                    style={{ height, width }}
                />
            )}
        </>
    );
};