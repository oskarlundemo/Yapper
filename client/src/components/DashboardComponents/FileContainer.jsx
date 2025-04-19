import {useEffect} from "react";


export const FileContainer = ({files, removeFile}) => {


    useEffect(() => {
        console.log(files);
    }, [files]);


    return (
        <div className="file-container">
            {files.map((file, i) => (
                <div className={'file-card'} key={i}>
                    <p>{file?.name}</p>
                    <svg onClick={() => removeFile(file.name)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                </div>
            ))}
        </div>
    )

}