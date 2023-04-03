import React from 'react';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

const alertStyle = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
    textAlign: 'center',
};

const alertStyleDark = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    background: '#1c1c22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
    textAlign: 'center',
};

const webExtension = [
    {
        name: 'Chrome',
        url: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',
        image: '/images/chrome.png',
    },
    {
        name: 'Firefox',
        url: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
        image: '/images/firefox.png',
    },
    {
        name: 'Safari',
        url: 'https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202',
        image: '/images/safari.png',
    },
];

function NoMetaMaskAlert() {
    const marketplaceCtx = useMarketplace();

    return (
        <div className='alert p-3' style={marketplaceCtx.themeMode === 'light' ? alertStyle : alertStyleDark}>
            <div className='row w-100'>
                <div className='col-lg-7 mx-auto'>
                    <div className='alert-inner p-4 p-lg-5 rounded'>
                        <img
                            className='mb-4'
                            src={
                                marketplaceCtx.themeMode === 'dark'
                                    ? settings.UISettings.logo
                                    : settings.UISettings.logoLight
                            }
                            alt={settings.UISettings.marketplaceBrandName}
                            width='150'
                        />
                        <h2 className='fw-light mb-3'>We've noticed that you don't have MetaMask installed</h2>
                        <p className='lead text-muted mb-3'>
                            You didn't break the internet, install MetaMask and every this will work just fine.
                        </p>
                        <ul className='list-inline mb-4'>
                            {webExtension.map((extension, index) => {
                                return (
                                    <li className='list-inline-item mx-3' key={index}>
                                        <a
                                            href={extension.url}
                                            className='text-reset'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <img
                                                src={extension.image}
                                                alt={extension.name}
                                                width='40'
                                                className='mb-3'
                                            />
                                            <p>Download for {extension.name}</p>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className='d-inline-block'>
                            <p className='text-muted py-2 px-3 bg-light rounded mb-0 d-flex align-items-center justify-content-center'>
                                <i className='las la-info-circle me-2 text-primary'></i>
                                Please consider reloading this window after installing the extension.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoMetaMaskAlert;
