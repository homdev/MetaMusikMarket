import React from 'react';

const AnalyticsContext = React.createContext({
    contract: null,
    transactions: null,
    nftHistory: null,
    loadContract: () => {},
    loadTransactions: () => {},
    getNftHistory: () => {},
});

export default AnalyticsContext;
