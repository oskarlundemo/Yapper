



export const MessageInputArea = ({handleSubmit, setMessage, message}) => {



    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                id="message"
                name="message"
                onChange={e => setMessage(e.target.value)}
                value={message}
                placeholder="Aa"
                autoComplete="off"
                spellCheck={true}
                autoCorrect="on"
            />
        </form>
    )
}
