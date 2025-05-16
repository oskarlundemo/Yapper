import {ContactCard} from "./ContactCard.jsx";

import '../../styles/Dashboard/DropDownWithUsers.css'

/**
 *
 * This component is used fow showing the user other users once they want to invite or
 * start a new conversation with somebody on the plattform
 *
 *
 *
 * @param filteredContacts // Array of the users friends filtered based on input
 * @param setInputFocused  // If user has clicked on the input field, show the menu
 * @param addToConversation // Add a user to the conversation once the user clicks on their name
 * @param addToGroup        // Add a user to an already existing group chat
 * @param example          // Placeholder text
 * @param filteredMoreUsers  // All the users that are not friends filtered based on input
 * @param inputFocused      // Has the user clicked the input field
 * @param userSearchString  // The search string the user provides searching for other users
 * @param setUserSearchString // Set the search string
 * @returns {JSX.Element}
 * @constructor
 */






export const DropDownWithUsersComponent = ({filteredContacts, setInputFocused, addToConversation = null,
                                               addToGroup = null, example = '', filteredMoreUsers,
                                               inputFocused, userSearchString, setUserSearchString}) => {



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

            {/* Show the drop-down menu only when the user inspects the input fileds */}
            {inputFocused && (
                <div className="new-message-search-results">

                    {/* Show the users friends first */}
                    {filteredContacts.length > 0 && (
                        <>
                            <p className="sub-header-contact">Your contacts</p>
                            {filteredContacts.map((friend) => (
                                <ContactCard
                                    key={friend.id}
                                    friend={friend?.friend || friend}
                                    setUserSearchString={setUserSearchString}
                                    addToConversation={addToConversation}
                                    addToGroup={addToGroup}
                                />
                            ))}
                        </>
                    )}

                    {/* Show all the other users beneath */}
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

                    {/* No users matches the search query? Show this */}
                    {filteredContacts.length === 0 && filteredMoreUsers.length === 0 && (
                        <p className="no-results-text">No users found</p>
                    )}
                </div>
            )}
        </div>
    )
}