import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {supabase} from "../services/supabaseClient.js";
import {useDynamicStyles} from "../context/DynamicStyles.jsx";




export const UserAvatar = ({height, width, user = null, API_URL = '',
                               setSaveChanges = null, setNewAvatar = null,
                               selectPicture = false, file = null, setFile = null}) => {
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const {user: loggedInUser} = useAuth();
    const [loadingAvatar, setLoadingAvatar] = useState(true);


    useEffect(() => {
        fetchImage(user);
    }, [user?.id]);


    const {clickOnProfile} = useDynamicStyles();


    const fetchImage = async (user) => {
        setLoadingAvatar(true);
        if (!user?.avatar) {
            setCurrentAvatar(null);
            setLoadingAvatar(false);
            return;
        }
        const { data, error } = supabase.storage
            .from("yapper")
            .getPublicUrl(`avatars/${user.avatar}`);
        if (error) {
            console.error("Error getting public URL:", error);
        } else {
            setLoadingAvatar(false);
            setCurrentAvatar(data.publicUrl);
        }
    };


    useEffect(() => {
        if (!user?.id) return;

        const newChannel = supabase
            .channel(`realtime-user-avatar-update-${Math.random()}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                },
                async (payload) => {
                    const updatedUser = payload.new;
                    if (updatedUser.id === user.id) {
                        await fetchImage(payload.new);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user?.id ?? null]);

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
            {selectPicture && user?.id === loggedInUser?.id ? (
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

                (loadingAvatar ? (
                    <div style={{height: height, width: width}} className="loading-avatar"></div>
                ) : (
                    <img
                        key={user?.id || 'default'}
                        className="user-avatar-select-picture-default"
                        src={currentAvatar || "/default.jpg"}
                        alt="user-avatar"
                        style={{ height, width }}
                        onError={() => console.error("Failed to load avatar:", currentAvatar)}
                    />
                ))
            )}
        </>
    );
};