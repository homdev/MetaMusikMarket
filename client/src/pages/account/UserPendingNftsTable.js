import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formteFullDate, truncateStart } from '../../helpers/utils';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useCollection from '../../hooks/useCollection';
import useWeb3 from '../../hooks/useWeb3';

// COMPONENTS
import ImageCpt from '../../components/general/ImageCpt';

function PendingNftsTable() {
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const web3Ctx = useWeb3();

    const [collection, setCollection] = useState(null);

    /*** -------------------------------------------------- */
    //      MERGE NFT COLLECTION WITH NFT OFFERS
    /*** -------------------------------------------------- */
    useEffect(() => {
        if (collectionCtx.collection && collectionCtx.contract && collectionCtx.collection.length > 0) {
            setCollection(
                collectionCtx.collection
                    .filter((nft) => nft.isApproved === false)
                    .filter((nft) => nft.creator === web3Ctx.account)
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.collection, collectionCtx.contract]);

    /*** -------------------------------------------------- */
    //      TABLE COLUMNS
    /*** -------------------------------------------------- */
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
    ];

    return (
        <>
            {collection && (
                <>
                    <h2 className='h3 mb-4 text-center' data-aos='fade-up' data-aos-delay='600'>
                    Mes NFT en attente
                    </h2>
                    <DataTable
                        columns={columns}
                        data={collection}
                        pagination={collection.length >= 10 && true}
                        responsive
                        theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
                    />
                </>
            )}
        </>
    );
}

export default PendingNftsTable;
