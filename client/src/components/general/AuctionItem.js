import React, { useRef, createRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Countdown from 'react-countdown';
import web3 from '../../connect-web3/web3';
import Web3 from 'web3';
import { formatDate, truncateStart, formatPrice } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import NftCategory from './NftCategory';
import Modal from './Modal';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useAuctions from '../../hooks/useAuctions';
import useUser from '../../hooks/useUser';
import useAnalytics from '../../hooks/useAnalytics';
import useCollection from '../../hooks/useCollection';

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

function AuctionItem({
    img,
    title,
    owner,
    user,
    category,
    dateCreated,
    tokenId,
    auctionId,
    index,
    endAt,
    nftKey,
    noAnimation,
    unlockable,
    royalties,
    bids,
    type,
}) {
    const web3Ctx = useWeb3();
    const auctionCtx = useAuctions();
    const userCtx = useUser();
    const analyticsCtx = useAnalytics();
    const collectionCtx = useCollection();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ownerName, setOwnerName] = useState('Loading...');
    const [ownerAvatar, setOwnerAvatar] = useState('');
    const [bidPrice, setBidPrice] = useState('');
    const [nftImage, setNftImage] = useState('');
    const { addToast } = useToasts();
    const [isCurrentBidder, setIsCurrentBidder] = useState(false);
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [topBidder, setTopBidder] = useState('');
    const [topBid, setTopBid] = useState(0);
    const [networkId, setNetworkId] = useState(0);

    /*** ------------------------------------------------- */
    //      GET ACTIVE NETWORK ID
    /*** ------------------------------------------------- */
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

    /*** ------------------------------------------------- */
    //      FETCHING NFT MEDIA FROM IPFS
    /*** ------------------------------------------------- */
    useEffect(() => {
        const promiseAborter = new AbortController();
        async function getNftImage() {
            try {
                const response =
                    img &&
                    img !== '' &&
                    (await fetch(`https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${img}`, {
                        signal: promiseAborter.signal,
                    }));
                if (response.ok) {
                    const metadata = await response.json();
                    setNftImage(metadata.properties.image.description);
                }
            } catch (error) {
                return;
            }
        }
        getNftImage();

        return () => promiseAborter.abort();
    }, [img]);

    /*** ------------------------------------------------- */
    //      GET TOP BID
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (bids.length > 0) {
            const auctionBids = bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.amount);
            if (auctionBids.length > 0) {
                setTopBid(Math.max(...auctionBids));
            } else {
                setTopBid(0);
            }
        } else {
            setTopBid(0);
        }
    }, [bids]);

    /*** ------------------------------------------------- */
    //      VALIDATE IF THE USER IS CURRENT BIDDER
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (bids.length > 0) {
            const bidders = bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.bidder);
            if (bidders.includes(web3Ctx.account)) {
                setIsCurrentBidder(true);
            } else {
                setIsCurrentBidder(false);
            }
        } else {
            setIsCurrentBidder(false);
        }
    }, [bids, web3Ctx.account]);

    /*** ------------------------------------------------- */
    //      GET TOP BIDDER
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (bids.filter((bid) => bid.withdraw !== true).length > 0) {
            const auctionBids = bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.amount);
            const maxBid = Math.max(...auctionBids);
            const topBidder = bids
                .filter((bid) => bid.withdraw !== true)
                .filter((bid) => bid.amount === maxBid)[0].bidder;
            setTopBidder(topBidder);
        }
    }, [bids]);

    /*** ------------------------------------------------- */
    //      CHECK IF AUCTION IS STILL OPEN
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (endAt <= new Date().getTime()) {
            setAuctionEnded(true);
        }
    }, [endAt]);

    const Completionist = () => (
        <div className='text-center p-4 rounded-lg bg-light mt-4'>
            <h6 className='text-center mb-0 fw-bold text-uppercase letter-spacing-0'>Enchères terminées</h6>
            {web3Ctx.account === topBidder && topBid > 0 && (
                <>
                    <p className='text-muted mb-2 text-center'>Super ! Vous remportez l'enchère.</p>
                    <button className='btn btn-primary btn-sm py-2 px-4' type='button' onClick={claimNFTHandler}>
                        <span className='lh-reset'>Réclamez votre NFT</span>
                    </button>
                </>
            )}

            {topBid === 0 && web3Ctx.account === user && (
                <>
                    <p className='text-muted mb-2 text-center'>Personne n'était intéressé.</p>
                    <button className='btn btn-primary btn-sm py-2 px-4' type='button' onClick={cancelHandler}>
                        <span className='lh-reset'>Rétablissez votre NFT</span>
                    </button>
                </>
            )}

            {topBid > 0 && web3Ctx.account === user && (
                <>
                    <p className='text-muted mb-2 text-center'>Ce NFT a un autre propriétaire, il n'est plus le vôtre.</p>
                </>
            )}
        </div>
    );

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            return (
                <div className='countdown rounded-lg bg-light mt-4 mb-5'>
                    <div className='countdown-item flex-fill'>
                        <div className='countdown-item-number bg-white w-100'>{days}</div>
                        <span>Jours</span>
                    </div>
                    <div className='countdown-item flex-fill'>
                        <div className='countdown-item-number bg-white w-100'>{hours}</div>
                        <span>Heures</span>
                    </div>
                    <div className='countdown-item flex-fill'>
                        <div className='countdown-item-number bg-white w-100'>{minutes}</div>
                        <span>Minutes</span>
                    </div>
                    <div className='countdown-item flex-fill'>
                        <div className='countdown-item-number bg-white w-100'>{seconds}</div>
                        <span>Secondes</span>
                    </div>
                </div>
            );
        }
    };

    /*** ------------------------------------------------- */
    //      DECLARE PRICE REFERENCE
    /*** ------------------------------------------------- */
    const priceRefs = useRef([]);
    if (priceRefs.current.length !== auctionCtx.auctions.length) {
        priceRefs.current = Array(auctionCtx.auctions.length)
            .fill()
            .map((_, i) => priceRefs.current[i] || createRef());
    }

    /*** ------------------------------------------------- */
    //      GET OWNER AVATAR & NAME
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (
            userCtx.contract &&
            userCtx.usersList &&
            userCtx.usersList.length > 0 &&
            auctionCtx.auctionsData &&
            auctionCtx.auctionsData.length > 0
        ) {
            const nftOwnerName = userCtx.usersList.filter((u) => u.account === user)[0].fullName;
            const nftOwnerAvatar = userCtx.usersList.filter((u) => u.account === user)[0].avatar;
            setOwnerAvatar(nftOwnerAvatar);
            setOwnerName(nftOwnerName);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, userCtx.contract, auctionCtx.auctionsData, auctionCtx.contract]);

    /*** ------------------------------------------------- */
    //      CANCEL AUCTION FUNCTION
    /*** ------------------------------------------------- */
    const cancelHandler = (event) => {
        auctionCtx.contract.methods
            .cancelAuction(tokenId, auctionId)
            .send({ from: web3Ctx.account })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', () => {
                collectionCtx.loadCollection(collectionCtx.contract);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                auctionCtx.setAuctionTransactionLoading(false);
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
            });
    };

    /*** ------------------------------------------------- */
    //      PLACE BID FUNCTION
    /*** ------------------------------------------------- */
    const placeBidHandler = (event, price) => {
        event.preventDefault();

        const enteredPrice = web3.utils.toWei(price.toString(), 'ether');
        console.log(enteredPrice);

        auctionCtx.contract.methods
            .bid(tokenId, auctionId, enteredPrice)
            .send({ from: web3Ctx.account, value: enteredPrice })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
                setIsModalOpen(false);
            })
            .on('transactionHash', (hash) => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', () => {
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ------------------------------------------------- */
    //      WITHDRAW BID FUNCTION
    /*** ------------------------------------------------- */
    const withdrawBidHandler = (event) => {
        event.preventDefault();

        auctionCtx.contract.methods
            .withdraw(tokenId, auctionId)
            .send({ from: web3Ctx.account })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', () => {
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ------------------------------------------------- */
    //      CLAIM WINNDED NFT
    /*** ------------------------------------------------- */
    const claimNFTHandler = (event) => {
        event.preventDefault();

        auctionCtx.contract.methods
            .endAuction(tokenId, auctionId)
            .send({
                from: topBidder,
            })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', () => {
                auctionCtx.setAuctionTransactionLoading(false);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            })
            .on('error', (error) => {
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ------------------------------------------------- */
    //      CLOSE MODAL FUNCTION
    /*** ------------------------------------------------- */
    function closeModalHandler() {
        setIsModalOpen(false);
    }

    return (
        <>
            <div
                className={`card rounded card-hover-image position-relative ${category}`}
                data-aos={`${noAnimation ? '' : 'fade-up'}`}
                data-aos-once='true'
                data-aos-delay={(nftKey + 1) * 100}
            >
                <div className='card-body p-3 position-relative'>
                    <div className='position-relative mb-4 shadow'>
                        <div className={`card-img-holder rounded overflow-hidden ${type === 'audio' ? 'audio' : ''}`}>
                            {type === 'image' ? (
                                <div
                                    className='w-100 h-100 card-img-holder-inner'
                                    style={{
                                        backgroundImage:
                                            nftImage !== ''
                                                ? `url(https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage})`
                                                : '',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center center',
                                    }}
                                ></div>
                            ) : type === 'audio' ? (
                                <>
                                    <i className='las la-music' style={melodyStyle}></i>
                                    <AudioPlayer
                                        src={
                                            nftImage !== ''
                                                ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`
                                                : ''
                                        }
                                        autoPlayAfterSrcChange={false}
                                        showJumpControls={false}
                                    />
                                </>
                            ) : (
                                type === 'video' && (
                                    <ReactPlayer
                                        url={
                                            nftImage !== ''
                                                ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`
                                                : ''
                                        }
                                        controls={true}
                                        width='100%'
                                        height='auto'
                                    />
                                )
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
                        <Link className='text-reset' to={`/nftauction/${tokenId}`}>
                            {truncateStart(title, 25)}
                        </Link>
                        <div className='ms-3'>
                            <NftCategory category={category} />
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between flex-wrap'>
                        <div className='author position-static z-index-20 d-flex align-items-center'>
                            <Link className='text-reset' to={`/users/${user}`}>
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
                                    <span className='text-xs'>Détenu par</span>
                                    <strong className='d-block fw-bold h6 text-dark mb-0'>
                                        <Link className='text-reset' to={`/users/${user}`}>
                                            {truncateStart(ownerName, 10)}
                                        </Link>
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <p className='text-muted fw-normal mb-0 lh-1'>
                            <span className='text-xs'>L'offre la plus élevée</span>
                            {index !== -1 ? (
                                <strong className='d-block fw-bold lead text-dark h2 mb-0'>
                                    {topBid > 0 ? formatPrice(topBid).toFixed(3) : 0}{' '}
                                    <span className='text-sm'> {settings.currency}</span>
                                </strong>
                            ) : owner === web3Ctx.account ? (
                                <strong className='d-block fw-bold lead text-dark h2 mb-0'>Non défini</strong>
                            ) : (
                                <strong className='d-block fw-bold lead text-dark h2 mb-0'>Non défini</strong>
                            )}
                        </p>
                    </div>
                    {index !== -1 ? (
                        user !== web3Ctx.account ? (
                            <>
                                <div className='card-ribbon top-0 mt-4 pt-2'>
                                    {auctionEnded !== true ? (
                                        <span className='bg-danger px-2 py-1 rounded-sm'>Appel d'offres</span>
                                    ) : (
                                        <span className='bg-danger px-2 py-1 rounded-sm'>Pas à vendre</span>
                                    )}
                                    {unlockable !== '' && (
                                        <span className='px-2 py-1 rounded-sm bg-dark text-white ms-1'>Déverrouillable</span>
                                    )}
                                </div>
                                <div className='card-action'>
                                    {auctionEnded !== true && (
                                        <>
                                            {userCtx.userIsRegistered ? (
                                                <>
                                                    {isCurrentBidder === false && (
                                                        <button
                                                            type='button'
                                                            className='btn btn-primary text-nowrap'
                                                            value={index}
                                                            onClick={() => {
                                                                setIsModalOpen(true);
                                                            }}
                                                        >
                                                            <i className='lab la-ethereum me-2'></i>
                                                            Placez l'offre
                                                        </button>
                                                    )}
                                                    {isCurrentBidder === true && (
                                                        <button
                                                            type='button'
                                                            className='btn btn-danger text-nowrap'
                                                            value={index}
                                                            onClick={withdrawBidHandler}
                                                        >
                                                            <i className='lab la-ethereum me-2'></i>
                                                            Retrait de l'offre
                                                        </button>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {window.ethereum && networkId === settings.networkId && (
                                                        <Link
                                                            className='btn btn-primary text-nowrap'
                                                            value={index}
                                                            to='/register'
                                                        >
                                                            <i className='las la-user me-2'></i>
                                                            S'inscrire à l'appel d'offres
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                <Modal
                                    status={isModalOpen}
                                    variant='modal-card-inner'
                                    modalClose={closeModalHandler}
                                    layout={{ width: '400px', maxWidth: '100%' }}
                                >
                                    <div className='card-body text-center py-lg-5'>
                                        <form onSubmit={(e) => placeBidHandler(e, bidPrice)}>
                                            <input
                                                type='number'
                                                step='0.001'
                                                min='0.0000000000000000000000001'
                                                placeholder={`Price with ${settings.currency}...`}
                                                className='form-control mb-2'
                                                required={true}
                                                autoFocus={true}
                                                value={bidPrice}
                                                onChange={(e) => setBidPrice(e.target.value)}
                                            />
                                            <button type='submit' className='btn btn-primary w-100 rounded-sm mb-2'>
                                            Placez l'offre
                                            </button>
                                            <p className='mb-0 text-center text-muted'>
                                            Vous trouverez vos fonds dans{' '}
                                                <span className='text-primary'>Mon compte</span> page si vous n'avez pas gagné
                                                cette enchère
                                            </p>
                                        </form>
                                    </div>
                                </Modal>
                            </>
                        ) : (
                            <>
                                {auctionEnded !== true && (
                                    <div className='card-action'>
                                        <button
                                            type='button'
                                            value={nftKey}
                                            className='btn btn-danger text-nowrap'
                                            onClick={cancelHandler}
                                        >
                                            Annuler l'enchère
                                        </button>
                                    </div>
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <div className='card-ribbon top-0 mt-4 pt-2'>
                                <span className='bg-danger px-2 py-1 rounded-sm'>Pas à vendre</span>{' '}
                                {unlockable !== '' && (
                                    <span className='px-2 py-1 rounded-sm bg-dark text-white ms-1'>Déverrouillable</span>
                                )}
                            </div>
                        </>
                    )}

                    <Countdown date={endAt} renderer={renderer} onComplete={() => setAuctionEnded(true)} />

                    <div className='text-muted fw-normaltext-sm d-flex align-items-center mt-4 justify-content-between'>
                        <p className='mb-0 text-xs d-flex align-items-center'>
                            <i className='las la-percentage me-1'></i>
                            <span className='me-1 text-primary'>{royalties}%</span>
                            Redevances
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

export default AuctionItem;
