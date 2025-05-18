import {useEffect, useState} from "react";
import '../styles/Inputfield.css'


/**
 * This component is used for standardising the input fields
 * in both the LoginBox.jsx and CreateUserBox.jsx components
 *
 *
 * @param title of the input
 * @param type ex text, password etc
 * @param id of the input
 * @param name used for updating the state of the input
 * @param onChange function to update the state
 * @param value of the input
 * @param example placeholder
 * @param svg icon
 * @param errors on input
 * @param onFocus function on input clicked
 * @param onBlur function on input unfocused
 * @returns {JSX.Element}
 * @constructor
 */



export const Inputfield = ({ title, type, id, name, onChange, value, example, svg = null,  errors = [], onFocus = null, onBlur = null, }) => {

    const [errorMessage, setErrorMessage] = useState(''); // Set error message

    // Runs through the error array and appends the correct error message to the appropriate input fields
    useEffect(() => {
        if (Array.isArray(errors)) {
            const error = errors.find(err => err.path === name);
            setErrorMessage(error ? error.msg : '');
        } else if (typeof errors === 'string') {
            setErrorMessage(errors);
        }
    }, [errors, name]);

    return (
        <div className="input-field">
            <fieldset className="input-fieldset">
                <legend>{title}</legend>
                <div className="input-card">
                    <input
                        type={type}
                        id={id}
                        name={name}
                        onChange={onChange}
                        value={value}
                        placeholder={example}
                        onFocus={onFocus ? onFocus : undefined}
                        onBlur={onBlur ? onBlur : undefined}
                    />
                    {svg && (
                        <div className="input-icon">
                            {Array.isArray(svg) ? svg.map((icon, index) => <span key={index}>{icon}</span>) : <span>{svg}</span>}
                        </div>
                    )}
                </div>
            </fieldset>
            <p className="error-msg">{errorMessage}</p>
        </div>
    );
};