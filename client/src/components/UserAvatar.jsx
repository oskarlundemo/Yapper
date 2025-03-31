import {useEffect, useState} from "react";
import { createClient } from '@supabase/supabase-js';
import {useAuth} from "../context/AuthContext.jsx";



const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_ANON_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

export const UserAvatar = ({height, width}) => {
    const [imageSrc, setImageSrc] = useState(null); // Set the src of the img element
    const {user} = useAuth();

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