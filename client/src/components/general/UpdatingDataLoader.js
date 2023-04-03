import React, { useContext } from 'react';
import { motion } from 'framer-motion/dist/es/index';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

const fullScreenLoaderStyle = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(255, 255, 255, 0.97)',
    zIndex: '9999',
};
const fullScreenLoaderStyleDark = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(28, 28, 34, 0.97)',
    zIndex: '9999',
};

function UpdatingDataLoader({ heading }) {
    const marketplaceCtx = useMarketplace();

    return (
        <motion.div
            className='d-flex align-items-center justify-content-center'
            style={marketplaceCtx.themeMode === 'light' ? fullScreenLoaderStyle : fullScreenLoaderStyleDark}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            <div className='row w-100'>
                <div className='col-lg-6 mx-auto'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <div className='me-3'>
                            <div className='box-loader'>
                                <div className='box-loader-inner'></div>
                            </div>
                        </div>
                        <div className='ms-1'>
                            <p className='h3 text-uppercase mb-2'>{heading}</p>
                            <p className='text-muted mb-0'>Veuillez patienter jusqu'à ce que nous mettions à jour vos données</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default UpdatingDataLoader;
