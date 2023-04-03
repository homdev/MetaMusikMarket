import React, { useEffect, useState } from 'react';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import FullScreenLoader from '../../components/general/FullScreenLoader';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import UserInfo from './UserInfo';
import InfoForm from './InfoForm';
import UserBidsTable from './UserBidsTable';
import UserPendingNftsTable from './UserPendingNftsTable';

function AccountPage() {
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const [requestEdit, setRequestEdit] = useState(false);

    /*** ------------------------------------------ */
    //      CHANGE PAGE TITLE
    /*** ------------------------------------------ */
    useEffect(() => {
        document.title = `My Information | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    /*** ------------------------------------------ */
    //      OPEN EDIT INFO FORM
    /*** ------------------------------------------ */
    function requestEditHandler() {
        setRequestEdit(true);
        window.scrollTo(0, 0);
    }

    /*** ------------------------------------------ */
    //      CLOSE EDIT INFO FORM
    /*** ------------------------------------------ */
    function cancelEditHandler() {
        setRequestEdit(false);
        window.scrollTo(0, 0);
    }

    return (
        <>
            {auctionCtx.fetchingLoading ? <FullScreenLoader heading='Updating your Bids' /> : null}
            {marketplaceCtx.mktIsLoading ? <FullScreenLoader heading='loading' /> : null}
            {auctionCtx.auctionTransactionLoading ? <MetaMaskLoader /> : null}
            <PageBanner heading='Mon compte' />
            <section className='py-5'>
                <div className='container py-5'>
                    <div className='row'>
                        <div className='col-lg-8 mx-auto'>
                            {requestEdit ? (
                                <InfoForm editInfo={cancelEditHandler} />
                            ) : (
                                <>
                                    <UserInfo editInfo={requestEditHandler} />

                                    <div className='table-width-sm my-5' data-aos='fade-up' data-aos-delay='600'>
                                        <UserBidsTable />
                                    </div>

                                    <div className='table-width-sm' data-aos='fade-up' data-aos-delay='700'>
                                        <UserPendingNftsTable />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AccountPage;
