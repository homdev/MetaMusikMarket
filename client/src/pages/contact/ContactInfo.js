import React from 'react';

function ContactInfo(props) {
    return (
        <div className={props.gridWidth}>
            <h5 className='h2 mb-5 text-center' data-aos='fade-up' data-aos-delay='100'>
                We are here to help you. Send us an email, join us on Slack or visit our office.
            </h5>
            <div className='row gy-3'>
                <div className='col-lg-4 d-flex' data-aos='fade-up' data-aos-delay='200'>
                    <div className='contact-icon bd-3 border-primary text-primary flex-shrink-0'>
                        <i className='las la-globe'></i>
                    </div>
                    <div className='ms-3'>
                        <h6>Company Address</h6>
                        <p className='text-sm text-muted mb-0'>2600 S Hoover St, Los Angeles, California(CA), 90007</p>
                    </div>
                </div>
                <div className='col-lg-4 d-flex' data-aos='fade-up' data-aos-delay='300'>
                    <div className='contact-icon bd-3 border-primary text-primary flex-shrink-0'>
                        <i className='las la-phone'></i>
                    </div>
                    <div className='ms-3'>
                        <h6>Hot lines</h6>
                        <ul className='list-unstyled'>
                            <li>
                                <a
                                    className='text-decoration-none text-sm text-muted mb-1'
                                    rel='noreferrer'
                                    href='tel:2137470819'
                                >
                                    (213) 747-0819
                                </a>
                            </li>
                            <li>
                                <a
                                    className='text-decoration-none text-sm text-muted mb-0'
                                    rel='noreferrer'
                                    href='tel:2137470820'
                                >
                                    (213) 747-0820
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-lg-4 d-flex' data-aos='fade-up' data-aos-delay='400'>
                    <div className='contact-icon bd-3 border-primary text-primary flex-shrink-0'>
                        <i className='las la-envelope'></i>
                    </div>
                    <div className='ms-3'>
                        <h6>Email address</h6>
                        <ul className='list-unstyled mb-0'>
                            <li>
                                <a
                                    className='text-decoration-none text-sm text-muted mb-1'
                                    rel='noreferrer'
                                    href='mailto:contact@metarealfights.com'
                                >
                                    contact@metarealfights.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactInfo;
