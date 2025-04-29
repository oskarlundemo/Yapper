import {ContactCard} from "./ContactCard.jsx";


export const DropDownWithUsersComponent = ({filteredContacts, setInputFocused, addToConversation = null, addToGroup = null, example = '', filteredMoreUsers, inputFocused, userSearchString, setUserSearchString}) => {




    return (

        <div className="new-message-input-container">
            <input
                type="text"
                id="message"
                placeholder={example}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                onChange={(e) => setUserSearchString(e.target.value)}
                value={userSearchString}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setTimeout(() => setInputFocused(false), 150)}
            />

            {inputFocused && (
                <div className="new-message-search-results">

                    {filteredContacts.length > 0 && (
                        <>
                            <p className="sub-header-contact">Your contacts</p>
                            {filteredContacts.map((friend) => (
                                <ContactCard
                                    key={friend.id}
                                    friend={friend?.friend || friend}
                                    addToConversation={addToConversation}
                                    addToGroup={addToGroup}
                                />
                            ))}
                        </>
                    )}

                    {filteredMoreUsers.length > 0 && (
                        <>
                            <p className="sub-header-contact">Other users</p>
                            {filteredMoreUsers.map((user) => (
                                <ContactCard
                                    key={user.id}
                                    friend={user}
                                    addToConversation={addToConversation}
                                    addToGroup={addToGroup}
                                />
                            ))}
                        </>
                    )}

                    {filteredContacts.length === 0 && filteredMoreUsers.length === 0 && (
                        <p className="no-results-text">No users found</p>
                    )}
                </div>
            )}
        </div>
    )
}