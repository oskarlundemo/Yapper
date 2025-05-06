


import '../../styles/LandingPage/LandingPageUPSModule.css'



export const LandingPageUPSModule = ({title, moduleWidth = 500, children, subtitle, media, height, width, row, column, delay}) => {


    return (
        <section style={{
            gridRow: row,
            gridColumn: column,
            animationDelay: `${delay}s`,
            width: moduleWidth,
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