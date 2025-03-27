import {useEffect, useState} from "react";
import '../../styles/LoginPage/Checks.css'


export const EmailCheck = ({name, email, setAcceptedEmail, isEmailFocused, errors}) => {

    const [isValidEmail, setIsValidEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const validateEmail = (email) => {
        const standardEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = standardEmailFormat.test(email);
        setIsValidEmail(valid);
        setAcceptedEmail(valid);
    };


    useEffect(() => {
        if (Array.isArray(errors)) {
            const error = errors.find(err => err.path === name);
            setErrorMessage(error ? error.msg : '');
            setIsValidEmail(false);
        } else if (typeof errors === 'string') {
            setErrorMessage(errors);
        }
    }, [errors, name]);


    useEffect(() => {
        validateEmail(email);
    }, [email])


    return (
        <div className={`checks email-check ${isEmailFocused || errorMessage ? "show" : ""}`}>
            <div className={`email-check`}>
                {errorMessage ? (
                    <>
                        <svg className={'error-msg'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                        </svg>
                        <p className="error-msg">{errorMessage}</p>
                    </>
                ) : (
                    <div className={isValidEmail ? "approved" : "error-msg"}>
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