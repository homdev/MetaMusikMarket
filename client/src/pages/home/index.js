import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore, { Navigation } from 'swiper';
import { categoryOptions } from '../../helpers/constants';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import HomeBanner from './HomeBanner';
import NftItem from '../../components/general/NftItem';
import AuctionItem from '../../components/general/AuctionItem';
import NoDataAlert from '../../components/general/NoDataAlert';
import TopSellers from './TopSellers';
import Loader from '../../components/general/Loader';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';

SwiperCore.use([Navigation]);

function HomePage({ topSellers }) {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    /*** ---------------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ---------------------------------------------- */
    useEffect(() => {
        document.title = settings.UISettings.marketplaceBrandName;
    }, []);

    return (
        <>
            <HomeBanner />
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}

            {/* MARKETPLACE FEATURED ITEMS */}
            <section className='pb-5'>
                <div className='container pb-5'>
                    <header className='mb-4'>
                        <div className='row'>
                            <div className='col-lg-6 mx-auto text-center'>
                                <h2 data-aos='fade-up' data-aos-delay='100'>
                                    À l'affiche ce mois-ci
                                </h2>
                                <p className='text-muted lead mb-0' data-aos='fade-up' data-aos-delay='200'>
                                    Nous sommes ravis de partager nos dix jetons non fongibles préférés ce mois-ci !
                                </p>
                            </div>
                        </div>
                    </header>

                    {collectionCtx.totalSupply === '0' && !collectionCtx.nftIsLoading ? (
                        <div className='col-lg-9 mx-auto'>
                            <NoDataAlert
                                heading="Il n'y a pas de NFT pour le moment."
                                subheading='Essayez de monnayer certains actifs pour voir comment nous les rendons.'
                                customClass='justify-content-center'
                                aos='fade-up'
                                aosDelay='300'
                            />
                        </div>
                    ) : null}

                    {collectionCtx.collection.length === 0 && collectionCtx.totalSupply !== '0' ? <Loader /> : null}

                    <Swiper
                        spaceBetween={0}
                        breakpoints={{
                            768: { slidesPerView: 1 },
                            900: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                            1400: { slidesPerView: 3 },
                        }}
                        navigation={Boolean(collectionCtx.collection.length !== 0)}
                    >
                        {collectionCtx.collection
                            .filter(
                                (nft) =>
                                    !auctionCtx.auctions
                                        .filter((auc) => auc.isActive === true)
                                        .some((auc) => nft.id === auc.tokenId)
                            )
                            .filter((nft) => nft.isPromoted === true)
                            .map((NFT, key) => {
                                return (
                                    <SwiperSlide key={key} className='pt-4 pb-5 px-3'>
                                        <NftItem {...NFT} />
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
            </section>

            {/* BROWSE BY CATEGORY */}
            <section className='py-5 bg-light'>
                <div className='container py-4'>
                    <header className='mb-5'>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <h2 data-aos='fade-up' data-aos-delay='100'>
                                    Catégories
                                </h2>
                                <p className='text-muted lead mb-0' data-aos='fade-up' data-aos-delay='200'>
                                    Parcourez les tendances ou trouvez les NFT les plus rares par catégorie.
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className='row gy-4'>
                        {categoryOptions.map((el, i) => {
                            return (
                                <div
                                    className='col-xl-2 col-lg-4 col-6'
                                    key={i}
                                    data-aos='fade-left'
                                    data-aos-delay={(i + 1) * 100}
                                >
                                    <div className='card card-hover-minimal border-0 rounded-xl htw-card'>
                                        <div className='card-body text-center py-4'>
                                            <i
                                                className={`text-primary mb-2 ${el.icon}`}
                                                style={{ fontSize: '2rem' }}
                                            ></i>
                                            <Link className='text-reset stretched-link' to={`/categories/${el.value}`}>
                                                <h6 className='fw-normal'>{el.label}</h6>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* NFT ITEMS */}
            <section className='py-5 position-relative'>
                <div className='container pt-5'>
                    <header className='mb-4'>
                        <div className='row'>
                            <div className='col-lg-6 mx-auto text-center'>
                                <h2 data-aos='fade-up' data-aos-delay='100'>
                                    Nouveauté
                                </h2>
                                <p className='text-muted lead mb-0' data-aos='fade-up' data-aos-delay='200'>
                                    Découvrez les derniers NFTs ajoutés sur la plateforme.
                                </p>
                            </div>
                        </div>
                    </header>

                    {collectionCtx.totalSupply === '0' && !collectionCtx.nftIsLoading ? (
                        <div className='col-lg-9 mx-auto'>
                            <NoDataAlert
                                heading="Il n'y a pas de NFT pour le moment."
                                subheading='Essayez de monnayer certains actifs pour voir comment nous les rendons.'
                                customClass='justify-content-center'
                                aos='fade-up'
                                aosDelay='300'
                            />
                        </div>
                    ) : null}

                    {collectionCtx.collection.length === 0 && collectionCtx.totalSupply !== '0' ? <Loader /> : null}

                    <Swiper
                        spaceBetween={0}
                        breakpoints={{
                            768: { slidesPerView: 1 },
                            900: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                            1400: { slidesPerView: 3 },
                        }}
                        navigation={Boolean(collectionCtx.collection.length !== 0)}
                    >
                        {collectionCtx.collection
                            .filter(
                                (nft) =>
                                    !auctionCtx.auctions
                                        .filter((auc) => auc.isActive === true)
                                        .some((auc) => nft.id === auc.tokenId)
                            )
                            .filter((nft) => nft.isApproved === true)
                            .sort((a, b) => b.dateCreated - a.dateCreated)
                            .slice(0, 8)
                            .map((NFT, key) => {
                                return (
                                    <SwiperSlide key={key} className='pt-4 pb-5 px-3'>
                                        <NftItem {...NFT} />
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
                {marketplaceCtx.themeMode === 'dark' && <div className='glow'></div>}
            </section>

            <TopSellers
                topSellers={topSellers}
                title='Meilleurs vendeurs'
                description='Les auteurs NFT les plus vendus sur notre place de marché.'
            />

            <section className='py-5 bg-light'>
                <div className='container py-5'>
                    <div className='row gy-5 align-items-center'>
                        <div className='col-lg-6'>
                            <h2 data-aos='fade-right' data-aos-delay='100'>
                                Comment cela fonctionne-t-il ?
                            </h2>
                            <p className='text-muted lead mb-4' data-aos='fade-up' data-aos-delay='200'>
                                Vous pouvez acheter, vendre et échanger des NFTs sur la plateforme.
                            </p>

                            <div className='d-flex mb-4' data-aos='fade-right' data-aos-delay='150'>
                                <div className='icon-animated rounded-xl bg-primary mx-auto flex-shrink-0'>
                                    <i className='las la-wallet text-white'></i>
                                </div>
                                <div className='ms-3'>
                                    <h5>Connectez votre portefeuille</h5>
                                    <p className='text-muted text-sm mb-0'>
                                        MetaMask est une extension de navigateur facile à utiliser qui vous permet de vous interfacer avec des applications Ethereum comme Metamusik.
                                    </p>
                                </div>
                            </div>
                            <div className='mb-4 d-flex' data-aos='fade-right' data-aos-delay='200'>
                                <div className='icon-animated mx-auto rounded-xl bg-primary flex-shrink-0'>
                                    <i className='las la-rocket text-white'></i>
                                </div>
                                <div className='ms-3'>
                                    <h5>Monnaie et achat et vente de NFT</h5>
                                    <p className='text-muted text-sm mb-2'>
                                    Les NFT peuvent représenter n'importe quoi, de l'art à la musique en passant par les objets de collection et bien d'autres choses encore. Les NFT
                                    vous permettent de posséder des objets numériques de la même manière que des objets
                                    physiques, comme des cartes à collectionner ou des timbres.
                                    </p>
                                </div>
                            </div>
                            <div className='mb-0 d-flex' data-aos='fade-right' data-aos-delay='250'>
                                <div className='icon-animated mx-auto rounded-xl bg-primary flex-shrink-0'>
                                    <i className='lab la-ethereum text-white'></i>
                                </div>
                                <div className='ms-3'>
                                    <h5>Achat et transfert</h5>
                                    <p className='text-muted text-sm mb-0'>
                                    Lorsque les acheteurs achètent le jeton NFT, celui-ci leur est automatiquement transféré par la place de marché.
                                    la place de marché.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-5 ms-auto' data-aos='fade-left' data-aos-delay='100'>
                            <img src='/store.png' alt='Illustration' className='img-fluid w-100' />
                        </div>
                    </div>
                </div>
            </section>

            {/* RECENT AUCTIONS */}
            <section className='py-5'>
                <div className='container py-5'>
                    <header className='mb-4'>
                        <div className='row'>
                            <div className='col-lg-6 mx-auto text-center'>
                                <h2 data-aos='fade-up' data-aos-delay='100'>
                                    Enchères récentes
                                </h2>
                                <p className='text-muted lead mb-0' data-aos='fade-up' data-aos-delay='200'>
                                    Obtenez cette rare édition limitée avant que quelqu'un d'autre ne le fasse !
                                </p>
                            </div>
                        </div>
                    </header>

                    {auctionCtx.auctionsData.filter((auc) => auc.active === true).length === 0 &&
                    !collectionCtx.nftIsLoading ? (
                        <div className='col-lg-9 mx-auto'>
                            <NoDataAlert
                                heading="Il n'y a pas d'enchères en ce moment."
                                subheading="Une fois que quelqu'un a créé une enchère, vous devriez la trouver ici."
                                customClass='justify-content-center'
                                aos='fade-up'
                                aosDelay='300'
                            />
                        </div>
                    ) : null}

                    {collectionCtx.nftIsLoading ? <Loader /> : null}

                    <Swiper
                        spaceBetween={0}
                        breakpoints={{
                            768: { slidesPerView: 1 },
                            900: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                            1400: { slidesPerView: 3 },
                        }}
                        navigation={Boolean(auctionCtx.auctionsData.filter((auc) => auc.active === true).length !== 0)}
                    >
                        {auctionCtx.auctionsData
                            .filter((auc) => auc.active === true)
                            .map((AUC, key) => {
                                return (
                                    <SwiperSlide key={key} className='pt-4 pb-5 px-3'>
                                        <AuctionItem {...AUC} nftKey={key} />
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
            </section>
        </>
    );
}

export default HomePage;
