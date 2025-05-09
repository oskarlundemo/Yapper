
export const YapperLogo = ({titleSize = '', fixedHeight = '', fixedImage = '',
                               subTitleSize = '', imageWidth = 0,
                               typeWriterAnimation = false, imageHeight = 0,
                               subTitle = ''}) => {

    return (
            <div className="yapper-logo">
                <div className="yapper-logo__title">
                    <h1 style={{
                        fontSize: titleSize ? titleSize : fixedHeight,
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