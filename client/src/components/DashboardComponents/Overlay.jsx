


import '../../styles/Overlay.css'
import {useDashboardContext} from "../../context/DashboardContext.jsx";


/**
 * This component is just used for creating an overlay
 * when there is a pop-up window active
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */

export const Overlay = ({}) => {

    const {clickOnOverlay, hideOverlay} = useDashboardContext();  // Hide and show the overlay based on state

    return (
        <div onClick={() => clickOnOverlay()} className={`overlay ${hideOverlay ? 'hide' : ''}`}/>
    )
}