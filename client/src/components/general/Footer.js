import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '@formspree/react';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

function Footer() {
    const marketplaceCtx = useMarketplace();
    const [state, handleSubmit] = useForm('xlezgplp');

    return (
        <footer className='footer bg-map bg-light mt-auto'>
            <div className='container py-5 z-index-20'>
                <div className='row gy-4 pt-4'>
                    <div className='col-lg-3 col-md-6 mb-lg-0'>
                        <img
                            src={
                                marketplaceCtx.themeMode === 'dark'
                                    ? settings.UISettings.logo
                                    : settings.UISettings.logoLight
                            }
                            alt='metamusik'
                            className='mb-3'
                            width='140'
                        />
                        <p className='h3 fw-normal'></p>
                        <a
                            href='https://apple.com'
                            className='btn btn-gradient-dark btn-sm pt-2'
                            target='_black'
                            rel='noopener noreferrer'
                        >
                            <span className='lh-reset px-3 pt-2'>Télécharger le MRF</span>
                        </a>
                    </div>
                    <div className='col-lg-3 col-md-6 mb-lg-0 pt-2'>
                        <h5 className='mb-4'>metamusik</h5>
                        <ul className='list-unstyled text-muted mb-0'>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/'>
                                Accueil
                                </Link>
                            </li>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/mint'>
                                Créer un NFT
                                </Link>
                            </li>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/activity'>
                                Activité
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-lg-3 col-md-6 mb-lg-0 pt-2'>
                        <h5 className='mb-4'>Communauté</h5>
                        <ul className='list-unstyled text-muted mb-0'>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/contact'>
                                Contact
                                </Link>
                            </li>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/faq'>
                                    FAQ
                                </Link>
                            </li>
                            <li className='mb-2'>
                                <Link className='text-reset' to='/sellers'>
                                Vendeurs
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-lg-3 col-md-6 pt-2'>
                        <h5 className='mb-4'>Newsletter</h5>
                        <p className='text-sm text-muted'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui sint facilis.
                        </p>
                        <form onSubmit={handleSubmit}>
                            <div className='input-group border border-2 border-gray-400 rounded-pill'>
                                <input
                                    className='form-control border-0 bg-none shadow-0 ps-4'
                                    type='email'
                                    name='email'
                                    autoComplete='off'
                                    placeholder='Saisissez votre adresse électronique...'
                                />
                                <button
                                    className='btn btn-primary rounded-circle btn-sm shadow-0 m-2 icon-md'
                                    type='submit'
                                >
                                    <i className='las la-paper-plane'></i>
                                </button>
                            </div>
                        </form>
                        {state.succeeded ? (
                            <p className='bg-primary text-white mt-1 px-3 py-1 rounded-sm'>Merci de votre attention !</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className='container'>
                <div className='border border-gray-200 rounded-pill'></div>
            </div>

            <div className='container py-4 z-index-20'>
                <div className='row text-center'>
                    <p className='text-muted text-sm mb-0'>
                        © {new Date().getFullYear()} Tous droits réservés. Fabriqué par{' '}
                        <a
                            className='text-primary'
                            href='https:// .com/'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            BlockConceptor
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
