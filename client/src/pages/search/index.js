import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-dropdown-select';
import { truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import FullScreenLoader from '../../components/general/FullScreenLoader';
import NftItem from '../../components/general/NftItem';
import AuctionItem from '../../components/general/AuctionItem';

// SEARCH OPTIONS
const searchOptions = [
    { label: 'NFTs', value: 'collection' },
    { label: 'Utilisateurs', value: 'users' },
    { label: 'Ventes aux enchères', value: 'auctions' },
];

function SearchPage() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();
    const auctionCtx = useAuctions();

    const [isSearched, setIsSearched] = useState('collection');
    const [query, setQuery] = useState('');
    const [searchResultsLength, setSearchResultsLength] = useState(0);

    /*** ----------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ----------------------------------------- */
    useEffect(() => {
        document.title = `Search Assets | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    /*** ----------------------------------------- */
    //      CHOOSE WHAT TYPE OF DATA TO SEARCH
    /*** ----------------------------------------- */
    const dataToBeSearched = useMemo(() => {
        if (isSearched === 'collection') {
            return collectionCtx.collection.filter(
                (nft) =>
                    !auctionCtx.auctions.filter((auc) => auc.isActive === true).some((auc) => nft.id === auc.tokenId)
            );
        } else if (isSearched === 'users') {
            return userCtx.usersList;
        } else if (isSearched === 'auctions') {
            return auctionCtx.auctionsData.filter((auc) => auc.active === true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearched, collectionCtx.collection, userCtx.usersList, auctionCtx.auctionsData]);

    /*** ----------------------------------------- */
    //      SEARCH ACCORDING TO DATA CHOSEN
    /*** ----------------------------------------- */
    useEffect(() => {
        if (isSearched === 'collection') {
            setSearchResultsLength(
                dataToBeSearched.filter((nft) => {
                    if (nft.title.toLowerCase().includes(query.toLowerCase().trim())) {
                        return nft;
                    }
                    return false;
                }).length
            );
        } else if (isSearched === 'users' && userCtx.usersList) {
            setSearchResultsLength(
                dataToBeSearched.filter((user) => {
                    if (user.fullName.toLowerCase().includes(query.toLowerCase().trim())) {
                        return user;
                    }
                    return false;
                }).length
            );
        } else if (isSearched === 'auctions' && userCtx.usersList) {
            setSearchResultsLength(
                dataToBeSearched.filter((auc) => {
                    if (auc.title.toLowerCase().includes(query.toLowerCase().trim())) {
                        return auc;
                    }
                    return false;
                }).length
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, dataToBeSearched, isSearched]);

    return (
        <>
            {collectionCtx.collection.length === 0 ? <FullScreenLoader heading='Loading' /> : null}
            <section className='pt-5 position-relative page-banner'>
                <div className='container py-4 mt-5 z-index-20'>
                    <div className='row align-items-center'>
                        <div className='col-xl-7'>
                            <h1 data-aos='fade-right' data-aos-delay='100'>
                                Hmmmm... Que cherchez-vous ?
                            </h1>
                            <p className='text-muted mb-4' data-aos='fade-right' data-aos-delay='200'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae esse quis
                                sed,necessitatibus nostrum mollitia.
                            </p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className='mb-4'
                                data-aos='fade-up'
                                data-aos-delay='300'
                            >
                                <div
                                    className='bg-white rounded-lg py-1 ps-1 pe-4 position-relative'
                                    style={{
                                        border:
                                            marketplaceCtx.themeMode === 'light'
                                                ? '2px solid #e9ecef'
                                                : '2px solid #282830',
                                    }}
                                >
                                    <div className='input-icon pe-5'>
                                        <div className='input-icon-text' style={{ top: '0.8rem' }}>
                                            <i className='text-primary las la-search'></i>
                                        </div>
                                        <input
                                            className='form-control bg-none form-control-lg shadow-0 py-2 border-0'
                                            type='search'
                                            autoComplete='off'
                                            name='search'
                                            placeholder={
                                                isSearched === 'collection'
                                                    ? 'Recherchez nos NFTs...'
                                                    : isSearched === 'users'
                                                    ? 'Recherchez nos utilisateurs...'
                                                    : 'Rechercher dans nos ventes aux enchères...'
                                            }
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                        />
                                    </div>
                                    <Select
                                        searchable={false}
                                        options={searchOptions}
                                        placeholder='NFTs'
                                        className='form-select search-form-select ps-4 border-gray-300 shadow-0 bg-white fw-bold'
                                        value={isSearched}
                                        onChange={(values) => {
                                            setIsSearched(values.map((el) => el.value).toString());
                                            setQuery('');
                                        }}
                                    />
                                </div>
                            </form>
                            {query !== '' && searchResultsLength > 0 ? (
                                <p className='lead text-muted mb-0'>
                                    il y a <strong className='text-dark fw-bold mx-2'>{searchResultsLength}</strong>{' '}
                                    articles correspondant à votre recherche
                                </p>
                            ) : null}

                            {query.trim() !== '' && searchResultsLength === 0 ? (
                                <div className='d-flex'>
                                    <i className='las la-exclamation mb-2' style={{ fontSize: '3rem' }}></i>
                                    <div className='ms-2'>
                                        <h3 className='h3'>Aucun actif ne correspond à votre recherche</h3>
                                        <p className='text-muted mb-0'>Vous pouvez rechercher un autre terme...</p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className='col-lg-5 d-none d-lg-block' data-aos='fade-left' data-aos-delay='150'>
                            <img src='/images/Canvas.png' className='img-fluid' alt='' />
                        </div>
                    </div>
                </div>
            </section>

            <section className={`pb-5 ${marketplaceCtx.themeMode === 'dark' && 'bg-light'}`}>
                <div className='container pb-5'>
                    <div className='row gy-4'>
                        {isSearched === 'collection' &&
                            dataToBeSearched
                                .filter((nft) => {
                                    if (query === '') {
                                        return false;
                                    } else if (nft.title.toLowerCase().includes(query.toLowerCase().trim())) {
                                        return nft;
                                    }
                                    return false;
                                })
                                .map((NFT, key) => {
                                    return (
                                        <div className={`col-xl-4 col-md-6 ${NFT.category}`} key={key}>
                                            <NftItem {...NFT} />
                                        </div>
                                    );
                                })}

                        {isSearched === 'users' &&
                            userCtx.usersList &&
                            userCtx.usersList
                                .filter((user) => {
                                    if (query === '') {
                                        return false;
                                    } else if (user.fullName.toLowerCase().includes(query.toLowerCase().trim())) {
                                        return user;
                                    }
                                    return false;
                                })
                                .map((user, index) => {
                                    return (
                                        <Link
                                            to={`/users/${user.account}`}
                                            className='col-xl-3 col-lg-4 col-md-6'
                                            key={index}
                                        >
                                            <div className='card bd-3 shadow card-hover-minimal border-0 position-relative rounded-pill text-dark'>
                                                <div className='card-body'>
                                                    <div className='d-flex align-items-center'>
                                                        <div className='author-avatar author-avatar-md'>
                                                            <span
                                                                className='author-avatar-inner'
                                                                style={{
                                                                    background: `url(${
                                                                        user.avatar === ''
                                                                            ? '/images/astronaut.png'
                                                                            : user.avatar
                                                                    })`,
                                                                }}
                                                            ></span>
                                                        </div>

                                                        <div className='ms-3'>
                                                            <h3 className='h6 mb-1 text-capitalize text-reset'>
                                                                {truncateStart(user.fullName, 10)}
                                                            </h3>
                                                            <p className='text-sm text-muted mb-0'>
                                                                {user.role === '' ? 'Member' : user.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}

                        {isSearched === 'auctions' &&
                            auctionCtx.auctionsData
                                .filter((auc) => {
                                    if (query === '') {
                                        return false;
                                    } else if (auc.title.toLowerCase().includes(query.toLowerCase().trim())) {
                                        return auc;
                                    }
                                    return false;
                                })
                                .filter((auc) => auc.active === true)
                                .map((AUC, key) => {
                                    return (
                                        <div className={`col-xl-4 col-md-6 ${AUC.category}`} key={AUC.tokenId}>
                                            <AuctionItem {...AUC} nftKey={key} />
                                        </div>
                                    );
                                })}
                    </div>
                </div>
            </section>
        </>
    );
}

export default SearchPage;
