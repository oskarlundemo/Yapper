


import '../../styles/Dashboard/Attachments.css'
import {supabase} from "../../services/supabaseClient.js";


export const Attachment = ({file}) => {



    const downloadFile = async (path) => {
        const {data, error} = await supabase
            .storage
            .from('yapper')
            .download(`files/${path}`)


        const url = URL.createObjectURL(data)


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
            <p onClick={() => downloadFile(file?.file.path)} >{file?.file.path}</p>
        </div>
    )
}