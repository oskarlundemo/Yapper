


import '../../styles/LandingPage/LandingPageUPSModule.css'


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