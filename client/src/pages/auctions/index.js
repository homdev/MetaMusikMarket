import React from 'react';
import { Link } from 'react-router-dom';

// HOOKS
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import AuctionItem from '../../components/general/AuctionItem';
import Loader from '../../components/general/Loader';

function AuctionsPage() {
    const collectionCtx = useCollection();
    const auctionCtx = useAuctions();

    return (
        <>
            {auctionCtx.fetchingLoading ? <FullScreenLoader heading='Mise à jour des enchères' /> : null}
            {collectionCtx.nftIsLoading ? <FullScreenLoader heading="Recherche d'enchère" /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            <PageBanner heading='Enchère en cours' />
            <section className='py-5'>  
                <div className='container py-5'>
                    {auctionCtx.auctionsData.filter((auc) => auc.isPromoted).length > 0 && (
                        <>
                            <header className='mb-4'>
                                <div className='row'>
                                    <div className='col-lg-7 text-center mx-auto'>
                                        <h2 data-aos='fade-up' data-aos-delay='100'>
                                        Nos ventes aux enchères en vedette
                                        </h2>
                                        <p className='lead text-muted' data-aos='fade-up' data-aos-delay='200'>
                                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus autem, atque
                                            expedita aut sunt.
                                        </p>
                                    </div>
                                </div>
                            </header>

                            <div className='row gy-4 mb-5 align-items-stretch justify-content-center pb-5'>
                                {auctionCtx.auctionsData
                                    .filter((auc) => auc.active === true)
                                    .filter((auc) => auc.isPromoted === true)
                                    .map((AUC, key) => {
                                        return (
                                            <div className={`col-xl-4 col-md-6 ${AUC.category}`} key={AUC.tokenId}>
                                                <AuctionItem {...AUC} nftKey={key} />
                                            </div>
                                        );
                                    })}
                            </div>
                        </>
                    )}

                    <header className='mb-4'>
                        <div className='row'>
                            <div className='col-lg-7'>
                                <h2 data-aos='fade-up' data-aos-delay='100'>
                                Toutes les ventes aux enchères
                                </h2>
                                <p className='lead text-muted' data-aos='fade-up' data-aos-delay='200'>
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus autem, atque
                                    expedita aut sunt.
                                </p>
                            </div>
                        </div>
                    </header>

                    <div className='row gy-4 mb-5 align-items-stretch'>
                        {auctionCtx.auctionsData
                            .filter((auc) => auc.active === true)
                            .map((AUC, key) => {
                                return (
                                    <div className={`col-xl-4 col-md-6 ${AUC.category}`} key={AUC.tokenId}>
                                        <AuctionItem {...AUC} nftKey={key} />
                                    </div>
                                );
                            })}
                    </div>

                    {auctionCtx.auctionsData.filter((auc) => auc.cancellded !== true && auc.active !== false).length ===
                        0 &&
                        !auctionCtx.fetchingLoading && (
                            <>
                                <h4>Il n'y a pas d'enchères en ce moment</h4>
                                <p className='text-muted mb-3'>
                                    Once there'll be Auctions that match is category we'll render them here
                                </p>
                                <Link className='btn btn-gradient-primary' to='/'>
                                Retour à l'accueil
                                </Link>
                            </>
                        )}

                    {auctionCtx.auctions.length === 0 && auctionCtx.auctionsData.length !== 0 && <Loader />}
                </div>
            </section>
        </>
    );
}

export default AuctionsPage;
