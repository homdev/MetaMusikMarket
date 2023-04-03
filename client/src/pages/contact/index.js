import React, { useEffect } from 'react';
import { settings } from '../../helpers/settings';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

function ContactPage() {
    /*** ---------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ---------------------------------------- */
    useEffect(() => {
        document.title = `Contact Us | ${settings.UISettings.marketplaceBrandName}`;
    });

    return (
        <>
            <PageBanner heading={'Contact Us'} />
            <section className='py-5'>
                <div className='container py-5'>
                    <div className='row g-5'>
                        <ContactInfo gridWidth='col-lg-8 mx-auto' />
                        <ContactForm gridWidth='col-lg-8 mx-auto' />
                        <div className='col-12 text-center'>
                            <h2 className='h3 mb-1'>We are social</h2>
                            <p className='small text-muted mb-3'>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Debitis repudiandae cumque
                                architecto.
                            </p>
                            <ul className='list-inline mb-0'>
                                <li className='list-inline-item'>
                                    <a className='social-link bg-hover-primary' rel='noreferrer' href='/'>
                                        <i className='lab la-facebook-f'></i>
                                    </a>
                                </li>
                                <li className='list-inline-item'>
                                    <a className='social-link bg-hover-primary' rel='noreferrer' href='/'>
                                        <i className='lab la-pinterest'></i>
                                    </a>
                                </li>
                                <li className='list-inline-item'>
                                    <a className='social-link bg-hover-primary' rel='noreferrer' href='/'>
                                        <i className='lab la-twitter'></i>
                                    </a>
                                </li>
                                <li className='list-inline-item'>
                                    <a className='social-link bg-hover-primary' rel='noreferrer' href='/'>
                                        <i className='las la-link'></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ContactPage;
