import React, { useEffect, useState, useRef, createRef, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import web3 from '../../connect-web3/web3';
import Web3 from 'web3';
import { settings } from '../../helpers/settings';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useAnalytics from '../../hooks/useAnalytics';

// COMPONENTS
import NFTThumbnail from './NFTThumbnail';
import NFTInfoPanel from './NFTInfoPanel';
import NFTAuthor from './NFTAuthor';
import Loader from '../../components/general/Loader';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import NftHistory from '../../components/general/NftHistory';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import NftItem from '../../components/general/NftItem';
import PricesLog from '../../components/general/PricesLog';
import Modal from '../../components/general/Modal';
import NftProps from '../../components/general/NftProps';

function NFTSinglePage() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();

    const [saleType, setSaleType] = useState('');
    const [endDate, setEndDate] = useState(new Date().getTime());
    const [nftData, setNftData] = useState(null);
    const [assetHistory, setAssetHistory] = useState(['0x9']);
    const [marketplaceAddress, setMarketplaceAddress] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [ownerName, setOwnerName] = useState('Loading...');
    const [historyType, setHistoryType] = useState('transactions');
    const [ownerAvatar, setOwnerAvatar] = useState(null);
    const [creatorName, setCreatorName] = useState(null);
    const [creatorAvatar, setCreatorAvatar] = useState(null);
    const [nftImage, setNftImage] = useState('');
    const [nftProperties, setNftProperties] = useState([]);
    const { addToast } = useToasts();
    const [currentAsset, setCurrentAsset] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCurrentAsset, setIsCurrentAsset] = useState(null);
    const [networkId, setNetworkId] = useState(0);
    const { id } = useParams();

    /*** ------------------------------------------ */
    //      GET ACTIVE NETWORK ID
    /*** ------------------------------------------ */
    useEffect(() => {
        let signal = true;
        async function getNetworkId() {
            if (window.ethereum) {
                const networkId = await web3Ctx.loadNetworkId(new Web3(window.ethereum));
                setNetworkId(networkId);
            }
        }

        if (signal) {
            getNetworkId();
        }

        return () => (signal = false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*** ------------------------------------------ */
    //      CHECK IF THE ASSET EXISTS
    /*** ------------------------------------------ */
    useEffect(() => {
        if (collectionCtx.contract && collectionCtx.collection.length > 0) {
            if (
                collectionCtx.collection
                    .filter((nft) => nft.inAuction !== true)
                    .map((nft) => nft.id)
                    .includes(Number(id))
            ) {
                setIsCurrentAsset(true);
            } else {
                setIsCurrentAsset(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nftData, id, collectionCtx.collection]);

    /*** ------------------------------------------ */
    //      DECLARE PRICE REFERENCE
    /*** ------------------------------------------ */
    const priceRefs = useRef([]);
    if (priceRefs.current.length !== collectionCtx.collection.length) {
        priceRefs.current = Array(collectionCtx.collection.length)
            .fill()
            .map((_, i) => priceRefs.current[i] || createRef());
    }

    /*** ------------------------------------------ */
    //      MERGE NFT COLLECTIONS WITH OFFERS
    /*** ------------------------------------------ */
    useEffect(() => {
        if (marketplaceCtx.contract && collectionCtx.contract && collectionCtx.collection.length > 0) {
            setNftData(collectionCtx.collection.filter((nft) => nft.id === Number(id)));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        marketplaceCtx.offers,
        collectionCtx.collection,
        collectionCtx.contract,
        marketplaceCtx.contract,
        collectionCtx.collection,
        analyticsCtx.nftHistory,
        isCurrentAsset,
        id,
    ]);

    /*** ------------------------------------------ */
    //      GET NFT DETAILS
    /*** ------------------------------------------ */
    const similarItems = useMemo(() => {
        if (nftData && isCurrentAsset === true) {
            return collectionCtx.collection
                .filter(
                    (nft) =>
                        !auctionCtx.auctions
                            .filter((auc) => auc.isActive === true)
                            .some((auc) => nft.id === auc.tokenId)
                )
                .filter((item) => item.category === nftData[0].category)
                .filter((item) => item.id !== Number(id))
                .filter((item) => item.isApproved === true);
        }
    }, [nftData, id, collectionCtx.collection, isCurrentAsset, auctionCtx.auctions]);

    /*** ------------------------------------------ */
    //      GET MFT HISTORY
    /*** ------------------------------------------ */
    useEffect(() => {
        if (analyticsCtx.contract && isCurrentAsset === true) {
            analyticsCtx.getNftHistory(analyticsCtx.contract, Number(id));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyticsCtx.contract, id, isCurrentAsset]);

    /*** ------------------------------------------ */
    //      SET MFT HISTORY
    /*** ------------------------------------------ */
    useEffect(() => {
        if (collectionCtx.assetHistory && collectionCtx.contract) {
            setAssetHistory(collectionCtx.assetHistory);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.assetHistory, id, isCurrentAsset]);

    /*** ------------------------------------------ */
    //      GET MARKETPLACE CONTRACT
    /*** ------------------------------------------ */
    useEffect(() => {
        let signal = true;
        if (marketplaceCtx.contract) {
            async function getMarketplaceAddress() {
                const mktAddress = await marketplaceCtx.contract._address;
                setMarketplaceAddress(mktAddress);
            }

            if (signal) {
                getMarketplaceAddress();
            }
        }

        return () => (signal = false);
    }, [marketplaceCtx.contract]);

    /*** ------------------------------------------ */
    //      CHANGE PAGE TITLE
    /*** ------------------------------------------ */
    useEffect(() => {
        document.title = `${currentAsset.length > 0 ? currentAsset[0].title : 'NFT Item'} | metamusik NFT`;
    }, [currentAsset, id]);

    /*** ------------------------------------------ */
    //      GET NFT DETAILS
    /*** ------------------------------------------ */
    useEffect(() => {
        setCurrentAsset(collectionCtx.collection.filter((asset) => asset.id === Number(id)));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.collection, id]);

    /*** ------------------------------------------ */
    //      GET OWNER NAME & AVATAR
    /*** ------------------------------------------ */
    useEffect(() => {
        if (userCtx.usersList && userCtx.usersList.length > 0 && currentAsset.length > 0 && nftData) {
            setOwnerName(userCtx.usersList.filter((user) => user.account === nftData[0].owner)[0].fullName);
            setOwnerAvatar(userCtx.usersList.filter((user) => user.account === nftData[0].owner)[0].avatar);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, nftData, id]);

    /*** ------------------------------------------ */
    //      GET CREATOR NAME & AVATAR
    /*** ------------------------------------------ */
    useEffect(() => {
        if (userCtx.usersList && userCtx.usersList.length > 0 && currentAsset.length > 0 && nftData) {
            setCreatorName(userCtx.usersList.filter((user) => user.account === nftData[0].creator)[0].fullName);
            setCreatorAvatar(userCtx.usersList.filter((user) => user.account === nftData[0].creator)[0].avatar);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, nftData, id]);

    /*** ------------------------------------------ */
    //      FETCHING NFT MEDIA FROM IPFS
    /*** ------------------------------------------ */
    useEffect(() => {
        const promiseAborter = new AbortController();
        if (nftData && nftData.length > 0) {
            async function getNftImage() {
                try {
                    const response = await fetch(
                        `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftData[0].img}`,
                        { signal: promiseAborter.signal }
                    );
                    if (response.ok) {
                        const metadata = await response.json();
                        setNftImage(metadata.properties.image.description);
                        setNftProperties(metadata.properties.properties.description);
                    }
                } catch (error) {
                    return;
                }
            }

            getNftImage();
        }

        return () => promiseAborter.abort();
    }, [nftData]);

    /*** ------------------------------------------ */
    //      ADD PRICE FUNCTION
    /*** ------------------------------------------ */
    const makeOfferHandler = (e, price) => {
        e.preventDefault();
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
                        analyticsCtx.getNftHistory(analyticsCtx.contract, Number(id));
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
                collectionCtx.setNftTransactionLoading(false);
                setIsModalOpen(false);
                analyticsCtx.getNftHistory(analyticsCtx.contract, Number(id));
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
            });
    };

    /*** ------------------------------------------ */
    //      BUY NFT FUNCTION
    /*** ------------------------------------------ */
    const buyHandler = () => {
        marketplaceCtx.contract.methods
            .buyNFT(id)
            .send({ from: web3Ctx.account, value: nftData[0]?.price })
            .once('sending', () => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                collectionCtx.setNftTransactionLoading(true);
            })
            .on('receipt', () => {
                collectionCtx.setNftTransactionLoading(false);
                analyticsCtx.getNftHistory(analyticsCtx.contract, Number(id));
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

    /*** ------------------------------------------ */
    //      CANCEL OFFER FUNCTION
    /*** ------------------------------------------ */
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

    /*** ------------------------------------------ */
    //      MAKE AUCTION FUNCTION
    /*** ------------------------------------------ */
    const makeAuctionHandler = (event, endDate, id) => {
        event.preventDefault();

        if (new Date(endDate).getTime() > new Date().getTime()) {
            collectionCtx.contract.methods
                .approve(auctionCtx.contract.options.address, Number(id))
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
                        .createAuction(Number(id), new Date(endDate).getTime())
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

    /*** ------------------------------------------ */
    //      FETCH PROMOTION PRICE
    /*** ------------------------------------------ */
    useEffect(() => {
        if (marketplaceCtx.contract) {
            marketplaceCtx.laodPromotionPrice(marketplaceCtx.contract);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketplaceCtx.contract]);

    /*** ------------------------------------------ */
    //      PROMOTE NFT FUNCTION
    /*** ------------------------------------------ */
    function promoteNFTHandler() {
        if (marketplaceCtx.promotionPrice && Number(marketplaceCtx.promotionPrice) > 0) {
            const enteredPrice = web3.utils.BN(marketplaceCtx.promotionPrice);

            marketplaceCtx.contract.methods
                .promote(Number(id))
                .send({ from: web3Ctx.account, value: enteredPrice })
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
                    addToast('Oops! an error occured', {
                        appearance: 'error',
                    });
                    collectionCtx.setNftTransactionLoading(false);
                });
        }
    }

    /*** ------------------------------------------ */
    //      CLOSE MODAL FUNCTION
    /*** ------------------------------------------ */
    function closeModalHandler() {
        setIsModalOpen(false);
        setSaleType('');
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
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='loading' /> : null}
            <section className='pt-5 bg-light'>
                {nftData && nftData.length === 0 ? (
                    <div className='py-5 text-center mt-5 mb-3'>
                        <h1 className='h2 mt-5'>Récupération des détails de l'article</h1>
                        <p className='text-muted'>Veuillez patienter jusqu'à ce que nous préparions vos données.</p>
                        <Loader />
                    </div>
                ) : (
                    nftData &&
                    nftData.length > 0 &&
                    nftData.map((asset, key) => {
                        const price = asset.hasOffer
                            ? Number(web3.utils.fromWei(nftData[0]?.price.toString(), 'ether')).toFixed(2)
                            : null;

                        return (
                            <div key={key}>
                                <div className='container pt-5'>
                                    <div className='pt-5 mt-4 text-center'>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <Link className='text-reset' to={`/users/${asset.creator}`}>
                                                <div className='author-avatar'>
                                                    <span
                                                        className='author-avatar-inner'
                                                        style={{
                                                            background: `url(${
                                                                creatorAvatar && creatorAvatar !== ''
                                                                    ? creatorAvatar
                                                                    : '/images/astronaut.png'
                                                            })`,
                                                        }}
                                                    ></span>
                                                </div>
                                            </Link>
                                            <div className='ms-3 text-muted d-flex align-items-center'>
                                                By
                                                <strong className='fw-bold lh-1 ms-2 lead text-dark'>
                                                    <Link className='text-reset' to={`/users/${asset.creator}`}>
                                                        {creatorName && creatorName !== '' ? creatorName : 'MetaMusik'}
                                                    </Link>
                                                </strong>
                                            </div>
                                        </div>
                                        <h1 className='mb-1 text-center'>{asset.title}</h1>
                                        {!asset.isApproved && (
                                            <div className='d-inline-block rounded-sm px-3 mb-4 py-1 bg-danger text-white'>
                                                <div className='d-flex align-items-center'>
                                                    Cet article est en attente de l'approbation de l'administrateur
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='row mb-4 gy-4 mt-4'>
                                        <div className='col-lg-6'>
                                            <NFTThumbnail
                                                type={asset.type}
                                                owner={asset.owner}
                                                isPromoted={asset.isPromoted}
                                                promotionPrice={marketplaceCtx.promotionPrice}
                                                promote={promoteNFTHandler}
                                                thumbnail={
                                                    nftImage !== ''
                                                        ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}`
                                                        : ''
                                                }
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
                                                                historyType === 'prices' ? 'active' : null
                                                            }`}
                                                            onClick={() => setHistoryType('prices')}
                                                        >
                                                            <span className='lh-reset'>Registre des prix</span>
                                                        </button>
                                                    </div>
                                                    {historyType === 'transactions' && (
                                                        <NftHistory
                                                            history={analyticsCtx.nftHistory}
                                                            creator={asset.creator}
                                                            creatorName={creatorName}
                                                            creatorAvatar={creatorAvatar}
                                                            owner={asset.owner}
                                                            createdTime={asset.dateCreated}
                                                            mktAddress={marketplaceAddress}
                                                        />
                                                    )}
                                                    {historyType === 'prices' && (
                                                        <PricesLog history={analyticsCtx.nftHistory} />
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        <div className='col-lg-6'>
                                            <NFTInfoPanel
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

                                            <NFTAuthor
                                                history={assetHistory}
                                                creator={asset.creator}
                                                creatorName={creatorName}
                                                creatorAvatar={creatorAvatar}
                                                owner={asset.owner}
                                                ownerName={ownerName}
                                                ownerAvatar={ownerAvatar}
                                                marketplaceAddress={marketplaceAddress}
                                            />

                                            {asset.isApproved && (
                                                <div className='gy-4 my-4'>
                                                    {price ? (
                                                        <>
                                                            <h6 className='mb-3'>Prix actuel</h6>
                                                            <div className='text-sm text-muted fw-normal mb-0 d-flex align-items-center'>
                                                                <span className='icon bg-primary text-white me-2 mb-1'>
                                                                    <i className='lab la-ethereum fa-fw'></i>
                                                                </span>
                                                                <p className='mb-0 h4 d-flex align-items-end fw-bold ms-2 text-dark'>
                                                                    {price} {settings.currency}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className='d-inline-block'>
                                                            <p className='text-muted mb-0 d-flex align-items-center bg-gray-200 rounded py-2 px-3'>
                                                                <i className='lab la-ethereum text-dark me-2'></i>
                                                                Cet article n'est pas à vendre !
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {asset.isApproved &&
                                                (asset.hasOffer ? (
                                                    asset.owner !== web3Ctx.account ? (
                                                        userCtx.userIsRegistered ? (
                                                            <button
                                                                type='button'
                                                                className='btn btn-gradient-primary px-5'
                                                                onClick={buyHandler}
                                                            >
                                                                <i className='lab la-ethereum me-2'></i>
                                                                Achat NFT
                                                            </button>
                                                        ) : (
                                                            <>
                                                                {window.ethereum &&
                                                                    networkId === settings.networkId && (
                                                                        <Link
                                                                            to='/register'
                                                                            className='btn btn-primary'
                                                                        >
                                                                            <i className='las la-user me-2'></i>
                                                                            S'inscrire pour acheter
                                                                        </Link>
                                                                    )}
                                                            </>
                                                        )
                                                    ) : (
                                                        <button
                                                            type='button'
                                                            className='btn btn-danger px-5'
                                                            onClick={cancelHandler}
                                                        >
                                                            Supprimer la liste des NFT de la vente
                                                        </button>
                                                    )
                                                ) : asset.owner === web3Ctx.account ? (
                                                    <div className='col-xl-8'>
                                                        <button
                                                            className='btn btn-primary px-5'
                                                            type='button'
                                                            onClick={() => {
                                                                setIsModalOpen(true);
                                                            }}
                                                        >
                                                            Créer une vente
                                                        </button>
                                                        <Modal
                                                            status={isModalOpen}
                                                            variant=''
                                                            modalClose={closeModalHandler}
                                                            layout={{ width: '500px', maxWidth: '100%' }}
                                                        >
                                                            <div className='card-body text-center p-lg-5'>
                                                                <h4 className='mb-1'>Liste des NFT à vendre</h4>
                                                                {saleType === 'fixedPrice' && (
                                                                    <p className='text-muted mb-4'>
                                                                        Ajoutez un prix à votre NFT avec {settings.currency}
                                                                    </p>
                                                                )}
                                                                {saleType === 'auction' && (
                                                                    <p className='text-muted mb-4'>
                                                                        Ajouter la date de fin de l'enchère
                                                                    </p>
                                                                )}

                                                                {saleType === '' && (
                                                                    <div className='d-flex flex-column'>
                                                                        <button
                                                                            className='btn btn-primary m-1 w-100'
                                                                            type='button'
                                                                            onClick={() => setSaleType('fixedPrice')}
                                                                        >
                                                                            Prix fixe
                                                                        </button>
                                                                        <button
                                                                            className='btn btn-info m-1 w-100'
                                                                            type='button'
                                                                            onClick={() => setSaleType('auction')}
                                                                        >
                                                                            Appel d'offres
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {saleType === 'fixedPrice' && (
                                                                    <form
                                                                        onSubmit={(e) =>
                                                                            makeOfferHandler(e, offerPrice)
                                                                        }
                                                                    >
                                                                        <input
                                                                            type='number'
                                                                            step='0.001'
                                                                            min='0.0000000000000000000000001'
                                                                            placeholder={`Price with ${settings.currency}...`}
                                                                            className='form-control mb-2'
                                                                            required={true}
                                                                            autoFocus={true}
                                                                            value={offerPrice}
                                                                            onChange={(e) =>
                                                                                setOfferPrice(e.target.value)
                                                                            }
                                                                        />
                                                                        <button
                                                                            type='submit'
                                                                            className='btn btn-primary w-100 rounded-sm mb-3'
                                                                        >
                                                                            Créer une vente
                                                                        </button>
                                                                        <p className='mb-0 text-center text-muted'>
                                                                            Vous obtiendrez
                                                                            <span className='text-primary fw-normal mx-1'>
                                                                                {offerPrice
                                                                                    ? (
                                                                                          offerPrice -
                                                                                          (parseFloat(offerPrice) *
                                                                                              settings.saleCommission) /
                                                                                              1000
                                                                                      ).toFixed(4)
                                                                                    : 0}
                                                                            </span>
                                                                            {settings.currency} Après la commission
                                                                        </p>
                                                                    </form>
                                                                )}

                                                                {saleType === 'auction' && (
                                                                    <form
                                                                        onSubmit={(e) =>
                                                                            makeAuctionHandler(e, endDate, id)
                                                                        }
                                                                    >
                                                                        <div className='row gy-3 text-start'>
                                                                            <div className='col-12'>
                                                                                <label className='form-label text-start fw-bold'>
                                                                                    La vente aux enchères se termine le
                                                                                </label>
                                                                                <input
                                                                                    className='form-control'
                                                                                    type='date'
                                                                                    value={endDate}
                                                                                    autoFocus={true}
                                                                                    onChange={(e) =>
                                                                                        setEndDate(e.target.value)
                                                                                    }
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
                                                    </div>
                                                ) : null)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {similarItems && similarItems.length > 0 && (
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
                            {similarItems.slice(0, 3).map((NFT, key) => {
                                return (
                                    <div className='col-lg-4' key={key}>
                                        <NftItem {...NFT} />
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

export default NFTSinglePage;
