

import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {UserAvatar} from "../UserAvatar.jsx";

export const UserProfile = ({miniBar, setMiniBar, selectedUser = null, API_URL}) => {

    const {user} = useAuth();

    const [bio, setBio] = useState("")
    const [file, setFile] = useState(null)
    const [newAvatar, setNewAvatar] = useState(null)
    const [disabledBio, setDisabledBio] = useState(true)
    const [saveChanges, setSaveChanges] = useState(false)
    const [charsCount, setCharsCount] = useState(0)

    useEffect(() => {
        setBio(selectedUser?.bio)
    }, [selectedUser])


    useEffect(() => {
        setCharsCount(bio?.length)
    }, [bio])


    const handleSubmit = (e) => {
        e.preventDefault();

        setSaveChanges(false);
        setDisabledBio(true);

        const formData = new FormData();
        formData.append('avatar', newAvatar);
        formData.append('bio', bio);

        try {
            fetch(`${API_URL}/users/update/profile/${user.id}`, {
                method: 'POST',
                body: formData
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={`user-profile-container ${miniBar ? '' : 'hidden'}`}>

            <svg onClick={() => setMiniBar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

            <div className="user-profile-info">

                <div className={'user-avatar'}>
                    <UserAvatar setNewAvatar={setNewAvatar} setSaveChanges={setSaveChanges} file={file} setFile={setFile} user={selectedUser} height={100} width={100} selectPicture={true} />
                </div>

                <div className={'user-info'}>
                    <h2>{selectedUser?.username || ''}</h2>
                    {selectedUser?.id === user.id ? (
                        <form className={'edit-user-info'} onSubmit={(e) => handleSubmit(e)}>

                            {disabledBio ? (
                                <p className={'user-bio'}>{selectedUser?.bio || 'No bio'}</p>
                            ) : (
                                <>
                                <textarea value={bio}
                                          placeholder={user?.bio || 'No bio'}
                                          disabled={disabledBio}
                                          onChange={(e) => setBio(e.target.value)}
                                />
                                    <p><span>{charsCount}</span>/50</p>
                                </>
                            )}

                            {disabledBio ? (
                                <svg onClick={() => {
                                    setDisabledBio(!disabledBio);
                                    setSaveChanges(true);
                                }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg>
                            ): null}

                            {saveChanges && (
                                <button
                                    type="submit">
                                    Save changes
                                </button>
                            )}

                        </form>
                    ) : (
                        <p>{selectedUser?.bio || 'No bio'}</p>
                    )}
                </div>
            </div>

        </div>
    )
}