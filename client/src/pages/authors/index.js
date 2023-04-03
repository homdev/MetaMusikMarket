import React, { useEffect, useState } from 'react';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { Link } from 'react-router-dom';
import { formatPrice, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import Pagination from '../../components/general/Pagination';
import FullScreenLoader from '../../components/general/FullScreenLoader';

function AuthorsPage({ sellers }) {
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(16);
    const [usersList, setUsersList] = useState(null);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAuthors = sellers.slice(indexOfFirstItem, indexOfLastItem);

    /*** -------------------------------------------- */
    //      DECLARE USERS LIST
    /*** -------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList && userCtx.usersList.length > 0) {
            setUsersList(userCtx.usersList);
        }
    }, [userCtx.contract, userCtx.usersList]);

    /*** -------------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** -------------------------------------------- */
    useEffect(() => {
        document.title = `All Sellers | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    /*** -------------------------------------------- */
    //      PAGINATION
    /*** -------------------------------------------- */
    function paginate(pageNumber) {
        setCurrentPage(pageNumber);
    }

    /*** -------------------------------------------- */
    //      CREATE TOP SELLERS TEMPLATE
    /*** -------------------------------------------- */
    const renderSellers = currentAuthors
        .sort((a, b) => (parseInt(a.value) > parseInt(b.value) ? -1 : parseInt(b.value) > parseInt(a.value) ? 1 : 0))
        .map((seller, index) => {
            return (
                <Link
                    to={`/users/${seller.address}`}
                    className='col-xl-3 col-lg-4 col-md-6'
                    key={index}
                    data-aos='fade-right'
                    data-aos-delay={(index + 1) * 100}
                >
                    <div className='card bd-3 shadow card-hover-minimal border-0 position-relative rounded-pill text-dark'>
                        <div className='card-body'>
                            <div className='d-flex align-items-center'>
                                {usersList ? (
                                    usersList.filter((user) => user.account === seller.address)[0].avatar === '' ? (
                                        <div className='author-avatar author-avatar-md'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(/images/astronaut.png)`,
                                                }}
                                            ></span>
                                        </div>
                                    ) : (
                                        <div className='author-avatar author-avatar-md'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(${
                                                        usersList.filter((user) => user.account === seller.address)[0]
                                                            .avatar
                                                    })`,
                                                }}
                                            ></span>
                                        </div>
                                    )
                                ) : (
                                    <div style={{ width: '50px', height: '50px' }}>
                                        <Jazzicon address={seller.address} />
                                    </div>
                                )}
                                <div className='ms-3'>
                                    <h3 className='h6 mb-1 text-capitalize text-reset'>
                                        {usersList
                                            ? truncateStart(
                                                  usersList.filter((user) => user.account === seller.address)[0]
                                                      .fullName,
                                                  12
                                              )
                                            : 'Loading...'}
                                        <div
                                            className={`badge rounded-pill mb-0 ms-2 text-xxs ${
                                                index === 0
                                                    ? 'bg-primary'
                                                    : index === 1
                                                    ? 'bg-success'
                                                    : index === 2
                                                    ? 'bg-info'
                                                    : 'bg-gray-700'
                                            }`}
                                        >
                                            {index <= 2 ? (
                                                <i className='las la-trophy me-1 text-xxs'></i>
                                            ) : (
                                                <i className='las la-chess-pawn me-1 text-xxs'></i>
                                            )}
                                            {index + 1}
                                        </div>
                                    </h3>
                                    <p className='text-sm text-dark mb-0 fw-bold'>
                                        {formatPrice(seller.value).toFixed(3)}{' '}
                                        <span className='text-muted fw-normal'>{settings.currency}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            );
        });

    return (
        <>
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='loading' /> : null}
            <PageBanner heading={'All Sellers'} />

            <section className='py-5'>
                <div className='container py-5'>
                    {renderSellers.length > 0 ? (
                        <div className='row gy-4 mb-5 align-items-stretch'>{renderSellers}</div>
                    ) : (
                        <div className='text-center'>
                            <h4 className='text-center'>There're no sellers at the moment</h4>
                            <p className='text-muted mb-3'>
                                Once there'll be selling actions we'll render sellers here
                            </p>
                            <Link className='btn btn-gradient-primary mb-5' to='/'>
                                Return Home
                            </Link>
                        </div>
                    )}

                    {renderSellers.length > itemsPerPage && (
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={sellers.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    )}
                </div>
            </section>
        </>
    );
}

export default AuthorsPage;
