




import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {GroupAvatar} from "./GroupAvatar.jsx";
import '../../styles/Dashboard/GroupProfile.css'
import {supabase} from "../../services/supabaseClient.js";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";
import {useDashboardContext} from "../../context/DashboardContext.jsx";

export const GroupProfile = ({headerName}) => {

    const {user} = useAuth();
    const {API_URL, currentGroupInfo, groupChat, showGroupMembers} = useDashboardContext();


    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null)
    const [newAvatar, setNewAvatar] = useState(null)
    const [disabledDescription, setDisabledDescription] = useState(true)
    const [saveChanges, setSaveChanges] = useState(false)
    const [descriptionCharsCount, setDescriptionCharsCount] = useState(0)
    const [groupNameChannel, setGroupNameChannel] = useState(null);
    const [groupName, setGroupName] = useState(currentGroupInfo?.name || '');
    const [groupNameCharCount, setGroupNameCharCount] = useState(0);
    const {showMinibar, setShowMinibar, phoneUI, clickBackToChat, setChatName} = useDynamicStyles();


    useEffect(() => {
        setDescriptionCharsCount(description.length);
    }, [description]);


    useEffect(() => {
        if (currentGroupInfo?.description && currentGroupInfo.description !== 'null') {
            setDescription(currentGroupInfo.description);
        } else {
            setDescription('No description');
        }
        setGroupName(currentGroupInfo?.name || '');
    }, [currentGroupInfo]);



    useEffect(() => {
        setGroupName(currentGroupInfo?.name);
    }, [currentGroupInfo]);

    useEffect(() => {
        if (!user?.id || !currentGroupInfo?.id) return;

        const channelName = `updateGroupProfile-${user.id}-${currentGroupInfo.id}`;
        const newChannel = supabase
            .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'GroupChats',
                },
                async (payload) => {

                    const group = payload.new;

                    if (group.id === group.id) {
                        setDescription(group.description);
                        headerName(group.name)
                    }
                }
            )
            .subscribe();

        setGroupNameChannel((prevChannel) => {
            if (prevChannel) {
                supabase.removeChannel(prevChannel);
            }
            return newChannel;
        });
        return () => {
            supabase.removeChannel(newChannel);
        };
    }, [user.id, currentGroupInfo]);




    useEffect(() => {
        setDescription(currentGroupInfo?.description || '')
    }, [currentGroupInfo])



    useEffect(() => {
        setDescriptionCharsCount(description?.length)
    }, [description])


    useEffect(() => {
        setGroupNameCharCount(groupName?.length)
    }, [groupName])


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
            console.log(err)
        }
    }

    const handleGroupNameChange = (e) => {
        setGroupName(e.target.value);
    };


    const handleDescriptionInputChange = (e) => {
        if (description.length > 50) {
            e.preventDefault();
            return
        }
        setDescription(e.target.value);
    }


    return (
        <div className={`user-profile-container ${showMinibar ? '' : 'hidden'}`}>

            {phoneUI ? (
                <svg className={'back-arrow'} onClick={() => {clickBackToChat();}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
            ) : (
                <svg className={'cross-icon'} onClick={() => setShowMinibar(false)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            )}
            <div className="user-profile-info">

                <div className={'user-avatar'}>
                    <GroupAvatar user={user} group={currentGroupInfo} width={100} height={100} setSaveChanges={setSaveChanges} setNewAvatar={setNewAvatar} selectPicture={true} setFile={setFile} file={file} />
                </div>

                <div className={'user-info'}>

                    {disabledDescription ? (
                        <h2>{groupName || ''}</h2>
                    ) : (
                        <>
                        <input className={'group-name-input'}
                               type={'text'}
                               value={groupName}
                               onChange={e => handleGroupNameChange(e)}
                               onKeyDown={(e) => {
                                   if (groupName.length >= 15 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                       e.preventDefault();
                                   }
                               }}
                        />
                            <p><span>{groupNameCharCount}</span>/15</p>
                        </>
                    )}
                    {currentGroupInfo?.admin_id === user.id ? (
                        <form className={'edit-user-info'} onSubmit={(e) => handleSubmit(e)}>

                            {disabledDescription ? (
                                <p className={'user-bio'}>{description}</p>
                            ) : (
                                <>
                                <textarea value={description}
                                          placeholder={description}
                                          disabled={disabledDescription}
                                          onKeyDown={(e) => {
                                              if (description.length >= 50 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                                  e.preventDefault();
                                              }
                                          }}
                                          onChange={(e) => handleDescriptionInputChange(e)}
                                />
                                    <p><span>{descriptionCharsCount}</span>/50</p>
                                </>
                            )}

                            {disabledDescription ? (
                                <svg onClick={() => {
                                    setDisabledDescription(!disabledDescription);
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
                        <p>{description}</p>
                    )}


                    <div className={'group-settings-container'}>
                        <ul className={'group-settings'}>
                            <li onClick={() => showGroupMembers(currentGroupInfo)}>Chat members</li>
                        </ul>

                    </div>

                </div>
            </div>

        </div>
    )
}