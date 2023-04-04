import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categorySelectBox } from '../../helpers/constants';
import { settings } from '../../helpers/settings';
import Select from 'react-dropdown-select';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import NftItem from '../../components/general/NftItem';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import FullScreenLoader from '../../components/general/FullScreenLoader';

// SELECT OPTIONS
const priceOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Seulement en vente', value: 'saleOnly' },
    { label: 'Pas à vendre', value: 'notForSale' },
];

const sorting = [
    { label: 'Le plus récent', value: 'newest' },
    { label: 'Le plus ancien', value: 'oldest' },
    { label: 'Prix le plus élevé', value: 'highPrice' },
    { label: 'Prix le plus bas', value: 'lowPrice' },
];

function ExplorePage() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const [baseFilter, setBaseFilter] = useState('all');
    const [sortFilter, setSortFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [withPriceCollection, setWithPriceCollection] = useState([]);
    const [renderedItems, setRenderedItems] = useState(9);

    /*** =============================================== */
    //      CHANGE PAGE TITLE
    /*** =============================================== */
    useEffect(() => {
        document.title = `Explore NFTs | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    /*** =============================================== */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** =============================================== */
    useEffect(() => {
        if (marketplaceCtx.contract && collectionCtx.contract && collectionCtx.collection.length > 0) {
            setWithPriceCollection(collectionCtx.collection);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        marketplaceCtx.offers,
        collectionCtx.contract,
        marketplaceCtx.contract,
        collectionCtx.collection,
        auctionCtx.auctions,
    ]);

    /*** =============================================== */
    //      GET BASE CATEGORIES
    /*** =============================================== */
    const baseExploreItems = useMemo(() => {
        if (baseFilter === 'all') {
            return collectionCtx.collection
                .filter((nft) => nft.isApproved === true)
                .filter(
                    (nft) =>
                        !auctionCtx.auctions
                            .filter((auc) => auc.isActive === true)
                            .some((auc) => nft.id === auc.tokenId)
                );
        } else {
            return collectionCtx.collection
                .filter((item) => item.category === baseFilter)
                .filter(
                    (nft) =>
                        !auctionCtx.auctions
                            .filter((auc) => auc.isActive === true)
                            .some((auc) => nft.id === auc.tokenId)
                )
                .filter((nft) => nft.isApproved === true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        priceFilter,
        sortFilter,
        baseFilter,
        collectionCtx.collection,
        withPriceCollection,
        auctionCtx.auctions,
        auctionCtx.auctionsData,
    ]);

    /*** =============================================== */
    //      FORMATE ACCORDING TO SALE STATUS
    /*** =============================================== */
    const priceFilteredItems = useMemo(() => {
        if (priceFilter === 'saleOnly') {
            return baseExploreItems.filter((item) => item.hasOffer);
        } else if (priceFilter === 'notForSale') {
            return baseExploreItems.filter((item) => !item.hasOffer);
        } else {
            return baseExploreItems;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseFilter, sortFilter, priceFilter, baseExploreItems, collectionCtx.collection]);

    /*** =============================================== */
    //      SORTING COLLECTION
    /*** =============================================== */
    const updatedExploreItems = useMemo(() => {
        if (sortFilter === 'newest') {
            return priceFilteredItems.sort((a, b) => {
                return new Date(b.dateCreated) - new Date(a.dateCreated);
            });
        } else if (sortFilter === 'oldest') {
            return priceFilteredItems.sort((a, b) => {
                return new Date(a.dateCreated) - new Date(b.dateCreated);
            });
        } else if (sortFilter === 'highPrice') {
            return withPriceCollection
                .filter((x) => priceFilteredItems.some((y) => x.id === y.id))
                .filter((el) => el.price > 0)
                .sort((a, b) => {
                    return b.price - a.price;
                });
        } else if (sortFilter === 'lowPrice') {
            return withPriceCollection
                .filter((x) => priceFilteredItems.some((y) => x.id === y.id))
                .filter((el) => el.price > 0)
                .sort((a, b) => {
                    return a.price - b.price;
                });
        } else {
            return priceFilteredItems;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortFilter, priceFilteredItems, priceFilter, baseExploreItems]);

    return (
        <>
            {auctionCtx.fetchingLoading ? <FullScreenLoader heading='Mise à jour des NFT' /> : null}
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='Récupération des NFT' /> : null}
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            <PageBanner heading={'Explorer tous les NFT'} />
            <section className='py-5'>
                {/* FILTER CONTROLS */}
                <div className='container pt-5'>
                    {collectionCtx.collection.length !== 0 && collectionCtx.totalSupply !== '0' && (
                        <header className='mb-2'>
                            <ul className='list-inline mb-0'>
                                <li className='list-inline-item mb-3 me-3'>
                                    <p className='text-sm fw-bold pe-lg-4 mb-3'>Filtrer par catégorie</p>
                                    <div className='input-icon flex-nowrap category-select'>
                                        <div className='input-icon-text bg-none'>
                                            <i className='las la-icons text-primary z-index-20'></i>
                                        </div>
                                        <Select
                                            searchable={false}
                                            options={categorySelectBox}
                                            className='form-select rounded-xl border-gray-300 shadow-0 bg-white'
                                            value={baseFilter}
                                            onChange={(values) => {
                                                setBaseFilter(values.map((el) => el.value).toString());
                                            }}
                                        />
                                    </div>
                                </li>
                                <li className='list-inline-item mb-3 me-3'>
                                    <p className='text-sm fw-bold pe-lg-4 mb-3'>Filtrer par prix</p>
                                    <div className='input-icon flex-nowrap category-select'>
                                        <div className='input-icon-text bg-none'>
                                            <i className='lab la-ethereum text-primary z-index-20'></i>
                                        </div>
                                        <Select
                                            searchable={false}
                                            options={priceOptions}
                                            className='form-select rounded-xl border-gray-300 shadow-0 bg-white'
                                            value={priceFilter}
                                            onChange={(values) =>
                                                setPriceFilter(values.map((el) => el.value).toString())
                                            }
                                        />
                                    </div>
                                </li>
                                <li className='list-inline-item mb-3'>
                                    <p className='text-sm fw-bold pe-lg-4 mb-3'>Trier par</p>
                                    <div className='input-icon flex-nowrap category-select'>
                                        <div className='input-icon-text bg-none'>
                                            <i className='lab la-ethereum text-primary z-index-20'></i>
                                        </div>
                                        <Select
                                            searchable={false}
                                            options={sorting}
                                            className='form-select rounded-xl border-gray-300 shadow-0 bg-white'
                                            value={sortFilter}
                                            onChange={(values) =>
                                                setSortFilter(values.map((el) => el.value).toString())
                                            }
                                        />
                                    </div>
                                </li>
                            </ul>
                        </header>
                    )}

                    {collectionCtx.collection.length !== 0 && collectionCtx.totalSupply !== '0' ? (
                        <>
                            <div className='row gy-4 mb-5 align-items-stretch'>
                                {updatedExploreItems.slice(0, renderedItems).map((NFT, key) => {
                                    return (
                                        <div className={`col-xl-4 col-md-6 ${NFT.category}`} key={NFT.id}>
                                            <NftItem {...NFT} noAnimation={true} />
                                        </div>
                                    );
                                })}
                            </div>
                            {updatedExploreItems.length > renderedItems && (
                                <div className='text-center pt-4'>
                                    <button
                                        className='btn btn-dark'
                                        type='button'
                                        onClick={() => setRenderedItems(renderedItems + 3)}
                                    >
                                        En savoir plus
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className='text-center'>
                                <h4 className='text-center'>Il n'y a pas de NFT pour le moment</h4>
                                <p className='text-muted mb-3'>Une fois que vous avez créé un NFT, nous le rendrons ici.</p>
                                <Link className='btn btn-gradient-primary mb-5' to='/mint'>
                                    Créer un NFT
                                </Link>
                            </div>
                        </>
                    )}

                    {collectionCtx.collection.length !== 0 &&
                        collectionCtx.totalSupply !== '0' &&
                        updatedExploreItems.length === 0 && (
                            <h4 className='text-center'>Aucun NFT ne correspond à votre filtre</h4>
                        )}
                </div>
            </section>
        </>
    );
}

export default ExplorePage;
