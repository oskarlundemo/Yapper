import {LoginBox} from "../components/LoginPageComponents/LoginBox.jsx";
import {YapperLogo} from "../components/YapperLogo.jsx";
import {Link} from "react-router-dom";
import '../styles/LoginPage/LoginPage.css'


export const Login = ({URL}) => {

    return (
            <main className="login-page">
                <YapperLogo
                    fixedHeight={'3rem'}
                    subTitleSize="clamp(3rem, 4vw, 5rem)"
                    imageWidth="clamp(60px, 60px, 60px)"
                    imageHeight="clamp(60px, 60px, 60px)"
                />
                <LoginBox URL={URL} />


                <Link to='/'>
                    <svg className={'home-button'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>
                </Link>
            </main>
    )
}