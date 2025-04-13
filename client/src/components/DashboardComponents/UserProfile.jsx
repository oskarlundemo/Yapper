

import {useAuth} from "../../context/AuthContext.jsx";
import {useState} from "react";
import {Inputfield} from "../Inputfield.jsx";
import {TextareaField} from "../TextareaField.jsx";
import '../../styles/Dashboard/UserProfile.css'
import {FileSelect} from "../FileSelect.jsx";

export const UserProfile = ({miniBar, setMiniBar}) => {

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
        <div className={`user-profile-container ${miniBar ? '' : 'hidden'}`}>

            <svg onClick={() => setMiniBar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

            <div className="user-profile-info">

                <div className={'user-avatar'}>
                    <FileSelect/>
                </div>


                <div className={'user-info'}>
                    <h2>Welcome {user.username}</h2>
                </div>
            </div>

        </div>
    )
}