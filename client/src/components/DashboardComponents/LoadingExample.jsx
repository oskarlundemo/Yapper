


import '../../styles/Dashboard/LoadingExample.css'


/**
 * This component is just used for loading animations, so it acts like a
 * grey pulsating square
 *
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const LoadingExample = () => {

    return (
        <div className="loading-card">
            <div className="loading-fake-avatar"></div>

            <div className="loading-placeholder">
                <div className="box"></div>
            </div>
        </div>
    )
}