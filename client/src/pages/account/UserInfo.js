import React, { useEffect, useState } from 'react';

// HOOKS
import useUser from '../../hooks/useUser';

function UserInfo({ editInfo }) {
    const userCtx = useUser();
    const [userInfo, setUserInfo] = useState(null);

    /*** --------------------------------------------- */
    //      GET USER INFORMATION
    /*** --------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.userInformation) {
            setUserInfo(userCtx.userInformation);
        }
    }, [userCtx.contract, userCtx.userInformation]);

    return (
        <>
            <h2 className='h3 mb-4 text-center' data-aos='fade-up' data-aos-delay='100'>
            Informations de base
            </h2>
            <div className='row g-3 mb-5' data-aos='fade-up' data-aos-delay='200'>
                <div className='col-lg-6' data-aos='fade' data-aos-delay='100'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Nom complet</h6>
                        <p className='text-muted mb-0'>{userInfo ? userInfo.fullName : 'Loading...'}</p>
                    </div>
                </div>
                <div className='col-lg-6' data-aos='fade' data-aos-delay='200'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Adresse électronique</h6>
                        <p className='text-muted mb-0'>
                            {userInfo && userInfo.email !== '' ? userInfo.email : 'Non défini'}
                        </p>
                    </div>
                </div>
                <div className='col-lg-6' data-aos='fade' data-aos-delay='300'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Role</h6>
                        <p className='text-muted mb-0 mb-lg-3'>
                            {userInfo && userInfo.role !== '' ? userInfo.role : 'Non défini'}
                        </p>
                    </div>
                </div>
                <div className='col-lg-6' data-aos='fade' data-aos-delay='400'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Avatar</h6>
                        <div className='author-avatar'>
                            <span
                                className='author-avatar-inner'
                                style={{
                                    background: `url(${
                                        userInfo && userInfo.avatar !== '' ? userInfo.avatar : '/images/astronaut.png'
                                    })`,
                                }}
                            ></span>
                        </div>
                    </div>
                </div>
                <div className='col-lg-12' data-aos='fade' data-aos-delay='500'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>A propos de</h6>
                        <p className='text-muted mb-0'>
                            {userInfo && userInfo.about !== '' ? userInfo.about : 'Non défini'}
                        </p>
                    </div>
                </div>

                <div className='col-lg-12' data-aos='fade' data-aos-delay='600'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>En-tête</h6>
                        <div className='user-gallery-header rounded-lg'>
                            <div
                                className='user-gallery-header-inner rounded-lg'
                                style={{ background: `url(${userInfo && userInfo.header})` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className='h3 mb-4 text-center' data-aos='fade-up' data-aos-delay='100'>
                Liens des réseaux sociaux
            </h2>
            <div className='row g-3 mb-4' data-aos='fade-up' data-aos-delay='200'>
                <div className='col-lg-6'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Facebook</h6>
                        {userInfo && userInfo.facebook ? (
                            <a href={userInfo && userInfo.facebook} className='text-reset'>
                                {userInfo && userInfo.facebook}
                            </a>
                        ) : (
                            <p className='text-muted mb-0'>Non défini</p>
                        )}
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Twitter</h6>
                        {userInfo && userInfo.twitter ? (
                            <a href={userInfo && userInfo.twitter} className='text-reset'>
                                {userInfo && userInfo.twitter}
                            </a>
                        ) : (
                            <p className='text-muted mb-0'>Non défini</p>
                        )}
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Instagram</h6>
                        {userInfo && userInfo.instagram ? (
                            <a href={userInfo && userInfo.instagram} className='text-reset'>
                                {userInfo && userInfo.instagram}
                            </a>
                        ) : (
                            <p className='text-muted mb-0'>Non défini</p>
                        )}
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='p-4 bg-light rounded-lg'>
                        <h6>Dribbble</h6>
                        {userInfo && userInfo.dribbble ? (
                            <a href={userInfo && userInfo.dribbble} className='text-reset'>
                                {userInfo && userInfo.dribbble}
                            </a>
                        ) : (
                            <p className='text-muted mb-0'>Non défini</p>
                        )}
                    </div>
                </div>
            </div>
            <button
                className='btn btn-primary w-100 py-2'
                type='button'
                data-aos='fade-up'
                data-aos-delay='100'
                onClick={editInfo}
            >
                <i className='las la-user me-2'></i>
                Mise à jour de vos informations
            </button>
        </>
    );
}

export default UserInfo;
