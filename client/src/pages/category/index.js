import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatCategory } from '../../helpers/utils';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import NftItem from '../../components/general/NftItem';
import AuctionItem from '../../components/general/AuctionItem';
import Loader from '../../components/general/Loader';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';

function CategoryPage() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const [currentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const { category } = useParams();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = collectionCtx.collection.slice(indexOfFirstItem, indexOfLastItem);

    /*** ------------------------------------------------ */
    //      CHANGE PAGE TITLE
    /*** ------------------------------------------------ */
    useEffect(() => {
        document.title = `${formatCategory(category)} | ${settings.UISettings.marketplaceBrandName}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {auctionCtx.fetchingLoading ? <FullScreenLoader heading='Loading' /> : null}
            {auctionCtx.auctionTransactionLoading ? <FullScreenLoader heading='loading' /> : null}
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='loading' /> : null}
            {collectionCtx.nftTransactionLoading ? <MetaMaskLoader /> : null}
            <PageBanner heading={`${formatCategory(category)} NFTs`} />
            <section className='py-5'>
                <div className='container py-5'>
                    {collectionCtx.collection.length !== 0 && collectionCtx.totalSupply !== '0' ? (
                        <div className='row gy-4 mb-5'>
                            {currentItems
                                .filter(
                                    (nft) =>
                                        !auctionCtx.auctions
                                            .filter((auc) => auc.isActive === true)
                                            .some((auc) => nft.id === auc.tokenId)
                                )
                                .filter((el) => el.isApproved)
                                .filter((el) => el.category === category)
                                .map((NFT, key) => {
                                    return (
                                        <div className={`col-xl-4 col-md-6 mix ${NFT.category}`} key={key}>
                                            <NftItem {...NFT} />
                                        </div>
                                    );
                                })}

                            {auctionCtx.auctionsData
                                .filter((auc) => auc.active === true && auc.category === category)
                                .map((AUC, key) => {
                                    return (
                                        <div className='col-xl-4 col-md-6' key={key}>
                                            <AuctionItem {...AUC} nftKey={key} />
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <>
                            <h6 className='fw-normal text-muted text-center mb-0'>
                                Fetching data from the blockchain please wait...
                            </h6>
                            <Loader />
                        </>
                    )}
                    {currentItems.filter((el) => el.category === category).filter((el) => el.isApproved).length === 0 &&
                        collectionCtx.collection.length !== 0 &&
                        collectionCtx.totalSupply !== '0' && (
                            <div className='text-center'>
                                <h4 className='text-center'>There're no NFTs at the moment</h4>
                                <p className='text-muted mb-3'>
                                    Once there'll be NFTs that match is category we'll render them here
                                </p>
                                <Link className='btn btn-gradient-primary' to='/'>
                                    Return Home
                                </Link>
                            </div>
                        )}
                </div>
            </section>
        </>
    );
}

export default CategoryPage;
