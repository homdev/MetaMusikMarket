import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'aos/dist/aos.css';
import Web3Provider from './providers/Web3Provider';
import CollectionProvider from './providers/CollectionProvider';
import MarketplaceProvider from './providers/MarketplaceProvider';
import UserProvider from './providers/UserProvider';
import AuctionProvider from './providers/AuctionProvider';
import AnalyticsProvider from './providers/AnalyticsProvider';
import { ToastProvider } from 'react-toast-notifications';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

ReactDOM.render(
    <Web3Provider>
        <CollectionProvider>
            <MarketplaceProvider>
                <AuctionProvider>
                    <UserProvider>
                        <AnalyticsProvider>
                            <ToastProvider autoDismiss autoDismissTimeout={6000} placement='top-center'>
                                <BrowserRouter>
                                    <App />
                                </BrowserRouter>
                            </ToastProvider>
                        </AnalyticsProvider>
                    </UserProvider>
                </AuctionProvider>
            </MarketplaceProvider>
        </CollectionProvider>
    </Web3Provider>,
    document.getElementById('root')
);
