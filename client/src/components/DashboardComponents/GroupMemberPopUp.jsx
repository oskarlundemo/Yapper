import {useState} from "react";


import '../../styles/Dashboard/GroupMemberPopUp.css'
import {ContactCard} from "./ContactCard.jsx";

export const GroupMemberPopUp = ({group, hidePopUp, closePopUp, hideOverlay}) => {


    const [groupMembers, setGroupMembers] = useState(group || []);


    return (
        <div className={`groupMemberPopUp ${hidePopUp ? "hide" : ""}`}>

            <div className="groupMemberPopUp-header">
                <svg onClick={() => {closePopUp(true); hideOverlay(true)}} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div>

            <div className="groupMemberPopUp-users">
                {group  && (
                    group.map((member, index) => (
                        <ContactCard friend={member} key={member.id}/>

                    ))
                )}
            </div>
        </div>
    )

}