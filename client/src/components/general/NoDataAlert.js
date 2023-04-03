import React from 'react';

function NoDataAlert({ heading, subheading, customClass, aos, aosDelay }) {
    return (
        <div
            className={`text-muted d-flex p-4 bg-light bd-3 border-gray-200 rounded-xl ${customClass && customClass}`}
            data-aos={aos}
            data-aos-delay={aosDelay}
        >
            <i className='las la-info-circle mt-1 text-primary' style={{ fontSize: '2rem' }}></i>
            <div className='ms-3'>
                <h6 className='h5 text-dark lh-3 mb-0'>{heading}</h6>
                <p className='fw-normal text-muted mt-2 text-sm mb-0'>{subheading}</p>
            </div>
        </div>
    );
}

export default NoDataAlert;
