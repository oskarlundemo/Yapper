


import '../../styles/Dashboard/ConversationCard.css'



export const ConversationCard = () => {


    return (

        <div className="conversation-card">

            <div className="conversation-card-avatar">
                <img src='../../../public/lundemo.png' className="avatar" />
            </div>

            <div className="conversation-card-content">
                <h3 className={'conversation-contact'}>Oskar Lundemo  <span>4:30 AM</span></h3>
                <p className={'conversation-content'}>Hey! Would it not be great if we could...</p>
            </div>

        </div>

    )

}