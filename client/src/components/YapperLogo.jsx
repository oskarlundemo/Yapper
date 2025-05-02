
export const YapperLogo = ({titleSize = 0, imageWitdh = 0, typeWriterAnimation = false, imageHeight = 0, subTitle = ''}) => {

    return (
            <div className="yapper-logo">
                <div className="yapper-logo__title">
                    <h1 style={{ fontSize: `${titleSize}rem` }} className="landing-page-title">Yapper</h1>
                    <img style={{height: `${imageHeight}px`, width: `${imageWitdh}px`}} src={'../transparentLogo.png'} className="landing-page-logo" alt="logo" />
                </div>

                {subTitle && (
                    <div className="yapper-logo__subtitle">
                        <h2 className={typeWriterAnimation ? 'typewriter' : ''}>
                            {subTitle}
                        </h2>
                    </div>
                )}
            </div>
    )
}