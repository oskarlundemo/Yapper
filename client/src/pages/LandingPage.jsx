import {LandingPageHeader} from "../components/LandingPageComponents/LandingPageHeader.jsx";
import {LandingPageUPSModule} from "../components/LandingPageComponents/LandingPageUPSModule.jsx";
import {LandingPageFooter} from "../components/LandingPageComponents/LandingPageFooter.jsx";



import '../styles/LandingPage/LandingPage.css'
import {DummyMessage} from "../components/LandingPageComponents/DummyMessageCard.jsx";
import {useState} from "react";


export const LandingPage = ({}) => {


    const groupChatConversations = [
        <>
        <DummyMessage
            message={'Hi guys! I created this group for our project 😊'}
            header={40}
            width={40}
            sender={true}
            delay={0}
            img={'female1.jpg'}
            username={'Hanna'}/>

        <DummyMessage
            message={'Great Hanna! Now we can communicate here 😀 '}
            width={40}
            sender={false}
            delay={1000}
            img={'maleprofile1.jpg'}
            username={'Carl'}/>


            <DummyMessage
                message={'Thanks for the invite! 🤩'}
                width={40}
                sender={false}
                delay={2000}
                img={'female2.jpg'}
                username={'Anna'}/>
        </>
    ]


    const fileShareConversations = [
        <>
            <DummyMessage
                message={'Hanna, do you have the notes from our latest meeting? 💭'}
                width={40}
                sender={false}
                delay={0}
                img={'maleprofile1.jpg'}
                username={'Carl'}/>

            <DummyMessage
                message={'Sure do! Here you go ✌️'}
                width={40}
                sender={true}
                delay={1000}
                img={'female1.jpg'}
                files={true}
                username={'Hanna'}/>
        </>
    ]



    const gifConversations = [
        <>
            <DummyMessage
                header={40}
                width={40}
                sender={false}
                message={'I booked the conference room from 10-12 PM this friday! ☺️'}
                delay={0}
                img={'female2.jpg'}
                username={'Anna'}
            />

            <DummyMessage
                header={40}
                width={40}
                sender={true}
                delay={1500}
                img={'female1.jpg'}
                gifs={'/cat.gif'}
                username={'Hanna'}/>
        </>
    ]

    return (
        <div className="landing-page-wrapper">
            <LandingPageHeader />

            <main className={'landing-page-main'}>

                <LandingPageUPSModule
                    title={'Create group chats with your friends'}
                    subtitle={
                        <>
                            Stay connected with friends through <span>realtime</span> messages
                        </>
                    }
                    row={1}
                    column={2}
                    delay={0}
                    children={groupChatConversations}
                >

                </LandingPageUPSModule>

                <LandingPageUPSModule
                    title={'Share and download content'}
                    subtitle={
                        <>
                            Share and download files easily with <span>Supabase</span>
                        </>
                    }
                    row={2}
                    column={1}
                    delay={1}
                    children={fileShareConversations}
                />

                <LandingPageUPSModule
                    title={'Send a funny GIF'}
                    subtitle={
                        <>
                            Why say it in words when you can send a GIF? Use <span>GIPHY</span> to express yourself
                        </>}
                    row={3}
                    column={2}
                    delay={2}
                    children={gifConversations}
                />

            </main>

            <LandingPageFooter/>

        </div>
    )
}