

import {useAuth} from "../../context/AuthContext.jsx";
import {useState} from "react";
import {Inputfield} from "../Inputfield.jsx";
import {TextareaField} from "../TextareaField.jsx";
import '../../styles/Dashboard/UserProfile.css'

export const UserProfile = () => {

    const {user} = useAuth();

    const [formData, setFormData] = useState({
        bio: "",
        username: "",
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            return updatedData;
        });
    }


    return (
        <div className="user-profile-container">


            <div className="user-profile-info">

                <div className={'user-avatar'}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
                </div>


                <div className={'user-info'}>
                    <h2>Welcome {user.username}</h2>

                    <Inputfield
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        name="username"
                        placeholder={user.username}
                    />

                    <TextareaField
                        value={formData.bio}
                        name="bio"
                        onChange={handleInputChange}
                        placeholder={user.bio}
                    />
                </div>
            </div>

        </div>
    )
}