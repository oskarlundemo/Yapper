


import '../../styles/LandingPage/LandingPageHeader.css'
import {useEffect, useRef, useState} from "react";
import {YapperLogo} from "../YapperLogo.jsx";
import {LandingPageNav} from "./LandingPageNav.jsx";


export const LandingPageHeader = () => {


    const logoRef = useRef(null);
    const [hasScrolledPast, setHasScrolledPast] = useState(false);

    useEffect(() => {
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
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);


    return (
        <>
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