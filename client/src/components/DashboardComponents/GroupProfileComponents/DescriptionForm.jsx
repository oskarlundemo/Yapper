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
            {disabledDescription ? (
                   <svg
                       onClick={() => {
                           setDisabledDescription((prev) => {
                               const newVal = !prev;
                               setSaveChanges(!newVal);
                               return newVal;
                           });
                       }}
                       xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z"/></svg>
            ): null}


            {saveChanges && (
                <button
                    type="submit">
                    Save changes
                </button>
            )}
        </form>
    )
}