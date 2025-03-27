import {useEffect, useState} from "react";
import '../../styles/LoginPage/Checks.css'


export const UsernameCheck = ({name, username, setAcceptedUsername, isUsernameFocused, errors}) => {

    // Username
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (Array.isArray(errors)) {
            const error = errors.find(err => err.path === name);
            setErrorMessage(error ? error.msg : '');
            setIsValidUsername(false);
        } else if (typeof errors === 'string') {
            setErrorMessage(errors);
        }
    }, [errors, name]);



    const validUsername = (username) => {
        const valid = username.length >= 3 && username.length <= 10;
        setIsValidUsername(valid);
        setAcceptedUsername(valid);
    }

    useEffect(() => {
        validUsername(username);
    }, [username])


    return (

        <div className={`checks username-check ${(isUsernameFocused || errorMessage) ? "show" : ""}`}>
            <div className={`username-check`}>
                {errorMessage ? (
                    <>
                        <svg className={'error-msg'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                            <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                        </svg>
                        <p className="error-msg">{errorMessage}</p>
                    </>
                ) : (
                    <div className={isValidUsername ? "approved" : "error-msg"}>
                        {isValidUsername ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/>
                            </svg>
                        )}
                        <p>Username is between 3 to 10 characters</p>
                    </div>
                )}
            </div>
        </div>
    )
}