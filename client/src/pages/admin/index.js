import React, { useEffect, useState } from 'react';
import { settings } from '../../helpers/settings';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import Dashboard from './Dashboard';
import WhiteList from './WhiteList';
import PromoteNft from './PromoteNft';

function AdminPage() {
    const [isNavSelected, setIsNavSelected] = useState('dashboard');

    /*** ---------------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ---------------------------------------------- */
    useEffect(() => {
        document.title = `Admin Panel | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    return (
        <>
            <PageBanner heading='Admin Panel' bannerBg='bg-light pb-0' />
            <section className='py-5 bg-light'>
                <div className='container pb-5'>
                    <div className='row mb-5 pb-5'>
                        <div className='col-lg-8 mx-auto'>
                            <div className='toggle-nav flex-column flex-md-row' data-aos='fade-up' data-aos-delay='100'>
                                <button
                                    className={`toggle-nav-btn flex-fill w-100 ${
                                        isNavSelected === 'dashboard' ? 'active' : null
                                    }`}
                                    type='button'
                                    onClick={() => setIsNavSelected('dashboard')}
                                >
                                    Dashboard
                                </button>
                                <button
                                    className={`toggle-nav-btn flex-fill w-100 ${
                                        isNavSelected === 'whitelist' ? 'active' : null
                                    }`}
                                    type='button'
                                    onClick={() => setIsNavSelected('whitelist')}
                                >
                                    WhiteList
                                </button>
                                <button
                                    className={`toggle-nav-btn flex-fill w-100 ${
                                        isNavSelected === 'promotion' ? 'active' : null
                                    }`}
                                    type='button'
                                    onClick={() => setIsNavSelected('promotion')}
                                >
                                    Promote NFT
                                </button>
                            </div>
                        </div>
                    </div>

                    {isNavSelected === 'dashboard' && <Dashboard />}
                    {isNavSelected === 'whitelist' && <WhiteList />}
                    {isNavSelected === 'promotion' && <PromoteNft />}
                </div>
            </section>
        </>
    );
}

export default AdminPage;
