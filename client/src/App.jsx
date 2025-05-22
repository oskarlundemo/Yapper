import {Routes, Route} from 'react-router-dom';
import './App.css'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {Dashboard} from "./pages/Dashboard.jsx";
import {LandingPage} from "./pages/LandingPage.jsx";
import {Login} from "./pages/Login.jsx";
import {SignUp} from "./pages/SignUp.jsx";
function App() {

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL
        : "/api";


  return (
    <div className="App">
        <Routes>

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard API_URL={API_BASE_URL} />
                    </ProtectedRoute>
                }/>

            <Route
                path="/login"
                element={
                <Login URL={API_BASE_URL}/>
                }
            />

            <Route
                path="/signup"
                element={
                <SignUp URL={API_BASE_URL}/>
                }
            />

            <Route
                path="*"
                element={
                <LandingPage API_URL={API_BASE_URL} />
                 }
            />

        </Routes>
    </div>
  )
}

export default App
