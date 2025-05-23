


import '../../styles/LandingPage/DummyMessageCard.css'


/**
 * This component is used for creating the mock-up landing page
 * messages
 *
 *
 * @param img if there is an image / GIF
 * @param height height of the user avatar
 * @param duration of the CSS animation
 * @param width width of the user avatar
 * @param sender of the "message"
 * @param files demonstrate the file sharing feature
 * @param username of the sender
 * @param gifs
 * @param delay of the CSS animation
 * @param message the content of the message
 * @returns {JSX.Element}
 * @constructor
 */






export const DummyMessage = ({img, height, duration, width, sender, files, username, gifs, delay, message}) => {

    return (
        <div

            /*Delay the animation to sync them up properly*/
            style={{ animationDelay: `${delay}ms` }}
            className={`dummy-message-card 
              ${sender ? 'sender' : ''} 
              ${duration ? 'duration' : ''}`}>

            {/* Check who is the sender, which aligns the message on the right or left side of the chat*/}
            <div className={`dummy-header ${sender ? 'sender' : ''}`}>
                <img
                    style={{height, width}}
                    src={img}
                    alt="user-avatar"
                />
                <p>{username}</p>
            </div>

            {/* Show a mock message of a GIF sent in a conversation */}
            {gifs ? (
                <img
                    className={`dummy-message-gif`}
                    src={gifs}
                    alt="funny cat"
                    style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
            ) : (
                <div className={`dummy-message ${sender ? 'sender' : ''}`}>
                    {/* It they also provided a message, show that as well*/}

                    {message && (
                        <p>{message}</p>)}

                    {/* Show a mock message of a GIF sent in a conversation */}
                    {files && (
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                                 fill="#e3e3e3"><path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z"/></svg>
                            <p>Meeting 2025-05-02.pdf</p>
                        </div>)}

                </div>
            )}
        </div>
    )

}