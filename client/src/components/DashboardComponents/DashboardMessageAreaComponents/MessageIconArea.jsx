import {GifContainer} from "../GifContainer.jsx";
import {FileSelect} from "../../FileSelect.jsx";


export const MessageIconArea = ({receivers, handleSubmit, files, setFiles, showGifs, gifs, setReceivers}) => {



    return (
        <div className={'message-inputarea-icons'}>

            <svg onClick={(e) => handleSubmit(e)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>

            <GifContainer receivers={receivers} setReceivers={setReceivers}
                          showGifs={gifs} setShowGifs={showGifs} />

            <FileSelect files={files} setFiles={setFiles} />

            <svg onClick={() => showGifs(!gifs)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm240-160h60v-240h-60v240Zm-160 0h80q17 0 28.5-11.5T400-400v-80h-60v60h-40v-120h100v-20q0-17-11.5-28.5T360-600h-80q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h60v-80h80v-60h-80v-40h120v-60H560v240ZM200-200v-560 560Z"/>
            </svg>
        </div>
    )
}