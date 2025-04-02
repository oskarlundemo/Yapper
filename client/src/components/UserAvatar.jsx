import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {supabase} from "../../../server/controllers/supabaseController.js";




export const UserAvatar = ({height, width, user}) => {
    const [imageSrc, setImageSrc] = useState(null); // Set the src of the img element

    useEffect(() => {
        // Fetch the image from supabase
        const fetchImage = async () => {
            if (!user?.avatar) return; // Prevent fetching if user.avatar is not set
            const { data } = supabase.storage.from("yapper").getPublicUrl(user.avatar);
            setImageSrc(data.publicUrl);
        };
        fetchImage();
    }, [user]);


    return (
        <img
            src={imageSrc || "/default.jpg"}  // ✅ Corrected path
            alt="user-avatar"
            style={{ height, width }}
        />
    );
};