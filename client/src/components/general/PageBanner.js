import React from 'react';
import { Link } from 'react-router-dom';

function PageBanner({ heading, bannerBg }) {
    return (
        <section className={`page-banner py-5 position-relative ${bannerBg}`}>
            <div className='container py-5 mt-5 z-index-20'>
                <h1 className='text-center' data-aos='fade-right' data-aos-delay='100'>
                    {heading}
                </h1>

                <nav aria-label='breadcrumb' data-aos='fade-right' data-aos-delay='200'>
                    <ol className='breadcrumb justify-content-center'>
                        <li className='breadcrumb-item'>
                            <Link className='text-decoration-none d-flex align-items-center' to='/'>
                                {' '}
                                <i className='las la-home la-sm me-1'></i>Accueil
                            </Link>
                        </li>
                        <li className='breadcrumb-item active' aria-current='page'>
                            {heading}
                        </li>
                    </ol>
                </nav>
            </div>
        </section>
    );
}

export default PageBanner;
