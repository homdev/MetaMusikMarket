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

function NftTable({ blockNfts }) {
    const userCtx = useUser();
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const [collection, setCollection] = useState(null);
    const [selectedNfts, setSelectedNfts] = useState([]);

    /*** =============================================== */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** =============================================== */
    useEffect(() => {
        if (
            (marketplaceCtx.contract &&
                collectionCtx.contract &&
                collectionCtx.collection.length > 0 &&
                collectionCtx.collection &&
                marketplaceCtx.contractAddress,
            userCtx.usersList)
        ) {
            let offersMap = marketplaceCtx.offers.reduce((acc, curr) => {
                acc[curr.id] = curr;
                return acc;
            }, {});
            let combined = collectionCtx.collection
                .filter(
                    (nft) =>
                        !auctionCtx.auctions
                            .filter((auc) => auc.isActive === true)
                            .some((auc) => nft.id === auc.tokenId)
                )
                .map((d) => Object.assign(d, offersMap[d.id]));
            let final = combined.map((el) => {
                if (el.price) {
                    return {
                        ...el,
                        ownerName:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user)[0].fullName
                                : userCtx.usersList.filter((user) => user.account === el.owner)[0].fullName,
                        ownerEmail:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user)[0].email
                                : userCtx.usersList.filter((user) => user.account === el.owner)[0].email,
                        ownerAvatar:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user)[0].avatar
                                : userCtx.usersList.filter((user) => user.account === el.owner)[0].avatar,
                    };
                } else if (!el.price) {
                    return {
                        ...el,
                        price: 0,
                        ownerName:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user).length > 0 &&
                                  userCtx.usersList.filter((user) => user.account === el.user)[0].fullName
                                : userCtx.usersList.filter((user) => user.account === el.owner).length > 0 &&
                                  userCtx.usersList.filter((user) => user.account === el.owner)[0].fullName,
                        ownerEmail:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user).length > 0 &&
                                  userCtx.usersList.filter((user) => user.account === el.user)[0].email
                                : userCtx.usersList.filter((user) => user.account === el.owner).length > 0 &&
                                  userCtx.usersList.filter((user) => user.account === el.owner)[0].email,
                        ownerAvatar:
                            el.owner === marketplaceCtx.contractAddress
                                ? userCtx.usersList.filter((user) => user.account === el.user).length > 0 && [0].avatar
                                : userCtx.usersList.filter((user) => user.account === el.owner).length > 0 &&
                                  userCtx.usersList.filter((user) => user.account === el.owner)[0].avatar,
                    };
                }
                return { ...el };
            });
            setCollection(final);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        marketplaceCtx.offers,
        collectionCtx.collection,
        collectionCtx.contract,
        marketplaceCtx.contract,
        collectionCtx.collection,
        collectionCtx.nftHistory,
        marketplaceCtx.contractAddress,
        userCtx.usersList,
    ]);

    /*** =============================================== */
    //      TABLE COLUMNS
    /*** =============================================== */
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
            name: 'Price',
            selector: (row) => row.price,
            cell: (row) => (
                <p className='fw-bold text-base mb-0'>
                    {row.price > 0 ? (
                        <span>
                            {(row.price / 10 ** 18).toFixed(2)} {settings.currency}
                        </span>
                    ) : (
                        'Non défini'
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
            selector: (row) => row.owner,
            cell: (row) => (
                <Link className='text-reset' to={`/users/${row.owner}`}>
                    <div className='d-flex align-items-center py-3 px-3'>
                        <div className='author-avatar'>
                            <span
                                className='author-avatar-inner'
                                style={{ background: `url(${row.ownerAvatar})` }}
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
                    {selectedNfts.length > 0 && (
                        <button
                            className='btn btn-primary w-100 py-2 mt-3'
                            onClick={() => {
                                blockNfts(selectedNfts);
                                setSelectedNfts([]);
                            }}
                        >
                            Bloc sélectionné
                        </button>
                    )}
                </>
            )}
        </>
    );
}

export default NftTable;
