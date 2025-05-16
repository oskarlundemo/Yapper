/**
 *
 * This component is used for display the selected files the user has attached
 * to their message. Integrated in the DashboardMessageArea.jsx component
 *
 * @param files // The files in the array
 * @param setFiles // Set the files in the array
 * @returns {JSX.Element}
 * @constructor
 */


export const FileContainer = ({files, setFiles}) => {

    // This function is used for removing files from the array
    const handleFileRemove = (removeIndex) => {
        setFiles(files.filter((_, index) => index !== removeIndex));
    }

    return (
        <div className="file-container">
            {files.map((file, index) => (
                <div className={'file-card'} key={index}>
                    <p>{file?.name}</p>
                    <svg onClick={() => handleFileRemove(index)}
                         xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
            ))}
        </div>
    )
}