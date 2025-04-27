




import {useAuth} from "../../context/AuthContext.jsx";
import {useEffect, useState} from "react";
import '../../styles/Dashboard/UserProfile.css'
import {GroupAvatar} from "./GroupAvatar.jsx";
import '../../styles/Dashboard/GroupProfile.css'
import {supabase} from "../../services/supabaseClient.js";

export const GroupProfile = ({miniBar, setMiniBar, group = null, groupName, setGroupName, API_URL, showGroupMembers}) => {

    const {user} = useAuth();

    const [description, setDescription] = useState(group?.description || '');
    const [file, setFile] = useState(null)
    const [newAvatar, setNewAvatar] = useState(null)
    const [disabledDescription, setDisabledDescription] = useState(true)
    const [saveChanges, setSaveChanges] = useState(false)
    const [charsCount, setCharsCount] = useState(0)
    const [groupNameChannel, setGroupNameChannel] = useState(null);

    useEffect(() => {
        if (!user?.id || !group?.id) return;

        const channelName = `updateGroupProfile-${user.id}-${group.id}`;
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
                    console.log(group)

                    if (group.id === group.id) {
                        setGroupName(group.name);
                        setDescription(group.description);
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
    }, [user.id, group]);




    useEffect(() => {
        setDescription(group?.description || '')
    }, [group])

    useEffect(() => {
        setGroupName(group?.name || '')
    }, [group])


    useEffect(() => {
        setCharsCount(description?.length)
    }, [description])


    const handleSubmit = (e) => {
        e.preventDefault();

        setSaveChanges(false);
        setDisabledDescription(true);

        const formData = new FormData();
        formData.append('avatar', newAvatar);
        formData.append('description', description);
        formData.append('groupName', groupName);

        try {
            fetch(`${API_URL}/groups/update/${group.id}`, {
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
                    <GroupAvatar user={user} group={group} width={100} height={100} setSaveChanges={setSaveChanges} setNewAvatar={setNewAvatar} selectPicture={true} setFile={setFile} file={file} />
                </div>

                <div className={'user-info'}>

                    {disabledDescription ? (
                        <h2>{groupName || ''}</h2>
                    ) : (
                        <input className={'group-name-input'}
                               type={'text'}
                               value={groupName}
                               onChange={e => setGroupName(e.target.value)}
                        />
                    )}
                    {group?.admin_id === user.id ? (
                        <form className={'edit-user-info'} onSubmit={(e) => handleSubmit(e)}>

                            {disabledDescription ? (
                                <p className={'user-bio'}>{ description || 'No description'}</p>
                            ) : (
                                <>
                                <textarea value={description}
                                          placeholder={description}
                                          disabled={disabledDescription}
                                          onChange={(e) => setDescription(e.target.value)}
                                />
                                    <p><span>{charsCount}</span>/50</p>
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
                        <p>{description || 'No description'}</p>
                    )}


                    <div className={'group-settings-container'}>
                        <ul className={'group-settings'}>
                            <li onClick={() => showGroupMembers(group)}>Chat members</li>
                        </ul>

                    </div>



                </div>
            </div>

        </div>
    )
}