import {useEffect, useState} from "react";
import '../../styles/LoginPage/Checks.css'


/**
 * This component is used for showing feedback on the email that the user
 * provides. Updating to green if ok or red if not
 *
 *
 * @param name of the field
 * @param email value
 * @param setAcceptedEmail state to set if the email is correctly formatted
 * @param isEmailFocused check if the email input is focused
 * @param errors when creating account
 * @returns {JSX.Element}
 * @constructor
 */



export const EmailCheck = ({name, email, setAcceptedEmail, isEmailFocused, errors}) => {

    const [isValidEmail, setIsValidEmail] = useState(false);  // State to check if email is ok
    const [errorMessage, setErrorMessage] = useState(''); // State to show error


    // Function to validate the email
    const validateEmail = (email) => {
        const standardEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = standardEmailFormat.test(email);
        setIsValidEmail(valid);
        setAcceptedEmail(valid);
    };


    // This hook is used for keeping track if the errors was based on the email
    useEffect(() => {
        if (Array.isArray(errors)) {
            const error = errors.find(err => err.path === name);
            setErrorMessage(error ? error.msg : '');
            setIsValidEmail(false);
        } else if (typeof errors === 'string') {
            setErrorMessage(errors);
        }
    }, [errors, name]);


    // This hook is used to always update and check if email is ok
    useEffect(() => {
        validateEmail(email);
    }, [email])


    return (
        <div className={`checks email-check ${isEmailFocused || errorMessage ? "show" : ""}`}>
            <div className={`email-check`}>
                {/* If there are any errors, show them */}
                {errorMessage ? (
                    <>
                        <svg className={'error-msg'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                        </svg>
                        <p className="error-msg">{errorMessage}</p>
                    </>
                ) : (
                    <div className={isValidEmail ? "approved" : "error-msg"}>
                        {/*If email is valid, show a check, else a X*/}
                        {isValidEmail ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                            </svg>
                        )}
                        <p>Email is valid ex. joe@domain.com</p>
                    </div>
                )}
            </div>
        </div>
    )
}