import React, { useEffect } from 'react';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import RegisterForm from './RegisterForm';

function RegisterPage() {
    const marketplaceCtx = useMarketplace();

    /*** ------------------------------------ */
    //      CHANGE PAGE TITLE
    /*** ------------------------------------ */
    useEffect(() => {
        document.title = `S'enregistrer | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    return (
        <>
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='loading' /> : null}
            <PageBanner heading="S'enregistrer" />
            <section className='py-5'>
                <div className='container pb-5'>
                    <div className='row'>
                        <div className='col-lg-8 mx-auto'>
                            <RegisterForm />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default RegisterPage;
