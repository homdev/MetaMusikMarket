import React from 'react';
import { Link } from 'react-router-dom';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

// COMPOnentS
import HeroImages from './HeroImages';

const heroBg = 'linear-gradient(to bottom, #f5f5f5, #f5f5f5, #ffffff)';

function HomeBanner() {
    const marketplaceCtx = useMarketplace();

    return (
        <section className='hero py-5' style={{ backgroundImage: marketplaceCtx.themeMode === 'light' ? heroBg : '' }}>
            {marketplaceCtx.themeMode === 'dark' && <div className='glow bottom-right'></div>}
            <div className='shape-1'></div>
            <div className='shape-2'></div>
            <div className='container py-5 z-index-20 position-relative mt-5'>
                <div className='row gy-5 align-items-stretch'>
                    <div className='col-lg-6 text-center text-lg-start order-2 order-lg-1 py-5'>
                        <h1 data-aos='fade-up' data-aos-delay='100' className='position-relative lh-1'>
                            Create, sell and collect digital NFTs.
                            <div className='shape-3'></div>
                        </h1>
                        <p className='text-muted lead pt-4' data-aos='fade-up' data-aos-delay='200'>
                            Introducing MetaRealFights, the fully functioning template to create your own decentralized NFT
                            ecosystem.
                        </p>
                        <p className='text-muted lead pb-4' data-aos='fade-up' data-aos-delay='200'>
                            This is the easiest way to get in on the next wave of innovation.
                        </p>
                        <ul className='list-inline'>
                            <li className='list-inline-item' data-aos='fade-up' data-aos-delay='300'>
                                <Link className='btn py-2 btn-gradient-primary' to='/mint'>
                                    <i className='lab la-ethereum me-1'></i>
                                    Create NFT
                                </Link>
                            </li>
                            <li className='list-inline-item' data-aos='fade-up' data-aos-delay='400'>
                                <Link className='btn py-2 btn-dark' to='/explore'>
                                    <i className='las la-compass me-1'></i>
                                    Discover
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className='col-lg-6 order-1 order-lg-2'>
                        <HeroImages />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeBanner;
