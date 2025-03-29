

import '../styles/Dashboard/Dashboard.css'
import {DashboardHeader} from "../components/DashboardComponents/DashboardHeader.jsx";
import {DashboardMain} from "../components/DashboardComponents/DashboardMain.jsx";

export const Dashboard = () => {


    return (

        <div className={'dashboard-wrapper'}>

            <DashboardHeader/>
            <DashboardMain/>

        </div>
    )

}