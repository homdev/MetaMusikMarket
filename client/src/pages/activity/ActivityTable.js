import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, formteFullDate } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import DataTable, { createTheme } from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';

createTheme(
    'solarized',
    {
        background: {
            default: '#1c1c22',
        },
    },
    'dark'
);

/*** ---------------------------------------------------- */
//      TABLE COLUMNS
/*** ---------------------------------------------------- */
const columns = [
    {
        name: 'User',
        selector: (row) => row.address,
        cell: (row) => (
            <div row={row}>
                <Link to={`/users/${row.address}`} className='text-reset'>
                    <div className='d-flex align-items-center py-2'>
                        <div className='author-avatar author-avatar-sm'>
                            <span
                                className='author-avatar-inner'
                                style={{
                                    background: `url(${row.avatar === '' ? '/images/astronaut.png' : row.avatar})`,
                                }}
                            ></span>
                        </div>
                        <p className='ms-2 mb-0 fw-bold'>{row.name}</p>
                    </div>
                </Link>
            </div>
        ),
    },
    {
        name: 'Time',
        selector: (row) => row.time,
        cell: (row) => (
            <div row={row}>
                <p className='mb-0'>{formteFullDate(row.time)}</p>
            </div>
        ),
    },
    {
        name: 'Action',
        selector: (row) => row.type,
        cell: (row) =>
            row.type === 'Add User' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-gray-700'>Enregistrement de l'utilisateur</span>
                </div>
            ) : row.type === 'Mint NFT Token' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-primary'>Jeton NFT à la Monnaie</span>
                </div>
            ) : row.type === 'Make Offer' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-info'>Ajouter un prix</span>
                </div>
            ) : row.type === 'Buy NFT' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-success'>Acheter NFT</span>
                </div>
            ) : row.type === 'Claim Funds' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-success'>Collecter les bénéfices</span>
                </div>
            ) : row.type === 'Cancel Offer' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-danger'>Annuler la vente</span>
                </div>
            ) : row.type === 'Update User' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-gray-700'>Mise à jour des informations</span>
                </div>
            ) : row.type === 'Added to Whitelist' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-info'>Ajouter un utilisateur à la liste blanche</span>
                </div>
            ) : row.type === 'Removed from Whitelist' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-danger'>Supprimer un utilisateur de la liste blanche</span>
                </div>
            ) : row.type === 'Withdraw' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-danger'>Retrait de l'offre</span>
                </div>
            ) : row.type === 'Create auction' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-info'>Créer une vente aux enchères</span>
                </div>
            ) : row.type === 'Add Bid' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-info'>Placez l'offre</span>
                </div>
            ) : row.type === 'Withdraw from auction' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-danger'>Retrait de l'offre</span>
                </div>
            ) : row.type === 'End auction' ? (
                <div row={row}>
                    <span className='fw-bold badge lh-reset bg-success'>Fin de l'enchère</span>
                </div>
            ) : (
                '-'
            ),
    },
    {
        name: 'Price',
        selector: (row) => row.price,
        cell: (row) => (
            <div row={row}>
                {row.price !== '0' ? (
                    <p className='mb-0'>
                        {formatPrice(row.price).toFixed(3)} {settings.currency}
                    </p>
                ) : (
                    <p className='mb-0'>-</p>
                )}
            </div>
        ),
    },
    {
        name: 'Commission',
        selector: (row) => row.commission,
        cell: (row) => (
            <div row={row}>
                {row.commission !== 0 ? (
                    row.type === 'Buy NFT' ? (
                        <p className='mb-0'>
                            {row.commission / 10 ** 18} {settings.currency}
                        </p>
                    ) : (
                        <p className='mb-0'>{row.commission}%</p>
                    )
                ) : (
                    <p className='mb-0'>-</p>
                )}
            </div>
        ),
    },
    {
        name: 'Royalties',
        selector: (row) => row.royalties,
        cell: (row) => (
            <div row={row}>
                {row.royalties > 100 ? (
                    <p className='mb-0'>
                        {formatPrice(row.royalties).toFixed(3)} {settings.currency}
                    </p>
                ) : row.royalties !== 0 && row.royalties < 100 ? (
                    <p className='mb-0'>{row.royalties}%</p>
                ) : (
                    <p className='mb-0'>-</p>
                )}
            </div>
        ),
    },
];

function ActivityTable() {
    const userCtx = useUser();
    const marketplaceCtx = useMarketplace();
    const [activity, setActivity] = useState(null);

    /*** ---------------------------------------------------- */
    //      GET ACTIVITY
    /*** ---------------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList && userCtx.activity) {
            setActivity(
                userCtx.activity.map((el) => {
                    return {
                        ...el,
                        name: userCtx.usersList.filter((user) => user.account === el.address)[0].fullName,
                        avatar: userCtx.usersList.filter((user) => user.account === el.address)[0].avatar,
                    };
                })
            );
        }
    }, [userCtx.contract, userCtx.usersList, userCtx.activity]);

    return (
        activity && (
            <DataTable
                columns={columns}
                data={activity.sort((a, b) => {
                    return new Date(b.time) - new Date(a.time);
                })}
                pagination={activity.length >= 1 && true}
                responsive
                theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
            />
        )
    );
}

export default ActivityTable;
