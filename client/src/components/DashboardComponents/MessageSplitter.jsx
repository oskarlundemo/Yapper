





export const MessageSplitter = ({ date }) => {
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