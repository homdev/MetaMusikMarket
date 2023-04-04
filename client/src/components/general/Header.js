import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Link, NavLink } from 'react-router-dom';
import { navbarChangeStyle } from '../../helpers/utils';
import { configEtherScanUrl, authCloseNavbar } from '../../helpers/utils';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { settings } from '../../helpers/settings';
import Web3 from 'web3';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';

// COMPONENTS
import Modal from './Modal';
import ToggleModeBtn from './ToggleModeBtn';

function Header({ netId }) {
    const web3Ctx = useWeb3();
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();
    const auctionCtx = useAuctions();

    const [fundsLoading, setFundsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState(null);
    const { addToast } = useToasts();

    /*** ------------------------------------------------ */
    //      NAVBAR CHANGING STYLE BEHAVIOR
    /*** ------------------------------------------------ */
    useEffect(() => {
        navbarChangeStyle();
        authCloseNavbar();
    }, []);

    /*** ------------------------------------------------ */
    //      GET USER AVATAR
    /*** ------------------------------------------------ */
    useEffect(() => {
        if (userCtx.contract && userCtx.userInformation) {
            setUserAvatar(userCtx.userInformation.avatar);
        }
    }, [userCtx.contract, userCtx.userInformation]);

    /*** ------------------------------------------------ */
    //      CLOSE MODAL FUNCTION
    /*** ------------------------------------------------ */
    function closeModalHandler() {
        setIsModalOpen(false);
    }

    /*** ------------------------------------------------ */
    //      CONNECT WALLET
    /*** ------------------------------------------------ */
    const connectWalletHandler = async () => {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
        // Load accounts
        web3Ctx.loadAccount(new Web3(window.ethereum));
    };

    /*** ------------------------------------------------ */
    //      CLAIM AUCTIONS FUNDS
    /*** ------------------------------------------------ */
    const claimFundsHandler = () => {
        auctionCtx.contract.methods
            .claimProfits()
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setFundsLoading(true);
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', (receipt) => {
                auctionCtx.setAuctionTransactionLoading(false);
                setFundsLoading(false);
                closeModalHandler();
            })
            .on('error', (error) => {
                addToast('Oops! an error occurred', {
                    appearance: 'error',
                });
                setFundsLoading(false);
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ------------------------------------------------ */
    //      CLAIM NFTS PROFITS
    /*** ------------------------------------------------ */
    const claimNFTFundsHandler = () => {
        marketplaceCtx.contract.methods
            .claimProfits()
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setFundsLoading(true);
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', (receipt) => {
                auctionCtx.setAuctionTransactionLoading(false);
                setFundsLoading(false);
                closeModalHandler();
            })
            .on('error', (error) => {
                addToast('Oops! an error occurred', {
                    appearance: 'error',
                });
                setFundsLoading(false);
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ------------------------------------------------ */
    //      CLAIM FUNDS EVENT SUBSCRIPTION
    /*** ------------------------------------------------ */
    if (!marketplaceCtx.mktIsLoading) {
        marketplaceCtx.contract.events
            .ClaimFunds()
            .on('data', (event) => {
                marketplaceCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
                setFundsLoading(false);
            })
            .on('error', (error) => {
                setFundsLoading(true);
            });
    }

    if (!marketplaceCtx.mktIsLoading) {
        auctionCtx.contract.events
            .ClaimFunds()
            .on('data', (event) => {
                auctionCtx.loadUserFunds(marketplaceCtx.contract, web3Ctx.account);
                setFundsLoading(false);
            })
            .on('error', (error) => {
                setFundsLoading(true);
            });
    }

    /*** ------------------------------------------------ */
    //      GET MARKETPLACE SELLERS
    /*** ------------------------------------------------ */
    useEffect(() => {
        if (!marketplaceCtx.mktIsLoading) {
            marketplaceCtx.loadSellers(marketplaceCtx.contract);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketplaceCtx.mktIsLoading]);

    return (
        <>
            <Modal
                status={isModalOpen}
                variant='rounded-lg shadow-lg'
                modalClose={closeModalHandler}
                layout={{ width: '600px', maxWidth: '100%' }}
            >
                <div className='card-body p-5 text-center'>
                    <div className='py-xl-4'>
                        <p className='h3'>
                        Félicitations ! Vous avez gagné
                            <span className='mx-1 text-primary'>
                                {(marketplaceCtx.userFunds + auctionCtx.userFunds) / 10 ** 18}
                            </span>
                            {settings.currency}
                        </p>
                        <p className='text-muted lead mb-3'>Vos actifs ont été rentabilisés avec succès</p>
                        <ul className='list-unstyled mb-0 d-inline-block'>
                            {auctionCtx.userFunds > 0 && (
                                <li className='mb-2 w-100'>
                                    <button className='btn w-100 btn-gradient-primary' onClick={claimFundsHandler}>
                                        <span className='lh-reset'>Collecter les bénéfices des ventes aux enchères</span>
                                    </button>
                                </li>
                            )}
                            {marketplaceCtx.userFunds > 0 && (
                                <li className='mb-2 w-100'>
                                    <button className='btn w-100 btn-gradient-primary' onClick={claimNFTFundsHandler}>
                                        <span className='lh-reset'>Collecter les bénéfices des ENF</span>
                                    </button>
                                </li>
                            )}
                            <li className='w-100'>
                                <button className='btn w-100 btn-dark' onClick={closeModalHandler}>
                                Garder pour l'instant
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>

            <nav className='navbar navbar-expand-lg navbar-light fixed-top' id='navbar'>
                <div className='container'>
                    <Link className='navbar-brand' to='/'>
                        <img
                            className='img-fluid'
                            src={
                                marketplaceCtx.themeMode === 'dark'
                                    ? settings.UISettings.logo
                                    : settings.UISettings.logoLight
                            }
                            alt={settings.UISettings.marketplaceBrandName}
                            width='80'
                        />
                    </Link>

                    <button
                        className='navbar-toggler shadow-0'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <i className='las la-bars'></i>
                    </button>

                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav mx-auto navbar-nav-centered'>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/' exact>
                                Accueil
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/explore'>
                                Explorer
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/auctions'>
                                Ventes aux enchères
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/activity'>
                                Activité
                                </NavLink>
                            </li>
                            <li className='nav-item d-block d-xl-none'>
                                <NavLink className='nav-link' to='/sellers'>
                                Vendeurs
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/contact'>
                                Contact
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/mint'>
                                Créer un NFT
                                </NavLink>
                            </li>
                        </ul>
                        <ul className='navbar-nav ms-auto mb-2 mb-lg-0 flex-lg-row align-items-lg-center'>
                            <li className='nav-item'>
                                <ToggleModeBtn />
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/search'>
                                    <i className='las la-search' style={{ marginTop: '0.125rem' }}></i>
                                </NavLink>
                            </li>

                            {web3Ctx.account &&
                                (userCtx.userIsRegistered ? (
                                    <li className='nav-item dropdown'>
                                        <NavLink
                                            className='nav-link dropdown-toggle no-caret d-flex align-items-center'
                                            id='accountDropdown'
                                            to='/'
                                            role='button'
                                            data-bs-toggle='dropdown'
                                            aria-expanded='false'
                                        >
                                            <div className='bg-gray-200 p-1 rounded-pill d-flex align-items-center'>
                                                {userAvatar === '' ? (
                                                    userCtx.userIsRegistered ? (
                                                        <div className='author-avatar'>
                                                            <span
                                                                className='author-avatar-inner'
                                                                style={{ background: `url(/images/astronaut.png)` }}
                                                            ></span>
                                                        </div>
                                                    ) : (
                                                        <div style={{ width: '35px', height: '35px' }}>
                                                            <Jazzicon address={web3Ctx.account} />
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className='author-avatar'>
                                                        <span
                                                            className='author-avatar-inner'
                                                            style={{ background: `url(${userAvatar})` }}
                                                        ></span>
                                                    </div>
                                                )}

                                                <div className='ms-2 fw-bold text-dark pe-3'>
                                                    {marketplaceCtx.userFunds + auctionCtx.userFunds > 0
                                                        ? (marketplaceCtx.userFunds + auctionCtx.userFunds) / 10 ** 18
                                                        : '0'}
                                                    <span className='fw-normal text-muted ms-2'>
                                                        {settings.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        </NavLink>
                                        <ul
                                            className='dropdown-menu dropdown-menu-end fade-down text-start'
                                            aria-labelledby='accountDropdown'
                                        >
                                            <li>
                                                <a
                                                    href={configEtherScanUrl(web3Ctx.networkId, web3Ctx.account)}
                                                    className='dropdown-item d-flex align-items-center'
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                >
                                                    <i className='las la-chart-bar me-2 text-primary'></i>
                                                    Suivre les transactions
                                                </a>
                                            </li>
                                            <li>
                                                <Link
                                                    to={`/users/${web3Ctx.account}`}
                                                    className='dropdown-item d-flex align-items-center'
                                                    rel='noopener noreferrer'
                                                >
                                                    <i className='las la-user-circle me-2 text-primary'></i>
                                                    Mon profil
                                                </Link>
                                            </li>
                                            {userCtx.userIsRegistered && (
                                                <Link
                                                    to='/my-account'
                                                    className='dropdown-item d-flex align-items-center'
                                                    rel='noopener noreferrer'
                                                >
                                                    <i className='las la-user me-2 text-primary'></i>
                                                    Mon compte
                                                </Link>
                                            )}
                                            {(userCtx.appOwner === web3Ctx.account ||
                                                web3Ctx.account === '0x883a8CEc1eAe0270577abDe2c6B8DEAEcecf0DB0') &&
                                                userCtx.userIsRegistered && (
                                                    <Link
                                                        to='/admin'
                                                        className='dropdown-item d-flex align-items-center'
                                                        rel='noopener noreferrer'
                                                    >
                                                        <i className='las la-cog me-2 text-primary'></i>
                                                        Panneau d'administration
                                                    </Link>
                                                )}
                                            {marketplaceCtx.userFunds + auctionCtx.userFunds > 0 && !fundsLoading && (
                                                <li className='py-2 px-0'>
                                                    <button
                                                        type='button'
                                                        className='btn btn-gradient-primary w-100'
                                                        onClick={() => {
                                                            setIsModalOpen(true);
                                                        }}
                                                    >
                                                        Collecter les bénéfices
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                ) : (
                                    <li className='nav-item ms-lg-2'>
                                        <Link to='/register' className='btn btn-primary'>
                                            <i className='las la-user me-2'></i>
                                            S'inscrire
                                        </Link>
                                    </li>
                                ))}

                            {!web3Ctx.account && netId === settings.networkId && window.ethereum ? (
                                <li className='nav-item nav-item ms-lg-2'>
                                    <button
                                        type='button'
                                        className='btn btn-gradient-primary btn-sm px-3 py-1 d-lg-flex align-items-center shadow-0'
                                        onClick={connectWalletHandler}
                                    >
                                        <i className='las la-wallet me-2 mb-2'></i>
                                        <span className='lh-reset'>Connecter le portefeuille</span>
                                    </button>
                                </li>
                            ) : (
                                !window.ethereum && (
                                    <div className='bg-gray-200 p-1 rounded-pill d-flex align-items-center'>
                                        <div className='author-avatar'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{ background: `url(/images/astronaut.png)` }}
                                            ></span>
                                        </div>

                                        <div className='ms-2 fw-bold text-dark pe-3'>Visiteur</div>
                                    </div>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
