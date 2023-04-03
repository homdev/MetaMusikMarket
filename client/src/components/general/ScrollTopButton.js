import React, { useEffect } from 'react';

function ScrollTopButton() {
    /*** =============================================== */
    //      SCROLL TOP BUTTON SHOW & HIDE & CLICKING
    /*** =============================================== */
    useEffect(() => {
        const scrollTopBtn = document.querySelector('.scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', function () {
                window.scrollTo(0, 0);
            });

            window.addEventListener('scroll', function () {
                if (window.pageYOffset >= 1000) {
                    scrollTopBtn.classList.add('is-visible');
                } else {
                    scrollTopBtn.classList.remove('is-visible');
                }
            });
        }
    });

    return (
        <div className='scroll-top-btn text-center bg-primary text-white d-flex align-items-center shadow'>
            <i className='las la-arrow-up'></i>
        </div>
    );
}

export default ScrollTopButton;
