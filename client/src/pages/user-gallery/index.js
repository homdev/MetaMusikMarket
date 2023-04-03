import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import NftItem from '../../components/general/NftItem';
import AuctionItem from '../../components/general/AuctionItem';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import FullScreenLoader from '../../components/general/FullScreenLoader';

function UserGalleryPage({ topSellers }) {
    const marketplaceCtx = useMarketplace();
    const collectionCtx = useCollection();
    const userCtx = useUser();
    const auctionCtx = useAuctions();

    const [isTopSeller, setIsTopSeller] = useState(null);
    const [isNavSelected, setIsNavSelected] = useState('created');
    const [allCollection, setAllCollection] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(null);
    const { address } = useParams();
    const [userDetails, setUserDetails] = useState({
        avatar: '',
        header: '',
        fullName: '',
        role: '',
        about: '',
        facebook: '',
        dribbble: '',
        twitter: '',
        instagram: '',
    });

    /*** ------------------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ------------------------------------------------- */
    useEffect(() => {
        document.title = `${userDetails.fullName} | ${settings.UISettings.marketplaceBrandName}`;
    }, [userDetails]);

    /*** ------------------------------------------------- */
    //      CHECK IF USER EXISTS
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList.map((user) => user.account).includes(address)) {
            setIsCurrentUser(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, userCtx.usersList]);

    /*** ------------------------------------------------- */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (marketplaceCtx.contract && collectionCtx.contract && collectionCtx.collection.length > 0) {
            setAllCollection(
                collectionCtx.collection
                    .filter((nft) => nft.isApproved === true)
                    .filter((nft) => nft.inAuction === false)
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        marketplaceCtx.offers,
        collectionCtx.collection,
        collectionCtx.contract,
        marketplaceCtx.contract,
        collectionCtx.collection,
    ]);

    /*** ------------------------------------------------- */
    //      GET USER DETAILS
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList && userCtx.usersList.length > 0 && isCurrentUser === true) {
            setUserDetails(userCtx.usersList.filter((user) => user.account === address)[0]);
        }
    }, [userCtx.contract, userCtx.usersList, address, isCurrentUser]);

    /*** ------------------------------------------------- */
    //      GET TOP SELLERS
    /*** ------------------------------------------------- */
    useEffect(() => {
        const topSellersList = topSellers.map((seller) => seller.address);
        setIsTopSeller(topSellersList.includes(address));
    }, [topSellers, address]);

    /*** ------------------------------------------------- */
    //      GET OWNED NFTS
    /*** ------------------------------------------------- */
    useEffect(() => {
        if (collectionCtx.contract && collectionCtx.collection && collectionCtx.collection.length > 0) {
            userCtx.loadUserAssets(collectionCtx.contract, address);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.contract, collectionCtx.collection, address]);

    /*** ------------------------------------------------- */
    //      GET CREATED NFTs
    /*** ------------------------------------------------- */
    const createdAssets = useMemo(() => {
        if (userCtx.userAssets) {
            return userCtx.userAssets.created;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.userAssets, userCtx.contract]);

    if (!isCurrentUser) {
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
            {auctionCtx.fetchingLoading ? <FullScreenLoader heading='Updating Auctions' /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            {collectionCtx.nftIsLoading ? <FullScreenLoader heading='loading' /> : null}
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            <section className='py-5'>
                <div className='container py-5'>
                    <div className='user-gallery-header'>
                        <div
                            className='user-gallery-header-inner'
                            style={{ background: `url(${userDetails.header})` }}
                        ></div>
                        {userDetails.avatar === '' ? (
                            <div className='user-gallery-avatar'>
                                <span
                                    className='user-gallery-avatar-inner'
                                    style={{ background: `url(/images/astronaut.png)` }}
                                ></span>
                            </div>
                        ) : (
                            <div className='user-gallery-avatar'>
                                <span
                                    className='user-gallery-avatar-inner'
                                    style={{ background: `url(${userDetails.avatar})` }}
                                ></span>
                            </div>
                        )}
                    </div>
                    <div className='pt-5 text-center'>
                        <h1 className='h4 mb-0 d-flex align-items-center justify-content-center'>
                            {userDetails && userDetails.fullName}
                            {isTopSeller && (
                                <span className='bg-primary badge mb-0 ms-2 text-xxs'>
                                    <i className='las la-trophy me-1 text-xxs'></i>
                                    Meilleur vendeur
                                </span>
                            )}
                        </h1>
                        <p className='text-muted mb-1'>{userDetails.role}</p>
                        <ul className='list-inline mb-0'>
                            {userDetails && userDetails.facebook !== '' && (
                                <li className='list-inline-item'>
                                    <a
                                        href={userDetails.facebook}
                                        rel='noopener noreferrer'
                                        className='user-social-link'
                                        target='_blank'
                                    >
                                        <i className='lab la-facebook-f'></i>
                                    </a>
                                </li>
                            )}
                            {userDetails && userDetails.twitter !== '' && (
                                <li className='list-inline-item'>
                                    <a
                                        href={userDetails.twitter}
                                        rel='noopener noreferrer'
                                        className='user-social-link'
                                        target='_blank'
                                    >
                                        <i className='lab la-twitter'></i>
                                    </a>
                                </li>
                            )}
                            {userDetails && userDetails.instagram !== '' && (
                                <li className='list-inline-item'>
                                    <a
                                        href={userDetails.instagram}
                                        rel='noopener noreferrer'
                                        className='user-social-link'
                                        target='_blank'
                                    >
                                        <i className='lab la-instagram'></i>
                                    </a>
                                </li>
                            )}
                            {userDetails && userDetails.dribbble !== '' && (
                                <li className='list-inline-item'>
                                    <a
                                        href={userDetails.dribbble}
                                        rel='noopener noreferrer'
                                        className='user-social-link'
                                        target='_blank'
                                    >
                                        <i className='lab la-dribbble'></i>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className='py-5'>
                        <div className='row'>
                            <div className='col-lg-5 mx-auto'>
                                <div className='toggle-nav'>
                                    <button
                                        className={`toggle-nav-btn flex-fill ${
                                            isNavSelected === 'created' ? 'active' : null
                                        }`}
                                        onClick={() => setIsNavSelected('created')}
                                    >
                                        Créée
                                    </button>
                                    <button
                                        className={`toggle-nav-btn flex-fill ${
                                            isNavSelected === 'collected' ? 'active' : null
                                        }`}
                                        onClick={() => setIsNavSelected('collected')}
                                    >
                                        Propriétaire
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='pt-5'>
                        {collectionCtx.collection.length !== 0 &&
                            collectionCtx.totalSupply !== '0' &&
                            isNavSelected === 'created' &&
                            allCollection &&
                            createdAssets && (
                                <>
                                    <div className='row mb-4'>
                                        <div className='col-lg-7'>
                                            <h2>NFT créés par {userDetails.fullName}</h2>
                                            <p className='lead text-muted'>
                                                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='row gy-4 mb-5 align-items-stretch'>
                                        {allCollection
                                            .filter(
                                                (nft) =>
                                                    !auctionCtx.auctions
                                                        .filter((auc) => auc.isActive === true)
                                                        .some((auc) => nft.id === auc.tokenId)
                                            )
                                            .filter((asset) =>
                                                createdAssets.some((item) => asset.id === parseInt(item))
                                            )
                                            .map((NFT, key) => {
                                                return (
                                                    <div className={`col-xl-4 col-md-6 ${NFT.category}`} key={key}>
                                                        <NftItem {...NFT} />
                                                    </div>
                                                );
                                            })}

                                        {auctionCtx.auctionsData
                                            .filter((auc) => auc.active === true)
                                            .filter((asset) =>
                                                createdAssets.some((item) => asset.tokenId === parseInt(item))
                                            )
                                            .map((AUC, key) => {
                                                return (
                                                    <div className='col-xl-4 col-md-6' key={key}>
                                                        <AuctionItem {...AUC} nftKey={key} />
                                                    </div>
                                                );
                                            })}

                                        {collectionCtx.collection.filter((asset) =>
                                            createdAssets.some((item) => asset.id === parseInt(item))
                                        ).length === 0 && <h4>{userDetails.fullName} n'a pas créé de NFT</h4>}
                                    </div>
                                </>
                            )}

                        {collectionCtx.collection.length !== 0 &&
                            collectionCtx.totalSupply !== '0' &&
                            isNavSelected === 'collected' &&
                            allCollection &&
                            createdAssets && (
                                <>
                                    <div className='row mb-4'>
                                        <div className='col-lg-7'>
                                            <h2>NFT détenus par {userDetails.fullName}</h2>
                                            <p className='lead text-muted'>
                                                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                                            </p>
                                        </div>
                                    </div>
                                    <div className='row gy-4 mb-5 align-items-stretch'>
                                        {allCollection
                                            .filter((asset) => asset.owner === address)
                                            .map((NFT, key) => {
                                                return (
                                                    <div className={`col-xl-4 col-md-6 ${NFT.category}`} key={key}>
                                                        <NftItem {...NFT} />
                                                    </div>
                                                );
                                            })}

                                        {auctionCtx.auctionsData
                                            .filter((auc) => auc.active === true)
                                            .filter((asset) => asset.user === address)
                                            .map((AUC, key) => {
                                                return (
                                                    <div className='col-xl-4 col-md-6' key={key}>
                                                        <AuctionItem {...AUC} nftKey={key} />
                                                    </div>
                                                );
                                            })}

                                        {collectionCtx.collection.filter((asset) => asset.user === address).length +
                                            collectionCtx.collection.filter((asset) => asset.owner === address)
                                                .length ===
                                            0 && <h4>{userDetails.fullName} ne possède pas de NFT</h4>}
                                    </div>
                                </>
                            )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default UserGalleryPage;
