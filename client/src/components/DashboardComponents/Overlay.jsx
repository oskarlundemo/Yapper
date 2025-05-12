


import '../../styles/Overlay.css'
import {useDashboardContext} from "../../context/DashboardContext.jsx";


export const Overlay = ({}) => {


    const {clickOnOverlay, hideOverlay} = useDashboardContext();

    return (
        <div onClick={() => clickOnOverlay()} className={`overlay ${hideOverlay ? 'hide' : ''}`}/>
    )
}