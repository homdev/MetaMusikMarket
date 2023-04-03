import React, { useState, useEffect } from 'react';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

function ViewOnlyAlert() {
    const marketplaceCtx = useMarketplace();
    const [viewport, setViewport] = useState('desktop');

    useEffect(() => {
        if (window.outerWidth > 991) {
            setViewport('desktop');
        } else {
            setViewport('mobile');
        }
        window.addEventListener('resize', function () {
            if (window.outerWidth > 991) {
                setViewport('desktop');
            } else {
                setViewport('mobile');
            }
        });
    }, []);

    return (
        <div className='viewonly-mode'>
            <div className='container'>
                <div
                    className='p-4 rounded-xl bg-white shadow-lg'
                    style={{
                        border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                    }}
                >
                    {viewport === 'desktop' ? (
                        <div className='d-flex align-items-center'>
                            <img src='/images/metamask.png' alt='Metamask' className='flex-shrink-0' width='40' />
                            <div className='ms-3'>
                                <h5 className='mb-0'>
                                Vous êtes en mode visualisation uniquement, veuillez vous connecter à{' '}
                                    <span className='text-primary'>{settings.UISettings.usedNetworkName}</span>
                                </h5>
                                <p className='text-muted mb-0'>
                                We notice that there's no connected MataMask wallet, please install it and connect
                                    to {settings.UISettings.usedNetworkName} et rechargez l'application
                                </p>
                            </div>
                            <div className='ms-auto'>
                                <a
                                    href='https://decentralizedcreator.com/create-metamask-wallet/'
                                    className='btn btn-gradient-primary text-nowrap'
                                    rel='noreferrer'
                                    target='_blank noopener'
                                >
                                    Mise en place du portefeuille
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className='d-flex align-items-center'>
                            <img src='/images/metamask.png' alt='Metamask' className='flex-shrink-0' width='40' />
                            <div className='ms-3'>
                                <h6 className='mb-0'>Ouvrir dans l'application MetaMask</h6>
                                <p className='text-muted mb-0 small'>
                                Ouvrez le navigateur de l'application mobile Metamask et basculez le réseau sur{' '}
                                    {settings.UISettings.usedNetworkName}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewOnlyAlert;
