import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';

// COMPONENTS
import NoDataAlert from '../../components/general/NoDataAlert';

function TopSellers({ title, description, topSellers }) {
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    const [usersList, setUsersList] = useState(null);

    /*** -------------------------------------- */
    //      GET USERS LIST
    /*** -------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList && userCtx.usersList.length > 0) {
            setUsersList(userCtx.usersList);
        }
    }, [userCtx.contract, userCtx.usersList]);

    /*** -------------------------------------- */
    //      CREATE TOP SELLERS TEMPLATE
    /*** -------------------------------------- */
    const renderTopSellers = topSellers
        .slice(0, 8)
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
                                {usersList &&
                                    (usersList.filter((user) => user.account === seller.address)[0].avatar === '' ? (
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
                                    ))}

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
        <section className='py-5'>
            <div className='container pb-5'>
                <header className='mb-5'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <h2 data-aos='fade-right' data-aos-delay='100'>
                                {title}
                            </h2>
                            <p className='text-muted lead mb-0' data-aos='fade-right' data-aos-delay='200'>
                                {description}
                            </p>
                        </div>
                    </div>
                </header>

                <div className='row gy-3'>
                    {renderTopSellers.length > 0 && !marketplaceCtx.mktIsLoading ? (
                        renderTopSellers
                    ) : (
                        <div className='col-lg-9'>
                            <NoDataAlert
                                heading="There're no Sellers at the moment."
                                subheading='Once someone has successfully sell or buy an asset, sellers calculations will take place.'
                                aos='fade-right'
                                aosDelay='300'
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default TopSellers;
