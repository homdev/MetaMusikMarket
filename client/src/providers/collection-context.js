import React from 'react';

const CollectionContext = React.createContext({
    contract: null,
    totalSupply: null,
    collection: [],
    assetHistory: null,
    // nftHistory: null,
    nftCreator: null,
    nftIsLoading: true,
    nftTransactionLoading: false,
    loadContract: () => {},
    loadTotalSupply: () => {},
    loadCollection: () => {},
    updateTotalSupply: () => {},
    updateCollection: () => {},
    updateOwner: () => {},
    setNftIsLoading: () => {},
    setNftTransactionLoading: () => {},
    getAssetHistory: () => {},
    // getNftHistory: () => {},
    getTokenMetaData: () => {},
});

export default CollectionContext;
