



/**
 * This component is used for dividing the messages with clear timestamps,
 * which helps with readability and UX. So with each new day between messages
 * it is clear when a message was sent
 *
 * @param date the timestamp of the message
 * @returns {JSX.Element}
 * @constructor
 */



export const MessageSplitter = ({ date }) => {

    // Format the timestamp sent from the DB
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="message-splitter">
            <h4>{formattedDate}</h4>
        </div>
    );
};