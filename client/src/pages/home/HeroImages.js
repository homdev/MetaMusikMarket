import React from 'react';
import { settings } from '../../helpers/settings';

function HeroImages() {
    return (
        <div className='h-100' style={{ minHeight: '300px', transform: 'skew(-10deg)' }}>
            <div className='px-5 px-lg-4 d-flex align-items-stretch h-100'>
                {settings.UISettings.heroImages.map((img, i) => {
                    return (
                        <div
                            key={i}
                            className='w-100 m-2 rounded-1 h-100 hero-slice'
                            data-aos='fade-left'
                            data-aos-delay={(i + 1) * 100}
                            style={{ background: `url(${img})` }}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
}

export default HeroImages;
