

import {useAuth} from "../../context/AuthContext.jsx";
import {useState} from "react";
import {Inputfield} from "../Inputfield.jsx";
import {TextareaField} from "../TextareaField.jsx";
import '../../styles/Dashboard/UserProfile.css'
import {FileSelect} from "../FileSelect.jsx";

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
                    <FileSelect/>
                </div>


                <div className={'user-info'}>
                    <h2>Welcome {user.username}</h2>

                    <Inputfield
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange}
                        name="username"
                        title="Username"
                        example={user.username}
                    />

                    <TextareaField
                        value={formData.bio}
                        name="bio"
                        onChange={handleInputChange}
                        placeholder={user.bio}
                        title="Bio"
                    />
                </div>
            </div>

        </div>
    )
}