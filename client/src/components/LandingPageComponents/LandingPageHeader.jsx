


import '../../styles/LandingPage/LandingPageHeader.css'
import {useEffect, useRef, useState} from "react";
import {YapperLogo} from "../YapperLogo.jsx";
import {LandingPageNav} from "./LandingPageNav.jsx";


/**
 * This component is just the header of the landing page
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const LandingPageHeader = () => {


    const logoRef = useRef(null);  // Reference where to div that decides if user has scrolled past
    const [hasScrolledPast, setHasScrolledPast] = useState(false); // Set state of scroll


    // This hook is used for listening to the scrolls, watching if the logoRef has been intersected or scrolled past and automatically updating the state
    useEffect(() => {
        // Create a new IntersectionObserver to monitor visibility of an element
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHasScrolledPast(!entry.isIntersecting);
            },
            {
                root: null,
                threshold: 1,
            }
        );

        const currentRef = logoRef.current;

        // Start observing if the ref exists
        if (currentRef) observer.observe(currentRef);

        // Cleanup: stop observing when the component unmounts or ref changes
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);


    return (
        <>
            {/* If the user has scrolled past, show the sticky header */}
            {hasScrolledPast && (
                <header className={'landing-page-header sticky'}>
                    <LandingPageNav
                        hasScrolledPast={hasScrolledPast}
                    />
                    <YapperLogo
                        fixedHeight={'3rem'}
                        subTitleSize="clamp(3rem, 4vw, 5rem)"
                        imageWidth="clamp(60px, 60px, 60px)"
                        imageHeight="clamp(60px, 60px, 60px)"
                    />
                </header>
            )}
            {/* If the user has not scrolled past, show the normal header */}
            <header className={`landing-page-header ${hasScrolledPast ? 'hide-header' : ''}  `}>
                    <LandingPageNav/>
                    <YapperLogo
                        titleSize="clamp(5rem, 6vw, 8rem)"
                        subTitleSize="clamp(1.2rem, 2vw, 2.4rem)"
                        imageWidth="clamp(80px, 6vw, 120px)"
                        imageHeight="clamp(80px, 6vw, 120px)"
                        subTitle={'Stop talking, start yappin!'}
                        typeWriterAnimation={true}
                    />
                </header>
            <div ref={logoRef} style={{ position: 'absolute', top: '250px' }} />
        </>
    )

}