import React from 'react';
import { motion } from 'framer-motion/dist/es/index';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

const fullScreenLoaderStyle = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(255, 255, 255, 0.99)',
    zIndex: '9999',
};
const fullScreenLoaderStyleDark = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(28, 28, 34, 0.99)',
    zIndex: '9999',
};

function MetaMaskLoader() {
    const marketplaceCtx = useMarketplace();

    return (
        <motion.div
            className='d-flex flex-column align-items-start justify-content-between'
            style={marketplaceCtx.themeMode === 'light' ? fullScreenLoaderStyle : fullScreenLoaderStyleDark}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            <div></div>
            <div className='text-center w-100 p-4'>
                <p className='h1 fw-light mb-0'>Cela prend normalement un peu de temps</p>
                <p className='h3 fw-light'>Ne rechargez pas votre navigateur</p>
            </div>
            <div className='d-flex align-items-center justify-content-center p-5'>
                <img src='/images/metamask.png' alt='MetaMask' width='40' />
                <div className='ms-3'>
                    <p className='h6 mb-2'>Traitement des transactions</p>
                    <div className='cloud m-0'></div>
                </div>
            </div>
        </motion.div>
    );
}

export default MetaMaskLoader;
