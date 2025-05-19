import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {supabase} from "../services/supabaseClient.js";
import {subscribeToChannel} from "../services/helperFunctions.js";

/**
 * This component is used everytime the app renders a users
 * avatar
 *
 *
 * @param height of the avatar
 * @param width of the avatar
 * @param user object
 * @param setSaveChanges state to set changes
 * @param setNewAvatar state to update avatar
 * @param selectPicture function to select picture
 * @param file the file / avatar
 * @param setFile set the file to avatar
 * @returns {JSX.Element}
 * @constructor
 */



export const UserAvatar = ({height, width, user = null,
                               setSaveChanges = null, setNewAvatar = null,
                               selectPicture = false, file = null, setFile = null}) => {

    const [currentAvatar, setCurrentAvatar] = useState(null);
    const {user: loggedInUser} = useAuth();
    const [loadingAvatar, setLoadingAvatar] = useState(true);



    // This hook is used to fetch the avatar from Supabase once the component mounts

    useEffect(() => {
        if (!user) return;
        fetchImage(user);
    }, [user?.id]);

    // This is the function that fetches avatars from Supabase
    const fetchImage = async (user) => {
        setLoadingAvatar(true);

        if (!user?.avatar) {
            console.log("No avatar set for user");
            setCurrentAvatar("/default.jpg");
            setLoadingAvatar(false);
            return;
        }

        console.log("Fetching avatar for:", user.avatar);

        const { data, error } = supabase.storage
            .from("yapper")
            .getPublicUrl(`userAvatars/${user.avatar}`);

        if (error) {
            console.error("Error getting public URL:", error.message);
        } else {
            console.log("Avatar URL:", data.publicUrl);
            setCurrentAvatar(`${data.publicUrl}?t=${Date.now()}`); // bust cache
        }

        setLoadingAvatar(false);
    };


    // This hook is used for listening to updates on the users table
    useEffect(() => {
        if (!user?.id) return;

        const userAvatarUpdate = subscribeToChannel(
            `userAvatarUpdate-${user.id}`,
            {
                event: "UPDATE",
                schema: 'public',
                table: 'users',
            }, async (payload) => {
                const updatedUser = payload.new;

                if (updatedUser.id === user.id) {
                    await fetchImage(updatedUser);
                }
            }
        );

        return () => {
            supabase.removeChannel(userAvatarUpdate);
        };
    }, [user?.id ?? null]);


    const fileInputRef = useRef(null);

    // This function handels the selection of the files
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // This function sets the states of the files and display the selected one
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
            {selectPicture && user?.id === loggedInUser?.id ? (
                /* With select picture == true, users can click on their avatar and change the picture */
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
                /* Show looading animation */
                (loadingAvatar ? (
                    <div style={{height: height, width: width}} className="loading-avatar"></div>
                ) : (
                    <img
                        key={Date.now()}
                        className="user-avatar-select-picture-default"
                        src={currentAvatar}
                        alt="user-avatar"
                        style={{ height,
                            width,
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                        onError={() => console.error("Failed to load avatar:", currentAvatar)}
                    />
                ))
            )}
        </>
    );
};