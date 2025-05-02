


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
            <header className={`landing-page-header ${hasScrolledPast ? 'sticky' : ''}`}>

                {hasScrolledPast ? (
                    <>
                        <LandingPageNav
                            sticky={hasScrolledPast}
                        />
                        <YapperLogo
                            titleSize={4}
                            imageWitdh={50}
                            imageHeight={50}
                        />
                    </>
                ) : (
                    <>
                        <LandingPageNav />

                        <YapperLogo
                            titleSize={8}
                            imageWitdh={150}
                            imageHeight={150}
                            subTitle={'Stop talking, start yappin!'}
                            typeWriterAnimation={true}
                            />
                    </>
                )}
            </header>

            <div ref={logoRef} style={{ position: 'absolute', top: '250px' }} />

        </>
    )

}