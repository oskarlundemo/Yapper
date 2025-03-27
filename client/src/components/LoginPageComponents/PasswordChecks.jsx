import {useEffect, useState} from "react";



import '../../styles/LoginPage/Checks.css'


export const PasswordChecks = ({password, setAcceptedPassword, isPasswordFocused}) => {

    const [isPasswordLength, setIsPasswordLength] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);

    const validatePassword = (password) => {
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password); // Checks for special characters only
        const hasNumber = /\d/.test(password);  // Checks for at least one digit (0-9)
        const isValidLength = password.length >= 8;

        const isValid = hasSpecialChar && hasNumber && isValidLength;

        setIsPasswordLength(isValidLength);
        setIsNumber(hasNumber);
        setIsSymbol(hasSpecialChar);
        setAcceptedPassword(isValid);
    }


    useEffect(() => {
        validatePassword(password);
    }, [password]);

    return (
        <div className={`checks password-checks ${isPasswordFocused ? "show" : ""}`}>

            <div className={`password-check ${isPasswordLength ? "approved" : ""}`}>
                {isPasswordLength ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Minimum 8 characters</p>
            </div>

            <div className={`password-check ${isNumber ? "approved" : ""}`}>
                {isNumber ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Contains a number</p>
            </div>

            <div className={`password-check ${isSymbol ? "approved" : ""}`}>
                {isSymbol ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Contains a symbol ex. (!@$%&)</p>
            </div>
        </div>
    )
}