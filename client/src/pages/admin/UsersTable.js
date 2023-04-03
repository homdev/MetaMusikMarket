import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settings } from '../../helpers/settings';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useCollection from '../../hooks/useCollection';
import useUser from '../../hooks/useUser';

function UsersTable() {
    const userCtx = useUser();
    const marketplaceCtx = useMarketplace();
    const collectionCtx = useCollection();

    const [usersList, setUsersList] = useState(null);

    /*** -------------------------------------------- */
    //      GET USERS LIST
    /*** -------------------------------------------- */
    useEffect(() => {
        if (userCtx.usersList && userCtx.contract && marketplaceCtx.sellers) {
            setUsersList(
                userCtx.usersList.map((user) => {
                    const isSeller = marketplaceCtx.sellers.filter((seller) => seller.address === user.account)[0];
                    return {
                        account: user.account,
                        name: user.fullName,
                        email: user.email,
                        avatar: user.avatar,
                        selling: isSeller ? parseInt(isSeller.value) : 0,
                    };
                })
            );
        }
    }, [userCtx.usersList, marketplaceCtx.contract, marketplaceCtx.sellers, userCtx.contract]);

    /*** -------------------------------------------- */
    //      TABLE COLUMNS
    /*** -------------------------------------------- */
    const columns = [
        {
            name: "Informations sur l'utilisateur",
            selector: (row) => row.fullName,
            cell: (row) => (
                <div row={row}>
                    <Link className='text-reset' to={`/users/${row.account}`}>
                        <div className='d-flex align-items-center py-3'>
                            <div className='author-avatar'>
                                <span
                                    className='author-avatar-inner'
                                    style={{ background: `url(${row.avatar})` }}
                                ></span>
                            </div>
                            <div className='ms-3'>
                                <p className='fw-bold text-base mb-0'>{row.name}</p>
                                <p className='text-muted text-xxs mb-0'>{row.email}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            ),
        },
        {
            name: 'Profits',
            selector: (row) => row.selling,
            cell: (row) => (
                <div row={row}>
                    <div className='d-flex align-items-center'>
                        <p className='mb-0 fw-bold'>
                            {row.selling > 0 ? (row.selling / 10 ** 18).toFixed(2) : 0} {settings.currency}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Total Frappé',
            selector: (row) => row.account,
            cell: (row) => (
                <div row={row}>
                    <div className='d-flex align-items-center'>
                        <p className='mb-0 fw-bold'>
                            {collectionCtx.collection.filter((nft) => nft.creator === row.account).length}
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        usersList && (
            <DataTable
                columns={columns}
                data={usersList}
                pagination={usersList.length >= 10 && true}
                responsive
                theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
            />
        )
    );
}

export default UsersTable;
