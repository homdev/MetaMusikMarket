import React, { useEffect, useState } from 'react';
import { settings } from '../../helpers/settings';
import { supportQuestions, licenseQuestions, purchaseQuestions, techQuestions } from './FAQItems';

// COMPONENTS
import PgaeBanner from '../../components/general/PageBanner';

function FAQsPage() {
    /*** --------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** --------------------------------------- */
    useEffect(() => {
        document.title = `FAQ | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    const [tab, setTab] = useState('tech-questions');

    return (
        <>
            <PgaeBanner heading='Foire aux questions' />

            <section className='py-5'>
                <div className='container py-5'>
                    <div className='row g-5'>
                        <div className='col-lg-8 order-2 order-lg-1'>
                            {tab === 'tech-questions' && (
                                <>
                                    <h2 className='mb-4'>Questions techniques</h2>
                                    <div className='accordion' id='accordionExample'>
                                        {techQuestions.map((el, index) => {
                                            return (
                                                <div className='accordion-item mb-3' key={index}>
                                                    <h2 className='accordion-header' id={`heading${index + 1}`}>
                                                        <button
                                                            className={`accordion-button shadow-0 fw-bold ${
                                                                index === 0 ? '' : 'collapsed'
                                                            }`}
                                                            type='button'
                                                            data-bs-toggle='collapse'
                                                            data-bs-target={`#collapse${index + 1}`}
                                                            aria-expanded={index === 0 ? true : false}
                                                            aria-controls={`collapse${index + 1}`}
                                                        >
                                                            {el.question}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${index + 1}`}
                                                        className={`accordion-collapse collapse ${
                                                            index === 0 ? 'show' : ''
                                                        }`}
                                                        aria-labelledby={`heading${index + 1}`}
                                                        data-bs-parent='#accordionExample'
                                                    >
                                                        <div className='accordion-body'>{el.answer}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {tab === 'purchase' && (
                                <>
                                    <h2 className='mb-4'>Purchase</h2>
                                    <div className='accordion' id='accordionExample'>
                                        {purchaseQuestions.map((el, index) => {
                                            return (
                                                <div className='accordion-item mb-3' key={index}>
                                                    <h2 className='accordion-header' id={`heading${index + 1}`}>
                                                        <button
                                                            className={`accordion-button shadow-0 fw-bold ${
                                                                index === 0 ? '' : 'collapsed'
                                                            }`}
                                                            type='button'
                                                            data-bs-toggle='collapse'
                                                            data-bs-target={`#collapse${index + 1}`}
                                                            aria-expanded={index === 0 ? true : false}
                                                            aria-controls={`collapse${index + 1}`}
                                                        >
                                                            {el.question}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${index + 1}`}
                                                        className={`accordion-collapse collapse ${
                                                            index === 0 ? 'show' : ''
                                                        }`}
                                                        aria-labelledby={`heading${index + 1}`}
                                                        data-bs-parent='#accordionExample'
                                                    >
                                                        <div className='accordion-body'>{el.answer}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {tab === 'license' && (
                                <>
                                    <h2 className='mb-4'>License &amp; Pricing</h2>
                                    <div className='accordion' id='accordionExample'>
                                        {licenseQuestions.map((el, index) => {
                                            return (
                                                <div className='accordion-item mb-3' key={index}>
                                                    <h2 className='accordion-header' id={`heading${index + 1}`}>
                                                        <button
                                                            className={`accordion-button shadow-0 fw-bold ${
                                                                index === 0 ? '' : 'collapsed'
                                                            }`}
                                                            type='button'
                                                            data-bs-toggle='collapse'
                                                            data-bs-target={`#collapse${index + 1}`}
                                                            aria-expanded={index === 0 ? true : false}
                                                            aria-controls={`collapse${index + 1}`}
                                                        >
                                                            {el.question}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${index + 1}`}
                                                        className={`accordion-collapse collapse ${
                                                            index === 0 ? 'show' : ''
                                                        }`}
                                                        aria-labelledby={`heading${index + 1}`}
                                                        data-bs-parent='#accordionExample'
                                                    >
                                                        <div className='accordion-body'>{el.answer}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {tab === 'support' && (
                                <>
                                    <h2 className='mb-4'>Customer Support</h2>
                                    <div className='accordion' id='accordionExample'>
                                        {supportQuestions.map((el, index) => {
                                            return (
                                                <div className='accordion-item mb-3' key={index}>
                                                    <h2 className='accordion-header' id={`heading${index + 1}`}>
                                                        <button
                                                            className={`accordion-button shadow-0 fw-bold ${
                                                                index === 0 ? '' : 'collapsed'
                                                            }`}
                                                            type='button'
                                                            data-bs-toggle='collapse'
                                                            data-bs-target={`#collapse${index + 1}`}
                                                            aria-expanded={index === 0 ? true : false}
                                                            aria-controls={`collapse${index + 1}`}
                                                        >
                                                            {el.question}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse${index + 1}`}
                                                        className={`accordion-collapse collapse ${
                                                            index === 0 ? 'show' : ''
                                                        }`}
                                                        aria-labelledby={`heading${index + 1}`}
                                                        data-bs-parent='#accordionExample'
                                                    >
                                                        <div className='accordion-body'>{el.answer}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className='col-lg-4 order-1 order-lg-2'>
                            <h2 className='mb-4'>Navigation rapide</h2>

                            <div className='card bg-light shadow-0'>
                                <div className='card-body p-4 p-lg-5'>
                                    <ul className='p-0 m-0 list-unstyled'>
                                        <li className='mb-3'>
                                            <button
                                                className={`btn btn-link p-0 fw-bold text-decoration-none shadow-0 ${
                                                    tab === 'tech-questions' ? 'text-primary' : 'text-dark'
                                                }`}
                                                onClick={() => setTab('tech-questions')}
                                            >
                                                Questions techniques
                                            </button>
                                        </li>
                                        <li className='mb-3'>
                                            <button
                                                className={`btn btn-link p-0 fw-bold text-decoration-none shadow-0 ${
                                                    tab === 'purchase' ? 'text-primary' : 'text-dark'
                                                }`}
                                                onClick={() => setTab('purchase')}
                                            >
                                                Achat
                                            </button>
                                        </li>
                                        <li className='mb-3'>
                                            <button
                                                className={`btn btn-link p-0 fw-bold text-decoration-none shadow-0 ${
                                                    tab === 'license' ? 'text-primary' : 'text-dark'
                                                }`}
                                                onClick={() => setTab('license')}
                                            >
                                                License &amp; Tarification
                                            </button>
                                        </li>
                                        <li className='mb-3'>
                                            <button
                                                className={`btn btn-link p-0 fw-bold text-decoration-none shadow-0 ${
                                                    tab === 'support' ? 'text-primary' : 'text-dark'
                                                }`}
                                                onClick={() => setTab('support')}
                                            >
                                                Soutien à la clientèle
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FAQsPage;
