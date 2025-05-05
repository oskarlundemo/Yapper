import {LandingPageHeader} from "../components/LandingPageComponents/LandingPageHeader.jsx";
import {LandingPageUPSModule} from "../components/LandingPageComponents/LandingPageUPSModule.jsx";
import {LandingPageFooter} from "../components/LandingPageComponents/LandingPageFooter.jsx";



import '../styles/LandingPage/LandingPage.css'


export const LandingPage = ({API_URL}) => {



    return (
        <div className="landing-page-wrapper">
            <LandingPageHeader />


            <main className={'landing-page-main'}>

                <LandingPageUPSModule
                    title={'Create group chats with your friends'}
                    subtitle={'Stay connected with friends through realtime direct messages'}
                    row={1}
                    column={2}
                    delay={0}
                    media={'GroupChat2.mp4'}
                />

                <LandingPageUPSModule
                    title={'Share and download content'}
                    subtitle={'Share images or documents with your contacts'}
                    row={2}
                    column={1}
                    delay={1}
                    media={'ContentPreview2.mp4'}
                />

                <LandingPageUPSModule
                    title={'Send a funny GIF'}
                    subtitle={'Why write it in words when you can send a GIF?'}
                    height={200}
                    width={200}
                    row={3}
                    column={2}
                    delay={2}
                    media={'gifs.mp4'}

                />

            </main>

            <LandingPageFooter/>

        </div>
    )
}