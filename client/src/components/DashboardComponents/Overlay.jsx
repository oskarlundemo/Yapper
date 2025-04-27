


import '../../styles/Overlay.css'


export const Overlay = ({hideOverlay, clickOnOverlay}) => {

    return (
        <div onClick={() => clickOnOverlay()} className={`overlay ${hideOverlay ? 'hide' : ''}`}/>
    )
}