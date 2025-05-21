import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";

import './index.css'
import App from './App.jsx'
import {AuthProvider} from "./context/AuthContext.jsx";
import {DynamicContextProvider} from "./context/DynamicStyles.jsx";
import {DashboardContextProvider} from "./context/DashboardContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <DynamicContextProvider>
                <DashboardContextProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </DashboardContextProvider>
            </DynamicContextProvider>
        </AuthProvider>
    </StrictMode>
);
