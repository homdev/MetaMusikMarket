import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formteFullDate, truncateStart } from '../../helpers/utils';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import ImageCpt from '../../components/general/ImageCpt';

function PendingNftsTable({ approveNft }) {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    const [collection, setCollection] = useState(null);
    const [selectedNfts, setSelectedNfts] = useState([]);

    /*** ------------------------------------------------ */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** ------------------------------------------------ */
    useEffect(() => {
        if (collectionCtx.collection && collectionCtx.contract && collectionCtx.collection.length > 0) {
            setCollection(collectionCtx.collection.filter((nft) => nft.isApproved === false));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.collection, collectionCtx.contract]);

    /*** ------------------------------------------------ */
    //      TABLE COLUMNS
    /*** ------------------------------------------------ */
    const columns = [
        {
            name: 'NFT Title',
            selector: (row) => row.title,
            cell: (row) => (
                <div row={row}>
                    <Link className='text-reset' to={`/assets/${row.id}`}>
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
            selector: (row) => row.owner,
            cell: (row) => (
                <Link className='text-reset' to={`/users/${row.owner}`}>
                    <div className='d-flex align-items-center py-3 px-3'>
                        <div className='author-avatar'>
                            <span
                                className='author-avatar-inner'
                                style={{
                                    background: `url(${
                                        userCtx.contract &&
                                        userCtx.usersList &&
                                        userCtx.usersList.length > 0 &&
                                        userCtx.usersList.filter((user) => user.account === row.owner)[0].avatar !==
                                            '' &&
                                        userCtx.usersList.filter((user) => user.account === row.owner)[0].avatar
                                    })`,
                                }}
                            ></span>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            name: 'Approve',
            selector: (row) => row.owner,
            cell: (row) => (
                <div className='form-check'>
                    <input
                        type='checkbox'
                        className='form-check-input cursor-pointer'
                        onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedNfts([...selectedNfts, row.id]);
                            } else {
                                setSelectedNfts(selectedNfts.filter((nft) => nft !== row.id));
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
            {collection && (
                <>
                    <DataTable
                        columns={columns}
                        data={collection}
                        pagination={collection.length >= 10 && true}
                        responsive
                        theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
                    />
                    {selectedNfts > 0 && (
                        <button
                            className='btn btn-primary w-100 py-2 mt-3'
                            onClick={() => {
                                approveNft(selectedNfts);
                                setSelectedNfts([]);
                            }}
                        >
                            Approve Selected
                        </button>
                    )}
                </>
            )}
        </>
    );
}

export default PendingNftsTable;
