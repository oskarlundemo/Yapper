import {useRef} from "react";
import '../styles/Dashboard/FileSelect.css'


/**
 * This component is used when users are attaching files to a message
 *
 * @param files array of files
 * @param setFiles state to update the array of files
 * @returns {JSX.Element}
 * @constructor
 */


export const FileSelect = ({files, setFiles}) => {

    const fileInputRef = useRef(null);

    // This function is used for adding files to the array that will be sent to the DB
    const handleFileAdd = (e) => {
        if (e.target.files[0].name) {
            const selectedFile = e.target.files[0];
            setFiles([...files, selectedFile]); // Append file to array
        }
    }

    // This is used for opening the file picker
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className={'file-select-container'}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAdd}
                className="hidden"
            />

            <button
                onClick={handleButtonClick}
                className={'file-btn'}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
            </button>
        </div>
    );
}