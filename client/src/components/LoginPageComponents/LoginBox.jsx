import {Inputfield} from "../Inputfield.jsx";
import {useEffect, useState} from "react";
import '../../styles/LoginPage/LoginBox.css'
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {useDynamicStyles} from "../../context/DynamicStyles.jsx";

export const LoginBox = ({showLogin, URL}) => {

    const navigate = useNavigate();
    const { login } = useAuth();
    const {setFirstLogin} = useDynamicStyles();


    const [errors, setErrors] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            return updatedData;
        });
    }


    useEffect(() => {
        setIsDisabled(formData.username.length < 3 || formData.password.length < 8);
    }, [formData.username, formData.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
           const response = await fetch(`${URL}/sign-in`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const result = await response.json();

            if (!response.ok) {
                console.log(result.errors || result.error);
                setErrors(result.errors || result.error);
            } else {
                login(result.token);
                navigate('/dashboard');
                setFirstLogin(true);
            }
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <>
        <section className={`login-box ${showLogin ? "hide" : ""}`}>

            <h2>Sign in</h2>

            <form onSubmit={handleSubmit}>

                <Inputfield
                    type="text"
                    title="Username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    name="username"
                    example='doejohn'
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>}
                />

                <Inputfield
                    type="password"
                    title="Password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    name="password"
                    example="******"
                    errors={errors}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>}
                />

                <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Sign in</button>

            </form>
            <p>Don't have an account? <Link to='/signup'>Create one</Link></p>
        </section>
        </>
    )
}