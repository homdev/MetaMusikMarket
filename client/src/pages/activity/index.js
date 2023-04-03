import React from 'react';

// HOOKS
import useUser from '../../hooks/useUser';

// COMPONENTS
import FullScreenLoader from '../../components/general/FullScreenLoader';
import PageBanner from '../../components/general/PageBanner';
import ActivityTable from './ActivityTable';
import TransactionsTable from './TransactionsTable';

function ActivityPage() {
    const userCtx = useUser();
    return (
        <>
            {userCtx.userIsLoading && <FullScreenLoader heading='Loading' />}
            <PageBanner heading='Activity & Transactions' />
            <section className='py-5'>
                <div className='container py-5' data-aos='fade-up' data-aos-delay='100'>
                    {/* ACTIVITES */}
                    <div className='mb-5'>
                        <header className='mb-4'>
                            <div className='row'>
                                <div className='col-lg-7'>
                                    <h2 className='mb-2'>Activities</h2>
                                    <p className='text-muted lead'>
                                        Find out what happened in the MetaRealFights world today.
                                    </p>
                                </div>
                            </div>
                        </header>
                        <div className='card shadow-lg'>
                            <div className='card-body'>
                                <ActivityTable />
                            </div>
                        </div>
                    </div>

                    {/* TRANSACTIONS */}
                    <header className='mb-4'>
                        <div className='row'>
                            <div className='col-lg-7'>
                                <h2 className='mb-2'>Transactions</h2>
                                <p className='text-muted lead'>The latest transactions</p>
                            </div>
                        </div>
                    </header>

                    <div className='card shadow-lg'>
                        <div className='card-body'>
                            <TransactionsTable />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ActivityPage;
