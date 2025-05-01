

import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {UserAvatar} from "../UserAvatar.jsx";

export const UserProfile = ({miniBar, setMiniBar, selectedUser = null, setBlockedUsers, blockedUsers, loadingMessages, API_URL}) => {

    const {user} = useAuth();

    const [bio, setBio] = useState(selectedUser?.bio || '')
    const [file, setFile] = useState(null)
    const [newAvatar, setNewAvatar] = useState(null)
    const [disabledBio, setDisabledBio] = useState(true)
    const [saveChanges, setSaveChanges] = useState(false)
    const [charsCount, setCharsCount] = useState(0)
    const [show, setShow] = useState(false)

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


    const unblockUser = async (blocked_user) => {
        try {
            await fetch(`${API_URL}/blocks/unblock/${user.id}/${blocked_user}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setBlockedUsers(data)
                })
        } catch (err) {
            console.log(err)
        }

    }


    const blockUser = async (blocked_user) => {
        try {
            await fetch(`${API_URL}/blocks/${user.id}/${blocked_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setBlockedUsers(data)
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.log(err)
        }
    }


    const toggleDropdown = () => {
        setShow(!show);
    }

    return (
        <div className={`user-profile-container ${miniBar ? '' : 'hidden'}`}>

            <svg onClick={() => setMiniBar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

            <div className="user-profile-info">

                <div className={'user-avatar'}>


                    {loadingMessages ? (
                        <div className="loading-avatar"/>
                    ) : (
                        <UserAvatar setNewAvatar={setNewAvatar} setSaveChanges={setSaveChanges} file={file} setFile={setFile} user={selectedUser} height={100} width={100} selectPicture={true} />
                    )}
                </div>

                <div className={'user-info'}>

                    {loadingMessages ? (
                        <div className="loading-username"/>
                    ) : (
                        <h2>{selectedUser?.username || ''}</h2>
                    )}


                    {loadingMessages ? (
                        <div className="loading-body-text" />
                    ) : (
                        selectedUser?.id === user.id ? (
                            <form className="edit-user-info" onSubmit={(e) => handleSubmit(e)}>
                                {disabledBio ? (
                                    <p className="user-bio">{bio || 'No bio'}</p>
                                ) : (
                                    <>
                                        <textarea
                                            value={bio}
                                            placeholder={bio|| 'Tell us a bit about yourself!'}
                                            disabled={disabledBio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                        <p>
                                            <span>{charsCount}</span>/50
                                        </p>
                                    </>
                                )}

                                {disabledBio && (
                                    <svg
                                        onClick={() => {
                                            setDisabledBio(false);
                                            setSaveChanges(true);
                                        }}
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24px"
                                        viewBox="0 -960 960 960"
                                        width="24px"
                                        fill="#e3e3e3">
                                        <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                                    </svg>
                                )}

                                {saveChanges && (
                                    <button type="submit">Save changes</button>
                                )}
                            </form>
                        ) : (
                            <p>{selectedUser?.bio || 'No bio'}</p>
                        )
                    )}

                    {loadingMessages ? (
                        <div className="loading-button"/>
                    ) : (

                        ((selectedUser?.id === user.id) ? (

                            (blockedUsers?.length > 0 && (
                                <ul className="dropdown-blocked">
                                    <li className="dropdown-item">
                                        <button className="dropdown-button" onClick={toggleDropdown}>
                                            Blocked users
                                            <svg
                                                className={`drop-icon ${show ? 'rotate' : ''}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                height="24px"
                                                viewBox="0 -960 960 960"
                                                width="24px"
                                                fill="#e3e3e3"
                                            >
                                                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                                            </svg>
                                        </button>

                                        <ul className={`sub-menu ${show ? 'show' : ''}`}>
                                            <div>
                                                {blockedUsers.map((blockedUser, index) => (
                                                    <li key={index} className="blocked-user-card">
                                                        <span>{blockedUser.BlockedUser.username || 'Blocked User'}</span>
                                                        <svg
                                                            onClick={() => unblockUser(blockedUser.BlockedUser.id)}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            height="24px"
                                                            viewBox="0 -960 960 960"
                                                            width="24px"
                                                            fill="#e3e3e3">
                                                            <path d="M200-440v-80h560v80H200Z" />
                                                        </svg>
                                                    </li>
                                                ))}
                                            </div>
                                        </ul>
                                    </li>
                                </ul>
                            ))
                        ) : (
                            <button onClick={() => blockUser(selectedUser?.id)} className="block-button">
                                Block user
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q54 0 104-17.5t92-50.5L228-676q-33 42-50.5 92T160-480q0 134 93 227t227 93Zm252-124q33-42 50.5-92T800-480q0-134-93-227t-227-93q-54 0-104 17.5T284-732l448 448Z"/></svg>
                            </button>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}