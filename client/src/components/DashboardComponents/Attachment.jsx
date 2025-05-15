


import '../../styles/Dashboard/Attachments.css'
import {supabase} from "../../services/supabaseClient.js";
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This components is used for rendering attachments inside the DashboardChatwindow.jsx component
 * once a user sends a message with files attached, so users also can download down from the chat
 *
 * @param file The file that will be rendered
 * @returns {JSX.Element}
 * @constructor
 */


export const Attachment = ({file}) => {


    const {groupChat} = useDashboardContext(); // Check if the file was sent in a group chat or private conversation


    // Function for downloading files from the chat
    const downloadFile = async (path) => {


        const folderSelector = groupChat ? 'groupConversations' : 'privateConversations'; // Selects the endpoint where to fetch the files from in Supabase

        // Supabase client
        const {data, error} = await supabase
            .storage
            .from('yapper')
            .download(`${folderSelector}/${path}`)

        const url = URL.createObjectURL(data) // Create a temporary URL for the blob so it can be downloaded like a normal file
        const a = document.createElement('a');
        a.href = url;
        a.download = path;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    return (
        <div className="attachment">
            <div onClick={() => downloadFile(file?.uniqueFileName)} className="attachment-container">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
                <p>{file?.originalName}</p>
            </div>
        </div>
    )
}