

import '../styles/Dashboard/Dashboard.css'
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";
import {useState} from "react";

export const Dashboard = ({}) => {


    return (
        <div className={'dashboard-wrapper'}>
            <DashboardMain/>
        </div>
    )
}