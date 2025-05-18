/**
 *
 * This component is used for updating the description / bio of a group chat
 *
 *
 * @param saveChanges state to save changes
 * @param setSaveChanges setting the state to make changes
 * @param setDisabledDescription  disabled description from unauthorized
 * @param descriptionCharsCount tracking the length of the description
 * @param handleDescriptionInputChange updating the state of the description
 * @param disabledDescription disabled description from unauthorized
 * @param description itself
 * @param handleSubmit function to handle submit
 * @returns {JSX.Element}
 * @constructor
 */ import {useEffect} from "react";




export const DescriptionForm = ({ saveChanges, setSaveChanges, setDisabledDescription, descriptionCharsCount,
                                          handleDescriptionInputChange, disabledDescription, description, handleSubmit, }) => {



    return (
        <form className={'edit-user-info'} onSubmit={(e) => handleSubmit(e)}>

            {/* If the description is disabled, just show the description*/}
            {disabledDescription ? (
                <p className={'user-bio'}>{description}</p>
            ) : (
                <>
                    {/* Else show a text area were the user can update */}
                    <textarea value={description}
                              disabled={disabledDescription}
                              onKeyDown={(e) => {
                                  if (description.length >= 50 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                      e.preventDefault();
                                  }
                              }}
                              onChange={(e) => handleDescriptionInputChange(e)}/>
                    {/* Live count of the lenght of the group chat*/}
                    <p><span>{descriptionCharsCount}</span>/50</p>
                </>
            )}

            {/* If it is disabled show an edit icon */}
            {disabledDescription && (

                <button
                    onClick={() => {
                        setDisabledDescription((prev) => {
                            const newVal = !prev;
                            setSaveChanges(!newVal);
                            return newVal;
                        });
                    }}>
                    Edit
                </button>
            )}


            {saveChanges && (
                <button
                    type="submit">
                    Save changes
                </button>
            )}
        </form>
    )
}