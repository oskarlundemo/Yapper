

import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {UserAvatar} from "../UserAvatar.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {DescriptionForm} from "./GroupProfileComponents/DescriptionForm.jsx";
import {BlockedUsersDropDown} from "./UserProfileComponents/BlockedUsersDropDown.jsx";


/**
 * This component is used for showing user profiles, it is also here
 * users can inspect their own and change avatar or add a bio
 *
 *
 * @param setBlockedUsers set the list of blocked users
 * @param blockedUsers list of users that are blocked
 * @returns {JSX.Element}
 * @constructor
 */




export const UserProfile = ({setBlockedUsers, blockedUsers}) => {

    const {user} = useAuth();  // Get jwt token from context

    const [bio, setBio] = useState('');    // State to update and change the bio
    const [file, setFile] = useState(null);       // State to set the file when users change avatars
    const [newAvatar, setNewAvatar] = useState(null);   // Set the state of the new avatar
    const [disabledBio, setDisabledBio] = useState(true);  // Disable input in for bio
    const [saveChanges, setSaveChanges] = useState(false); // Set and save updated changes
    const [charsCount, setCharsCount] = useState(0); // Count to keep track of bio lenght
    const [showDropDown, setShowDropDown] = useState(false);  // State to toggle the drop down of blocked users
    const {showMinibar, setShowMinibar, phoneUI, clickBackToChat} = useDynamicStyles();

    const {API_URL, selectedUser, loadingMessages, loadingProfile} = useDashboardContext();

    // Set the bio state on mount
    useEffect(() => {
        setBio(selectedUser?.bio || '')
    }, [selectedUser])

    // Set the lenght of the bio on mount
    useEffect(() => {
        setCharsCount(bio.length)
    }, [bio])

    // This function handles the submit of user profile updates
    const handleSubmit = (e) => {
        e.preventDefault();

        setSaveChanges(false);   // Changes confiremd, set save to false
        setDisabledBio(true);   // Disable the bio so no more input

        const formData = new FormData();  // Create formdata so we can send the avatar
        formData.append('avatar', newAvatar); // Avatar file
        formData.append('bio', bio); // New bio

        try {
            fetch(`${API_URL}/users/update/profile/${user.id}`, {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    setBio(data.bio)
                })
        } catch (err) {
            console.log('Error updating user profile')
        }
    }


    // This function is used for unblocking a user in their blocked list
    const unblockUser = async (blocked_user) => {
        try {
            const res = await fetch(`${API_URL}/blocks/unblock/${user.id}/${blocked_user}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.log(`There was an error unblocking the user. Error code: ${res.status}`);
                return;
            }

            const data = await res.json();
            setBlockedUsers(data);  // Update the list of blocked users
        } catch (err) {
            console.log('There was an error unblocking the user.');
        }
    };

    // This function is used for blocking users
    const blockUser = async (blocked_user) => {
        try {
            const res = await fetch(`${API_URL}/blocks/${user.id}/${blocked_user}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.log(`There was an error blocking the user. Error code: ${res.status}`);
            }

            const data = await res.json();
            setBlockedUsers(data); // Update the list of blocked users
        } catch (err) {
            console.log('There was an error blocking the user.');
        }
    }


    // This function keeps track of the length of the bio so it does not proceed 50 chars
    const handleBioChange = (e) => {
        if (bio.length > 50) {
            e.preventDefault();
            return
        }
        setBio(e.target.value);
    }

    // This function is used to toggle the drop-down
    const toggleDropdown = () => {
        setShowDropDown(!showDropDown);
    }

    return (
        <div className={`user-profile-container ${showMinibar ? '' : 'hidden'}`}>

            {phoneUI ? (
                <svg className={'back-arrow'} onClick={() => {clickBackToChat();}}
                     xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                     fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            ) : (
                <svg className={'cross-icon'} onClick={() => setShowMinibar(false)}
                     xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                     fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            )}

            <div className={`chat-info`}>

                <div className={'chat-avatar'}>

                    {/* If the messages in the conversation is loading or the data for the profile is still fetching, set the loading animation*/}
                    {(loadingMessages || loadingProfile ) ? (
                        <div className="loading-avatar"/>
                         ) : (
                        <UserAvatar setNewAvatar={setNewAvatar}
                                    setSaveChanges={setSaveChanges} file={file}
                                    setFile={setFile} user={selectedUser}
                                    height={100} width={100} selectPicture={true} />
                    )}
                </div>

                <div className={`user-info`}>

                    {/* If the messages in the conversation is loading or the data for the profile is still fetching, set the loading animation*/}
                    {(loadingMessages || loadingProfile ) ? (
                        <div className="loading-username"/>
                    ) : (
                        <h2>{selectedUser?.username || ''}</h2>
                    )}

                    {/* If the messages in the conversation is loading or the data for the profile is still fetching, set the loading animation*/}
                    {(loadingMessages || loadingProfile ) ? (
                        <div className="loading-body-text" />
                    ) : (
                        selectedUser?.id === user.id ? (
                            // If the logged-in users is inspecting their own profile, enable edit functions
                            <DescriptionForm
                                saveChanges={saveChanges}
                                setSaveChanges={setSaveChanges}
                                setDisabledDescription={setDisabledBio}
                                descriptionCharsCount={charsCount}
                                handleDescriptionInputChange={handleBioChange}
                                disabledDescription={disabledBio}
                                handleSubmit={handleSubmit}
                                description={bio}
                            />
                        ) : (
                            // Else just show the inspected users bio
                            <p>{bio}</p>
                        )
                    )}

                    {/* If the messages in the conversation is loading or the data for the profile is still fetching, set the loading animation*/}
                    {(loadingMessages || loadingProfile ) ? (
                        <div className="loading-button"/>
                    ) : (
                        ((selectedUser?.id === user.id) ? (

                            // The logged-in user is inspecting their own profile, show their banned list

                            (blockedUsers?.length > 0 && (
                                <BlockedUsersDropDown
                                    toggleDropdown={toggleDropdown}
                                    blockedUsers={blockedUsers}
                                    showDropDown={showDropDown}
                                    unblockUser={unblockUser}
                                    />
                            ))
                        ) : (
                            // If the user is inspecting anybody others profile, show the ban button where users can block them
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