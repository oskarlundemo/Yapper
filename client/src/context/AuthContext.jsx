



import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, [])


    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        const decoded = jwtDecode(newToken);
        setUser(decoded);
    };


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