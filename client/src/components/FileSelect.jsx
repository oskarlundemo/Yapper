import {useRef, useState} from "react";


export const FileSelect = () => {

    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger hidden file input
    };

    return (
        <div className="p-4 border rounded-lg shadow-md w-80">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <button
                onClick={handleButtonClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>            </button>
            {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
        </div>
    );
}