


import '../../styles/LandingPage/LandingPageHeader.css'


export const LandingPageHeader = () => {



    return (

        <header className="landing-page-header">

            <div className="landing-page-logo">
                <h1 className="landing-page-title">Yapper</h1>
                <img src={'../transparentLogo.png'} className="landing-page-logo" alt="logo" />
            </div>


            <h2 className="landing-page-subtitle">Stop talking, <span>start</span> yapping!</h2>

        </header>
    )

}