


import '../../styles/LandingPage/LandingPageUPSModule.css'
import {useEffect, useRef, useState} from "react";



export const LandingPageUPSModule = ({title, subtitle, media, height, width, row, column, delay}) => {


    return (
        <section style={{
            gridRow: row,
            gridColumn: column,
            animationDelay: `${delay}s`
        }} className="landing-page-module">

            <div className="landing-page-text">
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>

            <video muted={true} loop={true} autoPlay={true}  src={media} className={"landing-page-video"} />
        </section>
    )
}