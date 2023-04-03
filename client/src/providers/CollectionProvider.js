import React, { useReducer } from 'react';

import CollectionContext from './collection-context';

const defaultCollectionState = {
    contract: null,
    totalSupply: null,
    assetHistory: null,
    nftCreator: null,
    collection: [],
    nftTransactionLoading: false,
    nftIsLoading: true,
};

const collectionReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'GETPAYMENTTOKENCONTRACT') {
        return {
            ...state,
            paymentTokenContract: action.paymentTokenContract,
        };
    }

    if (action.type === 'LOADSUPPLY') {
        return {
            ...state,
            totalSupply: action.totalSupply,
        };
    }

    if (action.type === 'LOADCOLLECTION') {
        // const mK
        return {
            ...state,
            collection: action.collection
                .filter((item, d) => item[0][0] !== '')
                .map((item, i) => {
                    return {
                        id: parseInt(item[1]),
                        title: item[0][0],
                        description: item[0][1],
                        img: item[0][2],
                        category: item[0][3],
                        unlockable: item[0][4],
                        type: item[0][5],
                        formate: item[0][6],
                        hasOffer: item[0][7],
                        creator: item[2],
                        owner: item[3],
                        price: item[4],
                        royalties: item[5],
                        isPromoted: item[7],
                        isApproved: item[8],
                        inAuction: item[9],
                        dateCreated: parseInt(item[10]) * 1000,
                    };
                }),
        };
    }

    if (action.type === 'GETASSETHISTORY') {
        return {
            ...state,
            assetHistory: action.assetHistory,
        };
    }

    if (action.type === 'UPDATECOLLECTION') {
        const index = state.collection.findIndex((NFT) => NFT.id === parseInt(action.NFT.id));
        let collection = [];

        if (index === -1) {
            collection = [action.NFT, ...state.collection];
        } else {
            collection = [...state.collection];
        }

        return {
            ...state,
            collection: collection,
        };
    }

    if (action.type === 'UPDATEOWNER') {
        const index = state.collection.findIndex((NFT) => NFT.id === parseInt(action.id));
        let collection = [...state.collection];
        collection[index].owner = action.newOwner;

        return {
            ...state,
            collection: collection,
        };
    }

    if (action.type === 'GETPAYMENTTOKEN') {
        return {
            ...state,
            paymentToken: action.paymentToken,
        };
    }

    if (action.type === 'LOADING') {
        return {
            ...state,
            nftIsLoading: action.loading,
        };
    }

    if (action.type === 'GETAUCTIONBIDS') {
        return {
            ...state,
            auctionBids: action.auctionBids,
        };
    }

    if (action.type === 'TRANSACTIONLOADING') {
        return {
            ...state,
            nftTransactionLoading: action.loading,
        };
    }

    if (action.type === 'UPDATEAUCTION') {
        return {
            ...state,
            auctionIsUpdating: action.loading,
        };
    }

    return defaultCollectionState;
};

const CollectionProvider = (props) => {
    const [CollectionState, dispatchCollectionAction] = useReducer(collectionReducer, defaultCollectionState);

    const loadContractHandler = (web3, NFTCollection, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(NFTCollection.abi, deployedNetwork.address) : '';
        dispatchCollectionAction({ type: 'CONTRACT', contract: contract });
        return contract;
    };

    const loadTotalSupplyHandler = async (contract) => {
        const totalSupply = await contract.methods.totalSupply().call();
        dispatchCollectionAction({ type: 'LOADSUPPLY', totalSupply: totalSupply });
        return totalSupply;
    };

    const loadCollectionHandler = async (contract) => {
        const collection = await contract.methods.getCollections().call();
        dispatchCollectionAction({ type: 'LOADCOLLECTION', collection: collection });
        return collection;
    };

    const updateOwnerHandler = (id, newOwner) => {
        dispatchCollectionAction({ type: 'UPDATEOWNER', id: id, newOwner: newOwner });
    };

    const getAssetHistoryHandler = async (contract, id) => {
        const assetHistory = await contract.methods.getTrack(id).call();
        dispatchCollectionAction({ type: 'GETASSETHISTORY', assetHistory: assetHistory });
        return assetHistory;
    };

    const setNftIsLoadingHandler = (loading) => {
        dispatchCollectionAction({ type: 'LOADING', loading: loading });
    };
    const setNftTransactionLoadingHandler = (loading) => {
        dispatchCollectionAction({ type: 'TRANSACTIONLOADING', loading: loading });
    };

    const collectionContext = {
        contract: CollectionState.contract,
        totalSupply: CollectionState.totalSupply,
        collection: CollectionState.collection,
        nftIsLoading: CollectionState.nftIsLoading,
        nftTransactionLoading: CollectionState.nftTransactionLoading,
        assetHistory: CollectionState.assetHistory,
        // nftHistory: CollectionState.nftHistory,
        nftCreator: CollectionState.nftCreator,
        loadContract: loadContractHandler,
        loadTotalSupply: loadTotalSupplyHandler,
        loadCollection: loadCollectionHandler,
        // updateCollection: updateCollectionHandler,
        updateOwner: updateOwnerHandler,
        setNftIsLoading: setNftIsLoadingHandler,
        setNftTransactionLoading: setNftTransactionLoadingHandler,
        getAssetHistory: getAssetHistoryHandler,
        // getNftHistory: getNftHistoryHandler,
    };

    return <CollectionContext.Provider value={collectionContext}>{props.children}</CollectionContext.Provider>;
};

export default CollectionProvider;
