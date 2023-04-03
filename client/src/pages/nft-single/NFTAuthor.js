import React from 'react';
import { Link } from 'react-router-dom';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

// COMPONENTS
import Loader from '../../components/general/Loader';

function NFTAuthor({ history, owner, creator, ownerName, ownerAvatar, creatorName, creatorAvatar }) {
    const marketplaceCtx = useMarketplace();

    if (!history) return <Loader />;

    return (
        <div className='row'>
            <div className='col-xl-8'>
                <ul className='list-inline d-flex align-items-lg-center flex-column flex-lg-row'>
                    <li className='list-inline-item flex-shrink-0 me-4 mb-4 mb-lg-0'>
                        <h6 className='mb-3'>Creator</h6>
                        <div
                            className='d-flex align-items-center py-2 ps-2 pe-4 rounded-pill bg-white'
                            style={{
                                border:
                                    marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                            }}
                        >
                            <Link className='text-reset' to={`/users/${creator}`}>
                                <div className='author-avatar'>
                                    <span
                                        className='author-avatar-inner'
                                        style={{
                                            background: `url(${
                                                creatorAvatar !== '' ? creatorAvatar : '/images/astronaut.png'
                                            })`,
                                        }}
                                    ></span>
                                </div>
                            </Link>
                            <Link className='text-reset' to={`/users/${creator}`}>
                                <p className='ms-2 mb-0 text-gray-800 fw-bold'>
                                    {creatorName !== '' ? creatorName : 'MetaMusik'}
                                </p>
                            </Link>
                        </div>
                    </li>
                    <li className='list-inline-item flex-shrink-0'>
                        <h6 className='mb-3'>Propriétaire</h6>

                        <div
                            className='d-flex align-items-center py-2 ps-2 pe-4 rounded-pill bg-white'
                            style={{
                                border:
                                    marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                            }}
                        >
                            {ownerAvatar ? (
                                <Link className='text-reset' to={`/users/${owner}`}>
                                    <div className='author-avatar'>
                                        <span
                                            className='author-avatar-inner'
                                            style={{ background: `url(${ownerAvatar})` }}
                                        ></span>
                                    </div>
                                </Link>
                            ) : (
                                <Link className='text-reset' to={`/users/${owner}`}>
                                    <div className='author-avatar'>
                                        <span
                                            className='author-avatar-inner'
                                            style={{ background: `url(/images/astronaut.png)` }}
                                        ></span>
                                    </div>
                                </Link>
                            )}

                            <Link className='text-reset' to={`/users/${owner}`}>
                                <p className='ms-2 mb-0 text-gray-800 fw-bold'>{ownerName}</p>
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NFTAuthor;
