import React from 'react';

const AuctionContext = React.createContext({
    contract: null,
    userFunds: 0,
    auctions: [],
    auctionsLog: [],
    auctionsData: [],
    userBids: [],
    auctionTransactionLoading: false,
    fetchingLoading: false,
    loadContract: () => {},
    loadUserFunds: () => {},
    loadAuctions: () => {},
    setFetchingLoading: () => {},
    loadAuctionsData: () => {},
    loadUserBids: () => {},
    setAuctionTransactionLoading: () => {},
});

export default AuctionContext;
