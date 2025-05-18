import {useEffect, useState} from "react";



import '../../styles/LoginPage/Checks.css'


/**
 * This component is used for showing password validation
 * in a UI-friendly way
 *
 *
 * @param password the user input
 * @param setAcceptedPassword set the updated state if validation is ok
 * @param isPasswordFocused check if the input field is focused
 * @returns {JSX.Element}
 * @constructor
 */



export const PasswordChecks = ({password, setAcceptedPassword, isPasswordFocused}) => {

    const [isPasswordLength, setIsPasswordLength] = useState(false);  // State to keep track of password length
    const [isNumber, setIsNumber] = useState(false); // State to check if password contains number 12345
    const [isSymbol, setIsSymbol] = useState(false); // State to check if password contains symbol =!)"!

    const validatePassword = (password) => {
        const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password); // Checks for special characters only
        const hasNumber = /\d/.test(password);  // Checks for at least one digit (0-9)
        const isValidLength = password.length >= 8; // Minimum length 8 chars

        const isValid = hasSpecialChar && hasNumber && isValidLength; // Validate input

        setIsPasswordLength(isValidLength);
        setIsNumber(hasNumber);
        setIsSymbol(hasSpecialChar);
        setAcceptedPassword(isValid);
    }


    // This hook is used to always runs once the password changes and validate if the password is ok
    useEffect(() => {
        validatePassword(password);
    }, [password]);

    return (
        <div className={`checks password-checks ${isPasswordFocused ? "show" : ""}`}>


            {/* Is password longer than 8 chars? Yes, then green text and check mark, else red and X */}
            <div className={`password-check ${isPasswordLength ? "approved" : ""}`}>
                {isPasswordLength ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Minimum 8 characters</p>
            </div>

            {/* Has password a number? Yes, then green text and check mark, else red and X */}
            <div className={`password-check ${isNumber ? "approved" : ""}`}>
                {isNumber ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Contains a number</p>
            </div>

            {/* Has password a symbol? Yes, then green text and check mark, else red and X */}
            <div className={`password-check ${isSymbol ? "approved" : ""}`}>
                {isSymbol ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                    : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                <p>Contains a symbol ex. (!@$%&)</p>
            </div>
        </div>
    )
}