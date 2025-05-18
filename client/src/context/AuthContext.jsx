



import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from "jwt-decode";

/**
 * This context is used to create and assign users with their
 * jwt-token so it can be used in the app.
 * @type {React.Context<unknown>}
 */






const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null); // State to hold the user

    // This hook is used for creating the token and storing it in the local storage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded); // Set the token here
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, [])


    // This function is used for login-in, called in the LoginBox.jsx component
    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        const decoded = jwtDecode(newToken);
        setUser(decoded);
    };

    // This function is used for logging-out, called in the UserProfile.jsx
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);