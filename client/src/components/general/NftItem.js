import React, { useRef, createRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import web3 from '../../connect-web3/web3';
import Web3 from 'web3';
import { formatDate, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useAnalytics from '../../hooks/useAnalytics';

// COMPOENTNS
import NftCategory from './NftCategory';
import Modal from './Modal';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

const melodyStyle = {
    fontSize: '5rem',
    color: '#fff',
    position: 'absolute',
    top: '4rem',
    left: '50%',
    transform: 'translateX(-50%)',
};

function NftItem({
    img,
    title,
    owner,
    price,
    hasOffer,
    category,
    dateCreated,
    id,
    noAnimation,
    unlockable,
    royalties,
    type,
}) {
    const web3Ctx = useWeb3();
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formattedPrice, setFormattedPrice] = useState(null);
    const [saleType, setSaleType] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [nftImage, setNftImage] = useState('');
    const [endDate, setEndDate] = useState(new Date().getTime());
    const [ownerName, setOwnerName] = useState('Loading...');
    const [ownerAvatar, setOwnerAvatar] = useState('');
    const [networkId, setNetworkId] = useState(0);
    const { addToast } = useToasts();

    useEffect(() => {
        if (price) {
            setFormattedPrice(Number(web3.utils.fromWei(price.toString(), 'ether')).toFixed(2));
        }
    }, [price]);

    /*** -------------------------------------------- */
    //      GET ACTIVE NETWORK ID
    /*** -------------------------------------------- */
    useEffect(() => {
        async function getNetworkId() {
            if (window.ethereum) {
                const networkId = await web3Ctx.loadNetworkId(new Web3(window.ethereum));
                setNetworkId(networkId);
            }
        }

        getNetworkId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*** -------------------------------------------- */
    //      FETCHING NFT MEDIA FROM IPFS
    /*** -------------------------------------------- */
    useEffect(() => {
        async function getNftImage() {
            try {
                const response =
                    img && img !== '' && (await fetch(`https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${img}`));
                if (response.ok) {
                    const metadata = await response.json();
                    setNftImage(metadata.properties.image.description);
                }
            } catch (error) {
                return;
            }
        }

        getNftImage();
    }, [img]);

    /*** -------------------------------------------- */
    //      GET OWNER NAME & AVATAR
    /*** -------------------------------------------- */
    useEffect(() => {
        if (
            userCtx.contract &&
            userCtx.usersList &&
            userCtx.usersList.length > 0 &&
            collectionCtx.collection &&
            collectionCtx.collection.length > 0 &&
            owner
        ) {
            if (owner === auctionCtx.contract.options.address || owner === marketplaceCtx.contract.options.address) {
                setOwnerAvatar('/images/mkt-avatar.png');
                setOwnerName('Marketplace');
            } else {
                const nftOwnerName = userCtx.usersList.filter((user) => user.account === owner)[0].fullName;
                const nftOwnerAvatar = userCtx.usersList.filter((user) => user.account === owner)[0].avatar;
                setOwnerAvatar(nftOwnerAvatar);
                setOwnerName(nftOwnerName);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, userCtx.contract, collectionCtx.collection, owner]);

    /*** -------------------------------------------- */
    //      CONNECT WALLET
    /*** -------------------------------------------- */
    const connectWalletHandler = async () => {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
        // Load accounts
        web3Ctx.loadAccount(web3);
    };

    /*** -------------------------------------------- */
    //      DECLARE PRICE REFERENCE
    /*** -------------------------------------------- */
    const priceRefs = useRef([]);
    if (priceRefs.current.length !== collectionCtx.collection.length) {
        priceRefs.current = Array(collectionCtx.collection.length)
            .fill()
            .map((_, i) => priceRefs.current[i] || createRef());
    }

    /*** -------------------------------------------- */
    //      CREATE SALE FUNCTION
    /*** -------------------------------------------- */
    const makeOfferHandler = (event, price) => {
        event.preventDefault();
        const enteredPrice = web3.utils.toWei(price.toString(), 'ether');

        collectionCtx.contract.methods
            .approve(marketplaceCtx.contract.options.address, id)
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setIsModalOpen(false);
            })
            .once('sending', () => {
                collectionCtx.setNftTransactionLoading(true);
                setIsModalOpen(false);
            })
            .once('error', (e) => {
                collectionCtx.setNftTransactionLoading(false);
                setIsModalOpen(false);
            })
            .on('receipt', (receipt) => {
                marketplaceCtx.contract.methods
                    .addPrice(id, enteredPrice)
                    .send({ from: web3Ctx.account })
                    .once('sending', () => {
                        collectionCtx.setNftTransactionLoading(true);
                    })
                    .on('receipt', () => {
                        collectionCtx.setNftTransactionLoading(false);
                        setIsModalOpen(false);
                        analyticsCtx.getNftHistory(analyticsCtx.contract, id);
                        analyticsCtx.loadTransactions(analyticsCtx.contract);
                        userCtx.loadActivity(userCtx.contract);
                    })
                    .on('error', (error) => {
                        collectionCtx.setNftTransactionLoading(false);
                        setIsModalOpen(false);
                        addToast('Oops! an error occured', {
                            appearance: 'error',
                        });
                    });
            });
    };

    /*** -------------------------------------------- */
    //      BUY NFT FUNCTION
    /*** -------------------------------------------- */
    const buyHandler = () => {
        marketplaceCtx.contract.methods
            .buyNFT(id)
            .send({ from: web3Ctx.account, value: price })
            .once('sending', () => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('receipt', () => {
                collectionCtx.setNftTransactionLoading(false);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
                collectionCtx.setNftTransactionLoading(false);
            });
    };

    /*** -------------------------------------------- */
    //      CANCEL SALE FUNCTION
    /*** -------------------------------------------- */
    const cancelHandler = () => {
        marketplaceCtx.contract.methods
            .cancelSale(id)
            .send({ from: web3Ctx.account })
            .once('sending', () => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('receipt', () => {
                collectionCtx.setNftTransactionLoading(false);
                analyticsCtx.getNftHistory(analyticsCtx.contract, id);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                collectionCtx.setNftTransactionLoading(false);
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
            });
    };

    /*** -------------------------------------------- */
    //      MAKE AUCTION FUNCTION
    /*** -------------------------------------------- */
    const makeAuctionHandler = (event, endDate, id) => {
        event.preventDefault();

        if (new Date(endDate).getTime() > new Date().getTime()) {
            collectionCtx.contract.methods
                .approve(auctionCtx.contract.options.address, id)
                .send({ from: web3Ctx.account })
                .on('transactionHash', (hash) => {
                    setIsModalOpen(false);
                })
                .once('sending', () => {
                    collectionCtx.setNftTransactionLoading(true);
                    setIsModalOpen(false);
                })
                .once('error', (e) => {
                    collectionCtx.setNftTransactionLoading(false);
                    setIsModalOpen(false);
                })
                .on('receipt', (receipt) => {
                    auctionCtx.contract.methods
                        .createAuction(parseInt(id), new Date(endDate).getTime() + 400000)
                        .send({ from: web3Ctx.account })
                        .once('sending', () => {
                            auctionCtx.setAuctionTransactionLoading(true);
                        })
                        .on('receipt', () => {
                            auctionCtx.setAuctionTransactionLoading(false);
                            setIsModalOpen(false);
                            setSaleType('');
                            analyticsCtx.loadTransactions(analyticsCtx.contract);
                            userCtx.loadActivity(userCtx.contract);
                        })
                        .on('error', (error) => {
                            auctionCtx.setAuctionTransactionLoading(false);
                            setIsModalOpen(false);
                            setSaleType('');
                            addToast('Oops! an error occured', {
                                appearance: 'error',
                            });
                        });
                    auctionCtx.setAuctionTransactionLoading(false);
                    collectionCtx.setNftTransactionLoading(false);
                    setIsModalOpen(false);
                    analyticsCtx.getNftHistory(analyticsCtx.contract, id);
                    analyticsCtx.loadTransactions(analyticsCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                });
        } else {
            addToast('End Date Cannot be in the past', {
                appearance: 'error',
            });
        }
    };

    /*** -------------------------------------------- */
    //      CLOSE MODAL FUNCTION
    /*** -------------------------------------------- */
    function closeModalHandler() {
        setIsModalOpen(false);
        setSaleType('');
    }

    return (
        <>
            <div
                className={`card rounded card-hover-image position-relative ${category}`}
                data-aos={`${noAnimation ? '' : 'fade-up'}`}
                data-aos-once='true'
                data-aos-delay={(Number(id) + 1) * 100}
            >
                <div className='card-body p-3 position-relative'>
                    <div className='position-relative mb-4 shadow'>
                        <div className={`card-img-holder rounded overflow-hidden ${type === 'audio' ? 'audio' : ''}`}>
                            {nftImage !== '' && (
                                <>
                                    {type === 'image' ? (
                                        <div
                                            className='w-100 h-100 card-img-holder-inner'
                                            style={{
                                                backgroundImage: `url(https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center center',
                                            }}
                                        ></div>
                                    ) : type === 'audio' ? (
                                        <>
                                            <i className='las la-music' style={melodyStyle}></i>
                                            <AudioPlayer
                                                src={`https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`}
                                                autoPlayAfterSrcChange={false}
                                                showJumpControls={false}
                                            />
                                        </>
                                    ) : (
                                        type === 'video' && (
                                            <ReactPlayer
                                                url={`https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`}
                                                controls={true}
                                                width='100%'
                                                height='auto'
                                            />
                                        )
                                    )}
                                </>
                            )}
                        </div>

                        {unlockable !== '' && owner === web3Ctx.account && (
                            <div className='position-absolute top-0 end-0 m-3'>
                                <a
                                    href={unlockable}
                                    className='btn btn-info px-3'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                >
                                    <i className='las la-cloud'></i>
                                </a>
                            </div>
                        )}
                    </div>

                    <div className='fw-bold lead mb-3 d-flex align-items-center justify-content-between'>
                        <Link className='text-reset' to={`/assets/${id}`}>
                            {truncateStart(title, 25)}
                        </Link>
                        <div className='ms-3'>
                            <NftCategory category={category} />
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between flex-wrap'>
                        <div className='author position-static z-index-20 d-flex align-items-center'>
                            <Link className='text-reset' to={`/users/${owner}`}>
                                <div className='author-avatar'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(${
                                                ownerAvatar !== '' ? ownerAvatar : '/images/astronaut.png'
                                            })`,
                                        }}
                                    ></span>
                                </div>
                            </Link>
                            <div className='ms-2'>
                                <p className='text-muted fw-normal mb-0 lh-1'>
                                    <span className='text-xs'>Owned By</span>
                                    <strong className='d-block fw-bold h6 text-dark mb-0'>
                                        <Link className='text-reset' to={`/users/${owner}`}>
                                            {truncateStart(ownerName, 10)}
                                        </Link>
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <p className='text-muted fw-normal mb-0 lh-1'>
                            <span className='text-xs'>Prix Actuel</span>
                            {hasOffer ? (
                                owner !== web3Ctx.account ? (
                                    <strong className='d-block fw-bold lead text-dark h2 mb-0'>
                                        {formattedPrice} <span className='text-sm'> {settings.currency}</span>
                                    </strong>
                                ) : (
                                    <strong className='d-block fw-bold lead text-dark h2 mb-0'>
                                        {formattedPrice} <span className='text-sm'> {settings.currency}</span>
                                    </strong>
                                )
                            ) : owner === web3Ctx.account ? (
                                <strong className='d-block fw-bold lead text-dark h2 mb-0'>Pas à vendre</strong>
                            ) : (
                                <strong className='d-block fw-bold lead text-dark h2 mb-0'>Pas à vendre</strong>
                            )}
                        </p>
                    </div>
                    {hasOffer ? (
                        owner !== web3Ctx.account ? (
                            <>
                                <div className='card-ribbon top-0 mt-4 pt-2'>
                                    <span className='bg-danger px-2 py-1 rounded-sm'>En Vente</span>{' '}
                                    {unlockable !== '' && (
                                        <span className='px-2 py-1 rounded-sm bg-dark text-white ms-1'>Unlockable</span>
                                    )}
                                </div>
                                <div className='card-action'>
                                    {userCtx.userIsRegistered ? (
                                        <button
                                            type='button'
                                            className='btn btn-primary text-nowrap'
                                            onClick={buyHandler}
                                        >
                                            <i className='lab la-ethereum me-2'></i>
                                            Acheter NFT
                                        </button>
                                    ) : (
                                        <>
                                            {web3Ctx.account ? (
                                                <Link className='btn btn-primary text-nowrap' to='/register'>
                                                    <i className='las la-user me-2'></i>
                                                    S'inscrire pour Acheter
                                                </Link>
                                            ) : (
                                                <>
                                                    {window.ethereum && networkId === settings.networkId && (
                                                        <button
                                                            type='button'
                                                            className='btn btn-gradient-primary text-nowrap'
                                                            onClick={connectWalletHandler}
                                                        >
                                                            Connecter le Portefeuille
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='card-action'>
                                    <button
                                        type='button'
                                        className='btn btn-danger text-nowrap'
                                        onClick={cancelHandler}
                                    >
                                        Retirer de la vente
                                    </button>
                                </div>
                            </>
                        )
                    ) : owner === web3Ctx.account ? (
                        <>
                            <div className='card-ribbon top-0 mt-4 pt-2'>
                                <span className='bg-primary px-2 py-1 rounded-sm'>Propriétaire</span>{' '}
                                {unlockable !== '' && (
                                    <span className='px-2 py-1 rounded-sm bg-dark text-white ms-1'>Undéblockable</span>
                                )}
                            </div>
                            <div className='card-action'>
                                <button
                                    className='btn btn-primary text-nowrap'
                                    type='button'
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                >
                                    Créer une vente
                                </button>
                            </div>
                            <Modal
                                status={isModalOpen}
                                variant='modal-card-inner'
                                modalClose={closeModalHandler}
                                layout={{ width: '400px', maxWidth: '100%' }}
                            >
                                <div className='card-body text-center py-lg-5'>
                                    <h4 className='mb-1'>Mettre en ventre le NFT</h4>
                                    {saleType === 'fixedPrice' && (
                                        <p className='text-muted mb-4'>
                                            Ajouter un prix à votre NFT avec{' '}
                                            <span className='text-sm'> {settings.currency}</span>
                                        </p>
                                    )}
                                    {saleType === 'auction' && <p className='text-muted mb-4'>Ajouter une date de Fin d'enchère</p>}

                                    {saleType === '' && (
                                        <div className='d-flex flex-column'>
                                            <button
                                                className='btn btn-primary m-1 w-100'
                                                type='button'
                                                onClick={() => setSaleType('fixedPrice')}
                                            >
                                                Prix Fixe
                                            </button>
                                            <button
                                                className='btn btn-info m-1 w-100'
                                                type='button'
                                                onClick={() => setSaleType('auction')}
                                            >
                                                Créer une Enchère
                                            </button>
                                        </div>
                                    )}

                                    {saleType === 'fixedPrice' && (
                                        <form onSubmit={(e) => makeOfferHandler(e, offerPrice)}>
                                            <input
                                                type='number'
                                                step='0.001'
                                                min='0.0000000000000000000000001'
                                                placeholder={`Prix avec ${settings.currency}...`}
                                                className='form-control mb-2'
                                                required={true}
                                                autoFocus={true}
                                                value={offerPrice}
                                                onChange={(e) => setOfferPrice(e.target.value)}
                                            />
                                            <button type='submit' className='btn btn-primary w-100 rounded-sm mb-2'>
                                                Créer une vente
                                            </button>
                                            <p className='mb-0 text-center text-muted'>
                                                Vous obtenez
                                                <span className='text-primary fw-normal mx-1'>
                                                    {offerPrice
                                                        ? offerPrice -
                                                          (parseFloat(offerPrice) * settings.saleCommission) / 1000
                                                        : 0}
                                                </span>
                                                <span className='text-sm'> {settings.currency}</span> après Commission par MetaMusik
                                            </p>
                                        </form>
                                    )}

                                    {saleType === 'auction' && (
                                        <form onSubmit={(e) => makeAuctionHandler(e, endDate, id)}>
                                            <div className='row gy-3 text-start'>
                                                <div className='col-12'>
                                                    <label className='form-label text-start fw-bold'>
                                                        Date Fin D'enchère
                                                    </label>
                                                    <input
                                                        className='form-control'
                                                        type='date'
                                                        value={endDate}
                                                        autoFocus={true}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <button
                                                        type='submit'
                                                        className='btn btn-primary w-100 rounded-sm mb-2'
                                                    >
                                                        Créer une vente
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </Modal>
                        </>
                    ) : (
                        <>
                            <div className='card-ribbon top-0 mt-4 pt-2'>
                                <span className='bg-danger px-2 py-1 rounded-sm'>N'est pas à vendre</span>{' '}
                                {unlockable !== '' && (
                                    <span className='px-2 py-1 rounded-sm bg-dark text-white ms-1'>Unlockable</span>
                                )}
                            </div>
                        </>
                    )}

                    <div className='text-muted fw-normaltext-sm d-flex align-items-center mt-4 justify-content-between'>
                        <p className='mb-0 text-xs d-flex align-items-center'>
                            <i className='las la-percentage me-1'></i>
                            <span className='me-1 text-primary'>{royalties}%</span>
                            Royalties
                        </p>
                        <p className='text-xs mb-0 d-flex align-items-center'>
                            <i className='la-sm text-primary las la-clock mx-1 text-primary'></i>
                            {formatDate(dateCreated)}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NftItem;
