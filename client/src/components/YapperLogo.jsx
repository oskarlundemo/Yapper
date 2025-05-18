/**
 * This component is used everytime the app logo is
 * shown
 *
 *
 * @param titleSize
 * @param margin
 * @param fixedHeight if you dont want clamp
 * @param subTitleSize
 * @param imageWidth
 * @param typeWriterAnimation animation in css or not
 * @param imageHeight
 * @param subTitle
 * @returns {JSX.Element}
 * @constructor
 */



export const YapperLogo = ({titleSize = '', margin = 0, fixedHeight = '',
                               subTitleSize = '', imageWidth = 0,
                               typeWriterAnimation = false, imageHeight = 0,
                               subTitle = ''}) => {

    return (
            <div className="yapper-logo">
                <div className="yapper-logo__title">
                    <h1 style={{
                        fontSize: titleSize ? titleSize : fixedHeight,
                        margin: margin ? margin : '0rem',
                    }} className="landing-page-title">Yapper</h1>
                    <img
                        style={{

                            height: imageHeight, width: imageWidth
                    }}
                        src={'../transparentLogo.png'} className="landing-page-logo" alt="logo" />
                </div>

                {subTitle && (
                    <div className="yapper-logo__subtitle">
                        <h2  style={{
                            fontSize: subTitleSize
                        }}
                             className={typeWriterAnimation ? 'typewriter' : ''}>
                            {subTitle}
                        </h2>
                    </div>
                )}
            </div>
    )
}