




import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {GroupAvatar} from "./GroupAvatar.jsx";
import '../../styles/Dashboard/GroupProfile.css'
import {supabase} from "../../services/supabaseClient.js";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";
import {subscribeToChannel} from "../../services/helperFunctions.js";
import {GroupNameInput} from "./GroupProfileComponents/GroupNameInput.jsx";
import {DescriptionForm} from "./GroupProfileComponents/DescriptionForm.jsx";


/**
 * This component is used for showing the info of a group chat, its name, members
 * and description
 *
 * @param headerName
 * @returns {JSX.Element}
 * @constructor
 */


export const GroupProfile = ({headerName}) => {

    const {user} = useAuth();
    const {API_URL, currentGroupInfo, groupChat, showGroupMembers} = useDashboardContext();


    const [description, setDescription] = useState('');                      // The description / bio of the group chat
    const [file, setFile] = useState(null)                                          // Set the file of the group chat avatar
    const [newAvatar, setNewAvatar] = useState(null)                                // Set and update the new avatar
    const [disabledDescription, setDisabledDescription] = useState(true)   // Disable the description for new input
    const [saveChanges, setSaveChanges] = useState(false)                  // State for setting saved changes
    const [descriptionCharsCount, setDescriptionCharsCount] = useState(0)  // Updating the number of chars in the description
    const [groupName, setGroupName] = useState(currentGroupInfo?.name || '');       // This is used for setting the name of the group
    const [groupNameCharCount, setGroupNameCharCount] = useState(0);       // This is used for keeping track of group name
    const {showMinibar, setShowMinibar, phoneUI, clickBackToChat} = useDynamicStyles();       // These are bools used for updating the UI based on device

    // This hook sets the group description if there is one, else just 'No description'
    useEffect(() => {
        if (currentGroupInfo?.description && currentGroupInfo.description !== 'null') {
            setDescription(currentGroupInfo.description);
        } else {
            setDescription('No description');
        }
        setGroupName(currentGroupInfo?.name || '');
    }, [currentGroupInfo]);

    // This hook is used for setting the name of the group chat
    useEffect(() => {
        setGroupName(currentGroupInfo?.name);
    }, [currentGroupInfo]);

    // This hook is used for listening to updated description of group chats, so they are seen in realtime
    useEffect(() => {
        if (!user?.id || !currentGroupInfo?.id) return;

        const updatedGroupDescription = subscribeToChannel(
            `updatedGroupDescription-${currentGroupInfo?.id}`,
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'GroupChats'
            },
            async (payload) => {
                const group = payload.new;

                if (group.id === group.id) {
                    setDescription(group.description);
                    headerName(group.name)
                }
            }
        )

        return () => {
            supabase.removeChannel(updatedGroupDescription);
        };
    }, [user.id, currentGroupInfo]);


    // This hook is used for setting the description
    useEffect(() => {
        setDescription(currentGroupInfo?.description || '')
    }, [currentGroupInfo])


    // This hook keeps tracks of the length of the description so it does not proceed 50 chars
    useEffect(() => {
        setDescriptionCharsCount(description?.length)
    }, [description])

    // This hook keeps tracks of the length of the group name so it does not proceed 15 chars
    useEffect(() => {
        setGroupNameCharCount(groupName?.length)
    }, [groupName])


    // This function is used for submitting new changes
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaveChanges(false);
        setDisabledDescription(true);

        const formData = new FormData();
        formData.append('avatar', newAvatar);
        formData.append('description', description);
        formData.append('groupName', groupName);
        formData.append('groupChat', groupChat);

        try {
            await fetch(`${API_URL}/groups/update/${currentGroupInfo.id}`, {
                method: 'POST',
                body: formData
            })
        } catch (err) {
            console.log('Error updating group profile');
        }
    }

    // This function is used for updating state of the group name
    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };

    // This function is used for updating the state of the description
    const handleDescriptionInputChange = (e) => {
        if (description.length > 50) { // If the description is longer than 50 chars, prevent further input
            e.preventDefault();
            return
        }
        setDescription(e.target.value);
    }


    useEffect(() => {
        if (disabledDescription) {
            setDescription(currentGroupInfo?.description || '');
        }
    }, [currentGroupInfo]);


    return (
        <div className={`user-profile-container ${showMinibar ? '' : 'hidden'}`}>

            {phoneUI ? (
                <svg className={'back-arrow'} onClick={() => {clickBackToChat();}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            ) : (
                <svg className={'cross-icon'} onClick={() => setShowMinibar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            )}

            <div className="chat-info">

                <div className='chat-avatar'>
                    <GroupAvatar user={user}
                                 group={currentGroupInfo} width={100} height={100}
                                 setSaveChanges={setSaveChanges} setNewAvatar={setNewAvatar}
                                 selectPicture={true} setFile={setFile} file={file}/>
                </div>

                <div className='user-info'>

                    {disabledDescription ? (
                        <h2>{groupName || ''}</h2>
                    ) : (
                        <GroupNameInput
                            groupName={groupName}
                            groupNameCharCount={groupNameCharCount}
                            handleGroupNameChange={handleGroupNameChange}/>
                    )}

                    {/* The logged-in user is admin, show the input fields to update the description */}
                    {currentGroupInfo?.admin_id === user.id ? (

                        <DescriptionForm
                            saveChanges={saveChanges}
                            setSaveChanges={setSaveChanges}
                            setDisabledDescription={setDisabledDescription}
                            handleDescriptionInputChange={handleDescriptionInputChange}
                            disabledDescription={disabledDescription}
                            description={description}
                            handleSubmit={handleSubmit}
                            descriptionCharsCount={descriptionCharsCount}
                        />

                    ) : (
                        // Else just show the description
                        <p>{description}</p>
                    )}


                    {/* This is just a button to toggle the pop-up window*/}
                    <div className={'group-settings-container'}>
                        <button onClick={() => showGroupMembers(currentGroupInfo)}>
                            Chat members
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}