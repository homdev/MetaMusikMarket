import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formteFullDate, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useAnalytics from '../../hooks/useAnalytics';

// COMPONENTS
import ImageCpt from '../../components/general/ImageCpt';

function TransactionsTable() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();

    const [transactions, setTransactions] = useState(null);
    const [marketplaceAddress, setMarketplaceAddress] = useState('');
    const [auctionContractAddress, setAuctionContractAddress] = useState('');

    /*** =============================================== */
    //      GET CONTRACT ADDRESS
    /*** =============================================== */
    useEffect(() => {
        if (marketplaceCtx.contract) {
            setMarketplaceAddress(marketplaceCtx.contract.options.address);
        }
    }, [marketplaceCtx.contract]);

    /*** =============================================== */
    //      GET CONTRACT ADDRESS
    /*** =============================================== */
    useEffect(() => {
        if (auctionCtx.contract) {
            setAuctionContractAddress(auctionCtx.contract.options.address);
        }
    }, [auctionCtx.contract]);

    /*** =============================================== */
    //      GET TRANSACTIONS
    /*** =============================================== */
    useEffect(() => {
        if (analyticsCtx.transactions && analyticsCtx.contract) {
            setTransactions(analyticsCtx.transactions);
        }
    }, [analyticsCtx.transactions, analyticsCtx.contract]);

    /*** =============================================== */
    //      TABLE COLUMNS
    /*** =============================================== */
    const columns = [
        {
            name: 'Jeton transféré',
            selector: (row) => row.tokenId,
            cell: (row) => (
                <div row={row}>
                    {collectionCtx.collection && collectionCtx.collection.length > 0 ? (
                        <div className='d-flex align-items-center py-3 overflow-hidden'>
                            <div className='author-avatar rounded-xl overflow-hidden'>
                                {collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].type ===
                                    'image' && (
                                    <ImageCpt
                                        type='image'
                                        img={collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].img}
                                    />
                                )}
                                {collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].type ===
                                    'audio' && (
                                    <>
                                        <span
                                            className='author-avatar-inner rounded-xl'
                                            style={{ background: `linear-gradient(45deg, #4ca1af, #c4e0e5)` }}
                                        ></span>
                                        <i className='las la-music text-white position-absolute top-50 start-50 translate-middle z-index-20'></i>
                                    </>
                                )}
                                {collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].type ===
                                    'video' && (
                                    <div className='player-wrapper z-index-20'>
                                        <ImageCpt
                                            type='video'
                                            img={
                                                collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].img
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                            <p className='mb-0 fw-bold ms-3'>
                                {truncateStart(
                                    collectionCtx.collection.filter((nft) => nft.id === row.tokenId)[0].title,
                                    20
                                )}
                            </p>
                        </div>
                    ) : (
                        'Chargement des actifs...'
                    )}
                </div>
            ),
        },
        {
            name: 'Transféré depuis',
            selector: (row) => row.from,
            cell: (row) => (
                <div row={row}>
                    {row.from.address === marketplaceAddress || row.from.address === auctionContractAddress ? (
                        <Link to='/' className='text-reset'>
                            <div className='d-flex align-items-center'>
                                <div className='author-avatar author-avatar-sm'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(/images/mkt-avatar.png)`,
                                        }}
                                    ></span>
                                </div>
                                <p className='ms-2 mb-0 fw-bold'>Marché</p>
                            </div>
                        </Link>
                    ) : (
                        <Link to={`/users/${row.from.address}`} className='text-reset'>
                            <div className='d-flex align-items-center'>
                                <div className='author-avatar author-avatar-sm'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(${
                                                row.from.avatar === '' ? '/images/astronaut.png' : row.from.avatar
                                            })`,
                                        }}
                                    ></span>
                                </div>
                                <p className='ms-2 mb-0 fw-bold'>{row.from.name}</p>
                            </div>
                        </Link>
                    )}
                </div>
            ),
        },
        {
            name: 'Transféré à',
            selector: (row) => row.from,
            cell: (row) => (
                <div row={row}>
                    {row.to.address === marketplaceAddress || row.to.address === auctionContractAddress ? (
                        <Link to='/' className='text-reset'>
                            <div className='d-flex align-items-center'>
                                <div className='author-avatar author-avatar-sm'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(/images/mkt-avatar.png)`,
                                        }}
                                    ></span>
                                </div>
                                <p className='ms-2 mb-0 fw-bold'>Marché</p>
                            </div>
                        </Link>
                    ) : (
                        <Link to={`/users/${row.to.address}`} className='text-reset'>
                            <div className='d-flex align-items-center'>
                                <div className='author-avatar author-avatar-sm'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(${
                                                row.to.avatar === '' ? '/images/astronaut.png' : row.to.avatar
                                            })`,
                                        }}
                                    ></span>
                                </div>
                                <p className='ms-2 mb-0 fw-bold'>{row.to.name}</p>
                            </div>
                        </Link>
                    )}
                </div>
            ),
        },
        {
            name: 'Date',
            selector: (row) => row.time,
            cell: (row) => (
                <div row={row}>
                    <p className='mb-0'>{formteFullDate(row.time)}</p>
                </div>
            ),
        },
        {
            name: 'Prix',
            selector: (row) => row.price,
            cell: (row) => (
                <div row={row}>
                    {row.price > 0 ? (
                        <p className='mb-0'>
                            {formatPrice(row.price)} {settings.currency}
                        </p>
                    ) : (
                        '-'
                    )}
                </div>
            ),
        },
    ];

    return (
        transactions && (
            <DataTable
                columns={columns}
                data={transactions.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                })}
                pagination={transactions.length >= 10 && true}
                responsive
                theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
            />
        )
    );
}

export default TransactionsTable;
