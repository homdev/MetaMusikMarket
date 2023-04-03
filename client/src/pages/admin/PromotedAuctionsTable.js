import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formteFullDate, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import ImageCpt from '../../components/general/ImageCpt';

function PromotedAuctionsTable({ unpromote }) {
    const collectionCtx = useCollection();
    const auctionCtx = useAuctions();
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    const [auctions, setAuctions] = useState(null);
    const [selectedNfts, setSelectedNfts] = useState([]);

    /*** =============================================== */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** =============================================== */
    useEffect(() => {
        setAuctions(auctionCtx.auctionsData.filter((auc) => auc.isPromoted === true));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.collection, collectionCtx.contract, auctionCtx.contract, auctionCtx.auctionsData]);

    /*** =============================================== */
    //      TABLE COLUMNS
    /*** =============================================== */
    const columns = [
        {
            name: 'NFT Title',
            selector: (row) => row.title,
            cell: (row) => (
                <div row={row}>
                    <Link className='text-reset' to={`/nftauction/${row.tokenId}`}>
                        <div className='d-flex align-items-center py-3 overflow-hidden'>
                            <div className='author-avatar rounded-xl overflow-hidden'>
                                {row.type === 'image' && <ImageCpt type='image' img={row.img} />}
                                {row.type === 'audio' && (
                                    <>
                                        <span
                                            className='author-avatar-inner rounded-xl'
                                            style={{ background: `linear-gradient(45deg, #4ca1af, #c4e0e5)` }}
                                        ></span>
                                        <i className='las la-music text-white position-absolute top-50 start-50 translate-middle z-index-20'></i>
                                    </>
                                )}
                                {row.type === 'video' && (
                                    <div className='player-wrapper z-index-20'>
                                        <ImageCpt type='video' img={row.img} />
                                    </div>
                                )}
                            </div>
                            <div className='ms-3'>
                                <p className='fw-bold text-base mb-0'>{truncateStart(row.title, 15)}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ),
        },
        {
            name: 'Top Bid',
            selector: (row) => row.bids,
            cell: (row) => (
                <p className='fw-bold text-base mb-0'>
                    {row.bids.length > 0 ? (
                        <span>
                            {row.bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.amount).length > 0
                                ? (
                                      Math.max(
                                          ...row.bids.filter((bid) => bid.withdraw !== true).map((bid) => bid.amount)
                                      ) /
                                      10 ** 18
                                  ).toFixed(2)
                                : 'No Bids'}{' '}
                            {settings.currency}
                        </span>
                    ) : (
                        'No Bids'
                    )}
                </p>
            ),
        },
        {
            name: 'Date Created',
            selector: (row) => row.dateCreated,
            cell: (row) => (
                <div row={row}>
                    <div className='d-flex align-items-center'>
                        <p className='mb-0 fw-bold'>{formteFullDate(row.dateCreated)}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Category',
            selector: (row) => row.category,
            cell: (row) => (
                <div row={row}>
                    <div className='d-flex align-items-center'>
                        <p className='mb-0 fw-bold'>{row.category}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Royalties',
            selector: (row) => row.royalties,
            cell: (row) => <p className='fw-bold text-base mb-0'>{row.royalties}%</p>,
        },
        {
            name: 'Owner',
            selector: (row) => row.user,
            cell: (row) => (
                <Link className='text-reset' to={`/users/${row.user}`}>
                    <div className='d-flex align-items-center py-3 px-3'>
                        <div className='author-avatar'>
                            <span
                                className='author-avatar-inner'
                                style={{
                                    background: `url(${
                                        userCtx.usersList &&
                                        userCtx.usersList.length > 0 &&
                                        userCtx.contract &&
                                        userCtx.usersList.filter((u) => u.account === row.user)[0].avatar
                                    })`,
                                }}
                            ></span>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            name: 'Select',
            selector: (row) => row.owner,
            cell: (row) => (
                <div className='form-check'>
                    <input
                        type='checkbox'
                        className='form-check-input cursor-pointer'
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedNfts([...selectedNfts, row.tokenId]);
                            } else {
                                setSelectedNfts(selectedNfts.filter((nft) => nft !== row.tokenId));
                            }
                        }}
                    />
                    <div className='form-check-label'></div>
                </div>
            ),
        },
    ];

    return (
        <>
            {auctions && (
                <>
                    <DataTable
                        columns={columns}
                        data={auctions}
                        pagination={auctions.length >= 10 && true}
                        responsive
                        theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
                    />
                    {selectedNfts.length > 0 && (
                        <button
                            className='btn btn-primary w-100 py-2 mt-3'
                            onClick={() => {
                                unpromote(selectedNfts);
                                setSelectedNfts([]);
                            }}
                        >
                            Unpromote Selected
                        </button>
                    )}
                </>
            )}
        </>
    );
}

export default PromotedAuctionsTable;
