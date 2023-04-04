import React, { useEffect, useState, useRef, createRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Countdown from 'react-countdown';
import web3 from '../../connect-web3/web3';
import { settings } from '../../helpers/settings';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useAnalytics from '../../hooks/useAnalytics';

// COMPONENTS
import Loader from '../../components/general/Loader';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import NftHistory from '../../components/general/NftHistory';
import AuctionBids from '../../components/general/AuctionBids';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import AuctionItem from '../../components/general/AuctionItem';
import Modal from '../../components/general/Modal';
import AuctionCta from '../../components/general/AuctionCta';
import PricesLog from '../../components/general/PricesLog';
import NftProps from '../../components/general/NftProps';
import AuctionAuthor from './AuctionAuthor';
import AuctionThumbnail from './AuctionThumbnail';
import AuctionInfoPanel from './AuctionInfoPanel';

function AuctionSinglePage() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();

    const [auctionData, setAuctionData] = useState(null);
    const [assetHistory, setAssetHistory] = useState(['0x9']);
    const [similarAuctions, setSimilarAuctions] = useState(null);
    const [ownerName, setOwnerName] = useState('Loading...');
    const [ownerAvatar, setOwnerAvatar] = useState(null);
    const [creatorName, setCreatorName] = useState('Loading...');
    const [creatorAvatar, setCreatorAvatar] = useState(null);
    const { addToast } = useToasts();
    const [currentAsset, setCurrentAsset] = useState([]);
    const [bidPrice, setBidPrice] = useState('');
    const [nftImage, setNftImage] = useState('');
    const [nftProperties, setNftProperties] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [auctionEnded, setAuctionEnded] = useState(false);
    const [isCurrentAsset, setIsCurrentAsset] = useState(null);
    const [isCurrentBidder, setIsCurrentBidder] = useState(null);
    const [topBid, setTopBid] = useState(0);
    const [topBidder, setTopBidder] = useState('');
    const [historyType, setHistoryType] = useState('transactions');
    const { id } = useParams();

    /*** =============================================== */
    //      CHECK IF AUCTION IS STILL OPEN
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            if (auctionData.endAt <= new Date().getTime()) {
                setAuctionEnded(true);
            }
        }
    }, [auctionData]);

    /*** =============================================== */
    //      FETCHING NFT MEDIA FROM IPFS
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            async function getNftImage() {
                try {
                    const response = await fetch(
                        `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${auctionData.img}`
                    );
                    const metadata = await response.json();
                    setNftImage(metadata.properties.image.description);
                    setNftProperties(metadata.properties.properties.description);
                } catch (error) {
                    return;
                }
            }

            getNftImage();
        }
    }, [auctionData]);

    /*** =============================================== */
    //      GET TOP BIDDER
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            if (auctionData.bids.filter((bid) => bid.withdraw !== true).length > 0) {
                const auctionBids = auctionData.bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.amount);
                const maxBid = Math.max(...auctionBids);
                const topBidder = auctionData.bids
                    .filter((bid) => bid.withdraw !== true)
                    .filter((bid) => bid.amount === maxBid)[0].bidder;
                setTopBidder(topBidder);
            }
        }
    }, [auctionData]);

    const Completionist = () => (
        <div className='row mb-4'>
            <div className='col-lg-8'>
                <div
                    className='bg-white rounded-xl p-4'
                    style={{
                        border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                    }}
                >
                    <h6 className='mb-0 fw-bold text-uppercase letter-spacing-0'>Enchères terminées</h6>
                    {web3Ctx.account === topBidder && topBid > 0 && (
                        <>
                            <p className='text-muted mb-2'>Super ! Vous remportez l'enchère.</p>
                            <button
                                className='btn btn-primary btn-sm py-2 px-4'
                                type='button'
                                onClick={claimNFTHandler}
                            >
                                <span className='lh-reset'>Réclamez votre NFT</span>
                            </button>
                        </>
                    )}

                    {topBid === 0 && web3Ctx.account === auctionData.user && (
                        <>
                            <p className='text-muted mb-2'>Personne n'était intéressé.</p>
                            <button className='btn btn-primary btn-sm py-2 px-4' type='button' onClick={cancelHandler}>
                                <span className='lh-reset'>Rétablissez votre NFT</span>
                            </button>
                        </>
                    )}

                    {topBid > 0 && web3Ctx.account === auctionData.user && (
                        <>
                            <p className='text-muted mb-2'>Ce NFT a un autre propriétaire, il n'est plus le vôtre.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const renderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            return (
                <div className='row mb-4'>
                    <div className='col-lg-8'>
                        <div
                            className='bg-white rounded-xl px-4'
                            style={{
                                border:
                                    marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                            }}
                        >
                            <div className='countdown rounded-lg mt-4 mb-5'>
                                <div className='countdown-item flex-fill'>
                                    <div className='countdown-item-number bg-white w-100'>{days}</div>
                                    <span>Jours</span>
                                </div>
                                <div className='countdown-item flex-fill'>
                                    <div className='countdown-item-number bg-white w-100'>{hours}</div>
                                    <span>Heurs</span>
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
                        </div>
                    </div>
                </div>
            );
        }
    };

    /*** =============================================== */
    //      CHECK IF THE ASSET EXISTS
    /*** =============================================== */
    useEffect(() => {
        if (collectionCtx.contract) {
            if (
                collectionCtx.collection
                    .filter((nft) => nft.inAuction === true)
                    .map((nft) => nft.id)
                    .includes(Number(id))
            ) {
                setIsCurrentAsset(true);
            } else {
                setIsCurrentAsset(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionData, id, collectionCtx.collection]);

    /*** =============================================== */
    //      GET TOP BID
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            if (auctionData.bids.length > 0) {
                const bids = auctionData.bids.filter((bid) => bid.withdraw === false).map((bid) => bid.amount);
                if (bids.length > 0) {
                    setTopBid(Math.max(...bids));
                } else {
                    setTopBid(0);
                }
            } else {
                setTopBid(0);
            }
        }
    }, [auctionData, id]);

    /*** =============================================== */
    //      DECLARE PRICE REFERENCE
    /*** =============================================== */
    const priceRefs = useRef([]);
    if (priceRefs.current.length !== collectionCtx.collection.length) {
        priceRefs.current = Array(collectionCtx.collection.length)
            .fill()
            .map((_, i) => priceRefs.current[i] || createRef());
    }

    /*** =============================================== */
    //      MERGE NFT COLLECTIONS WITH OFFERS
    /*** =============================================== */
    useEffect(() => {
        if (
            auctionCtx.contract &&
            collectionCtx.contract &&
            auctionCtx.auctionsData.length > 0 &&
            auctionCtx.fetchingLoading === false &&
            auctionCtx.auctionsLog.length > 0
        ) {
            setAuctionData(auctionCtx.auctionsData.filter((auc) => auc.tokenId === Number(id))[0]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        collectionCtx.collection,
        collectionCtx.contract,
        auctionCtx.contract,
        analyticsCtx.contract,
        auctionCtx.auctionsData,
        auctionCtx.auctionsLog,
        analyticsCtx.nftHistory,
        auctionCtx.fetchingLoading,
        id,
    ]);

    /*** =============================================== */
    //      GET SMIMLAR AUCTIONS
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            setSimilarAuctions(
                auctionCtx.auctionsData
                    .filter((auc) => auc.active === true)
                    .filter((auc) => auc.tokenId !== Number(id))
                    .filter((auc) => auc.category === auctionData.category)
            );
        }
    }, [id, auctionCtx.auctionsData, auctionData]);

    /*** =============================================== */
    //      GET MFT HISTORY
    /*** =============================================== */
    useEffect(() => {
        if (analyticsCtx.contract && isCurrentAsset === true) {
            analyticsCtx.getNftHistory(analyticsCtx.contract, Number(id));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsCtx.contract, id, isCurrentAsset]);

    /*** =============================================== */
    //      SET MFT HISTORY
    /*** =============================================== */
    useEffect(() => {
        if (collectionCtx.assetHistory && collectionCtx.contract) {
            setAssetHistory(collectionCtx.assetHistory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.contract, id, isCurrentAsset]);

    /*** =============================================== */
    //      CHANGE PAGE TITLE
    /*** =============================================== */
    useEffect(() => {
        document.title = `${currentAsset.length > 0 ? currentAsset[0].title : 'NFT Item'} | metamusik NFT`;
    }, [currentAsset, id]);

    /*** =============================================== */
    //      GET NFT DETAILS
    /*** =============================================== */
    useEffect(() => {
        setCurrentAsset(
            auctionCtx.auctionsData.filter((asset) => asset.tokenId === Number(id)).filter((auc) => auc.active === true)
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionCtx.auctionsData, id, auctionData]);

    /*** =============================================== */
    //      GET CREATOR NAME & AVATAR
    /*** =============================================== */
    useEffect(() => {
        if (userCtx.usersList && userCtx.usersList.length > 0 && currentAsset.length > 0 && auctionData) {
            setOwnerName(
                userCtx.usersList.filter((user) => user.account === auctionData.user).length > 0 &&
                    userCtx.usersList.filter((user) => user.account === auctionData.user)[0].fullName
            );
            setOwnerAvatar(
                userCtx.usersList.filter((user) => user.account === auctionData.user).length > 0 &&
                    userCtx.usersList.filter((user) => user.account === auctionData.user)[0].avatar
            );
            console.log(
                'HMMMMM',
                userCtx.usersList.filter((user) => user.account === auctionData.user)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, auctionData, id]);

    /*** =============================================== */
    //      GET OWNER NAME & AVATAR
    /*** =============================================== */
    useEffect(() => {
        if (userCtx.usersList && userCtx.usersList.length > 0 && currentAsset.length > 0 && auctionData) {
            setCreatorName(
                userCtx.usersList.filter((user) => user.account === auctionData.creator).length > 0 &&
                    userCtx.usersList.filter((user) => user.account === auctionData.creator)[0].fullName
            );
            setCreatorAvatar(
                userCtx.usersList.filter((user) => user.account === auctionData.creator).length > 0 &&
                    userCtx.usersList.filter((user) => user.account === auctionData.creator)[0].avatar
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, auctionData, id]);

    /*** =============================================== */
    //      VALIDATE IF THE USER IS CURRENT BIDDER
    /*** =============================================== */
    useEffect(() => {
        if (auctionData) {
            if (auctionData.bids.length > 0) {
                const bidders = auctionData.bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.bidder);
                if (bidders.includes(web3Ctx.account)) {
                    setIsCurrentBidder(true);
                } else {
                    setIsCurrentBidder(false);
                }
            } else {
                setIsCurrentBidder(false);
            }
        }
    }, [web3Ctx.account, auctionData]);

    /*** =============================================== */
    //      CANCEL AUCTION FUNCTION
    /*** =============================================== */
    const cancelHandler = (event) => {
        auctionCtx.contract.methods
            .cancelAuction(auctionData.tokenId, auctionData.auctionId)
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
                auctionCtx.setAuctionTransactionLoading(false);
                addToast("Oups ! une erreur s'est produite", {
                    appearance: 'error',
                });
            });
    };

    /*** =============================================== */
    //      PLACE BID FUNCTION
    /*** =============================================== */
    const placeBidHandler = (event) => {
        event.preventDefault();

        const enteredPrice = web3.utils.toWei(bidPrice, 'ether');

        auctionCtx.contract.methods
            .bid(auctionData.tokenId, auctionData.auctionId, enteredPrice)
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
                addToast("Oups ! une erreur s'est produite", {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** =============================================== */
    //      WITHDRAW BID FUNCTION
    /*** =============================================== */
    const withdrawBidHandler = (event) => {
        event.preventDefault();

        auctionCtx.contract.methods
            .withdraw(auctionData.tokenId, auctionData.auctionId)
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
                addToast("Oups ! une erreur s'est produite", {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** =============================================== */
    //      CLAIM WINNDED NFT
    /*** =============================================== */
    const claimNFTHandler = (event) => {
        event.preventDefault();

        auctionCtx.contract.methods
            .endAuction(auctionData.tokenId, auctionData.auctionId)
            .send({
                from: web3Ctx.account,
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
                addToast("Oups ! une erreur s'est produite", {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** =============================================== */
    //      FETCH PROMOTION PRICE
    /*** =============================================== */
    useEffect(() => {
        if (marketplaceCtx.contract) {
            marketplaceCtx.laodPromotionPrice(marketplaceCtx.contract);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketplaceCtx.contract]);

    /*** =============================================== */
    //      PROMOTE NFT FUNCTION
    /*** =============================================== */
    function promoteNFTHandler() {
        if (marketplaceCtx.promotionPrice && Number(marketplaceCtx.promotionPrice) > 0) {
            marketplaceCtx.contract.methods
                .promote(Number(id))
                .send({ from: web3Ctx.account })
                .once('sending', () => {
                    collectionCtx.setNftTransactionLoading(true);
                })
                .on('transactionHash', (hash) => {
                    collectionCtx.setNftTransactionLoading(true);
                })
                .on('receipt', () => {
                    collectionCtx.setNftTransactionLoading(false);
                    collectionCtx.loadCollection(collectionCtx.contract);
                    analyticsCtx.loadTransactions(analyticsCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                    auctionCtx.loadAuctions(auctionCtx.contract);
                    auctionCtx.loadAuctionsData(
                        collectionCtx.contract,
                        auctionCtx.auctions.filter((auc) => auc.isActive === true)
                    );
                })
                .on('error', (error) => {
                    addToast("Oups ! une erreur s'est produite", {
                        appearance: 'error',
                    });
                    collectionCtx.setNftTransactionLoading(false);
                });
        }
    }

    /*** =============================================== */
    //      CLOSE MODAL FUNCTION
    /*** =============================================== */
    function closeModalHandler() {
        setIsModalOpen(false);
    }

    if (isCurrentAsset === false) {
        return (
            <div className='container py-5'>
                <div className='row py-5 text-center'>
                    <div className='col-lg-6 mx-auto'>
                        <p className='mb-0 fw-bold' style={{ fontSize: '10rem' }}>
                            404
                        </p>
                        <h1 className='h2 text-uppercase'>Non trouvé</h1>
                        <p className='text-muted'>Cette page n'a pas été trouvée, retournez à la page d'accueil</p>
                        <Link to='/' className='btn btn-gradient-primary'>
                        Page d'accueil
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {auctionCtx.fetchingLoading === true ? <FullScreenLoader heading='Updating Auction' /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            {marketplaceCtx.fetchingLoading ? <FullScreenLoader heading='loading' /> : null}
            <Modal
                status={isModalOpen}
                variant=''
                modalClose={closeModalHandler}
                layout={{ width: '500px', maxWidth: '100%' }}
            >
                <div className='card-body text-center p-4 p-lg-5'>
                    <form onSubmit={(e) => placeBidHandler(e, Number(id))}>
                        <input
                            type='number'
                            step='0.001'
                            min='0.0000000000000000000000001'
                            placeholder={`Price with ${settings.currency}...`}
                            className='form-control mb-2'
                            required={true}
                            autoFocus={true}
                            ref={priceRefs.current[Number(id)]}
                            value={bidPrice}
                            onChange={(e) => setBidPrice(e.target.value)}
                        />
                        <button type='submit' className='btn btn-primary w-100 rounded-sm mb-2'>
                        Placez l'offre
                        </button>
                        <p className='mb-0 text-center text-muted mb-0'>
                        Vous trouverez vos fonds dans <span className='text-primary'>Mon compte</span> si vous n'avez pas
                            n'avez pas remporté cette enchère
                        </p>
                    </form>
                </div>
            </Modal>
            <section className='pt-5 bg-light'>
                {collectionCtx.collection.length === 0 && auctionData ? (
                    <div className='py-5 text-center mt-5 mb-3'>
                        <h1 className='h2 mt-5'>Récupération des détails de l'article</h1>
                        <p className='text-muted'>Veuillez patienter jusqu'à ce que nous préparions vos données.</p>
                        <Loader />
                    </div>
                ) : (
                    currentAsset.map((asset, key) => {
                        return (
                            <div key={key}>
                                <div className='container pt-5'>
                                    <div className='pt-5 mt-4'>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <Link className='text-reset' to={`/users/${asset.creator}`}>
                                                <div className='author-avatar'>
                                                    <span
                                                        className='author-avatar-inner'
                                                        style={{
                                                            background: `url(${
                                                                creatorAvatar ? creatorAvatar : '/images/astronaut.png'
                                                            })`,
                                                        }}
                                                    ></span>
                                                </div>
                                            </Link>
                                            <div className='ms-3 text-muted d-flex align-items-center'>
                                                Par
                                                <strong className='fw-bold lh-1 ms-2 lead text-dark'>
                                                    <Link className='text-reset' to={`/users/${asset.creator}`}>
                                                        {creatorName ? creatorName : 'MetaMusik'}
                                                    </Link>
                                                </strong>
                                            </div>
                                        </div>
                                        <h1 className='mb-4 text-center'>{asset.title}</h1>
                                    </div>
                                    <div className='row mb-4 gy-4 mt-4'>
                                        <div className='col-lg-6'>
                                            <AuctionThumbnail
                                                owner={asset.user}
                                                isPromoted={asset.isPromoted}
                                                promotionPrice={marketplaceCtx.promotionPrice}
                                                promote={promoteNFTHandler}
                                                thumbnail={
                                                    nftImage !== ''
                                                        ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`
                                                        : ''
                                                }
                                                type={asset.type}
                                            />

                                            {analyticsCtx.nftHistory && (
                                                <>
                                                    <div className='toggle-nav mt-5 mb-4'>
                                                        <button
                                                            className={`toggle-nav-btn flex-fill ${
                                                                historyType === 'transactions' ? 'active' : null
                                                            }`}
                                                            onClick={() => setHistoryType('transactions')}
                                                        >
                                                            <span className='lh-reset'>Transactions</span>
                                                        </button>
                                                        <button
                                                            className={`toggle-nav-btn flex-fill ${
                                                                historyType === 'bids' ? 'active' : null
                                                            }`}
                                                            onClick={() => setHistoryType('bids')}
                                                        >
                                                            <span className='lh-reset'>Offres</span>
                                                        </button>
                                                        <button
                                                            className={`toggle-nav-btn flex-fill ${
                                                                historyType === 'prices' ? 'active' : null
                                                            }`}
                                                            onClick={() => setHistoryType('prices')}
                                                        >
                                                            <span className='lh-reset'>Journal des prix</span>
                                                        </button>
                                                    </div>
                                                    {historyType === 'transactions' && (
                                                        <NftHistory
                                                            history={analyticsCtx.nftHistory}
                                                            creator={asset.creator}
                                                            owner={asset.user}
                                                            createdTime={asset.dateCreated}
                                                            ownerName={ownerName}
                                                            ownerAvatar={ownerAvatar}
                                                            creatorName={creatorName}
                                                            creatorAvatar={creatorAvatar}
                                                            mktAddress={marketplaceCtx.contract.options.address}
                                                            isAuction={true}
                                                        />
                                                    )}
                                                    {historyType === 'bids' && auctionData && (
                                                        <AuctionBids bids={auctionData.bids} />
                                                    )}
                                                    {historyType === 'prices' && auctionData && (
                                                        <PricesLog history={analyticsCtx.nftHistory} />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className='col-lg-6'>
                                            <AuctionInfoPanel
                                                name={asset.title}
                                                category={asset.category}
                                                img={
                                                    nftImage !== ''
                                                        ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`
                                                        : ''
                                                }
                                                artist={asset.creator}
                                                description={asset.description}
                                                dateCreated={asset.dateCreated}
                                                royalties={asset.royalties}
                                                unlockable={asset.unlockable}
                                                formate={asset.formate}
                                                type={asset.type}
                                            />

                                            <NftProps nftProperties={nftProperties ? nftProperties : []} />

                                            {auctionData && (
                                                <Countdown
                                                    date={auctionData.endAt}
                                                    renderer={renderer}
                                                    onComplete={() => setAuctionEnded(true)}
                                                />
                                            )}

                                            {asset.unlockable !== '' && asset.owner === web3Ctx.account && (
                                                <div className='row mb-4'>
                                                    <div className='col-xl-8'>
                                                        <a
                                                            href={asset.unlockable}
                                                            className='btn btn-info px-4 w-100'
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                        >
                                                            <i className='las la-cloud me-2'></i> Télécharger le contenu
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {auctionData && (
                                                <AuctionAuthor
                                                    history={assetHistory}
                                                    creator={asset.creator}
                                                    owner={auctionData.user}
                                                    ownerName={ownerName}
                                                    ownerAvatar={ownerAvatar}
                                                    creatorName={creatorName}
                                                    creatorAvatar={creatorAvatar}
                                                    marketplaceAddress={auctionCtx.contract.options.address}
                                                />
                                            )}

                                            {auctionData && auctionEnded !== true && (
                                                <AuctionCta
                                                    topBid={topBid}
                                                    isCurrentBidder={isCurrentBidder}
                                                    setIsModalOpen={setIsModalOpen}
                                                    cancelHandler={cancelHandler}
                                                    placeBidHandler={placeBidHandler}
                                                    withdrawBidHandler={withdrawBidHandler}
                                                    claimNFTHandler={claimNFTHandler}
                                                    closeModalHandler={closeModalHandler}
                                                    owner={auctionData.user}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {similarAuctions && similarAuctions.length > 0 && (
                <section className='pb-5 bg-light'>
                    <div className='container pb-5'>
                        <header className='mb-4'>
                            <div className='row'>
                                <div className='col-lg-6'>
                                    <h2 data-aos='fade-right' data-aos-delay='100' data-aos-once='true'>
                                    Similaires à cette catégorie
                                    </h2>
                                    <p
                                        className='text-muted lead mb-0'
                                        data-aos='fade-right'
                                        data-aos-delay='200'
                                        data-aos-once='true'
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae esse quis
                                        sed,necessitatibus nostrum mollitia.
                                    </p>
                                </div>
                            </div>
                        </header>
                        <div className='row gy-5'>
                            {similarAuctions.slice(0, 3).map((AUC, key) => {
                                return (
                                    <div className={`col-xl-4 col-md-6 ${AUC.category}`} key={AUC.tokenId}>
                                        <AuctionItem {...AUC} nftKey={key} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

export default AuctionSinglePage;
