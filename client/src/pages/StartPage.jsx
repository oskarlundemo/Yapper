import {LoginBox} from "../components/LoginPageComponents/LoginBox.jsx";
import "../styles/LoginPage/LoginPage.css";
import {CreateUserBox} from "../components/LoginPageComponents/CreateUserBox.jsx";
import {useState} from "react";

export const StartPage = ({URL}) => {

    const [showLogin, setShowLogin] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(true);


    const toggleLogin = () => {
        setShowCreateUser(false);
        setShowLogin(true);
    }


    const toggleCreateUser = () => {
        setShowLogin(false);
        setShowCreateUser(true);
    }



    return (
        <main className="login-page">
            <LoginBox toggleLogin={toggleLogin} showLogin={showLogin} URL={URL} />
            <CreateUserBox toggleCreateUser={toggleCreateUser} showCreate={showCreateUser} URL={URL} />
        </main>
    )
}