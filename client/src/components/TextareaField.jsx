import {useEffect, useState} from "react";
import '../styles/Inputfield.css'

export const TextareaField = ({ title, type, id, name, onChange, value, example, svg = null,  errors = [], onFocus = null, onBlur = null, }) => {

    const [errorMessage, setErrorMessage] = useState(''); // Set error message

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
                    <textarea
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