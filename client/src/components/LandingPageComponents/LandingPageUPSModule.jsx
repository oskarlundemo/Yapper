


import '../../styles/LandingPage/LandingPageUPSModule.css'


/**
 * This component is the used as containers of each module on the
 * landing page
 *
 *
 * @param title of the module
 * @param children all the elements inside it
 * @param subtitle of the module
 * @param row alignment in the grid
 * @param column alignment in the grid
 * @param delay of animation
 * @returns {JSX.Element}
 * @constructor
 */



export const LandingPageUPSModule = ({title, children, subtitle, row, column, delay}) => {



    return (
        <section style={{
            gridRow: row,
            gridColumn: column,
            animationDelay: `${delay}s`,
        }} className="landing-page-module">

            <div className="landing-page-text">
                <h2>{title}</h2>
                <h3>{subtitle}</h3>
            </div>

            <div className="mock-chat-window">
                {children}
            </div>

        </section>
    )
}