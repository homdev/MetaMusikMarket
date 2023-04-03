import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { settings } from '../../helpers/settings';
import DataTable from 'react-data-table-component';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';

function UsersTable() {
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    const [usersList, setUsersList] = useState(null);

    /*** ------------------------------------------ */
    //      GET WHITELIST USERS
    /*** ------------------------------------------ */
    useEffect(() => {
        if (userCtx.whiteList && userCtx.usersList && userCtx.contract && marketplaceCtx.sellers) {
            setUsersList(
                userCtx.whiteList
                    .filter((user) => user.address !== '0x0000000000000000000000000000000000000000')
                    .map((user) => {
                        const isSeller = marketplaceCtx.sellers.filter((seller) => seller.address === user.address)[0];
                        return {
                            account: user.address,
                            name: userCtx.usersList.filter((el) => el.account === user.address)[0].fullName,
                            email: userCtx.usersList.filter((el) => el.account === user.address)[0].email,
                            avatar: userCtx.usersList.filter((el) => el.account === user.address)[0].avatar,
                            selling: isSeller ? parseInt(isSeller.value) : 0,
                        };
                    })
            );
        }
    }, [userCtx.whiteList, userCtx.usersList, marketplaceCtx.contract, marketplaceCtx.sellers, userCtx.contract]);

    /*** ------------------------------------------ */
    //      TABLE COLUMNS
    /*** ------------------------------------------ */
    const columns = [
        {
            name: "Informations sur l'utilisateur",
            selector: (row) => row.fullName,
            cell: (row) => (
                <div row={row}>
                    <Link className='text-reset' to={`/users/${row.account}`}>
                        <div className='d-flex align-items-center py-2'>
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
