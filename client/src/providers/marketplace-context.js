import React from 'react';

const MarketplaceContext = React.createContext({
    contract: null,
    offerCount: null,
    offers: [],
    userFunds: 0,
    contractAddress: null,
    mktIsLoading: true,
    sellers: null,
    promotionPrice: null,
    themeMode: 'dark',
    loadContract: () => {},
    loadOfferCount: () => {},
    loadOffers: () => {},
    updateOffer: () => {},
    addOffer: () => {},
    loadSellers: () => {},
    loadUserFunds: () => {},
    getContractAddress: () => {},
    setMktIsLoading: () => {},
    switchMode: () => {},
    laodPromotionPrice: () => {},
});

export default MarketplaceContext;
