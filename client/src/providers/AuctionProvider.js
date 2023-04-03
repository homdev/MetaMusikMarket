import React, { useReducer } from 'react';

import AuctionContext from './auction-context';

const defaultAuctionState = {
    contract: null,
    auctions: [],
    auctionsLog: [],
    auctionsData: [],
    userBids: [],
    userFunds: 0,
    auctionTransactionLoading: false,
    fetchingLoading: false,
};

const auctionReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'LOADFUNDS') {
        return {
            ...state,
            userFunds: parseInt(action.userFunds),
        };
    }

    if (action.type === 'GETAUCTIONS') {
        return {
            ...state,
            auctions: action.auctions
                .filter((auc) => auc[6] !== true)
                .map((auc) => {
                    return {
                        tokenId: parseInt(auc[0]),
                        tokenUri: auc[1],
                        auctionId: parseInt(auc[2]),
                        owner: auc[3],
                        endAt: parseInt(auc[4]),
                        isActive: auc[5],
                        isCancelled: auc[6],
                        bids: auc[7].map((bid) => {
                            return {
                                bidder: bid[1],
                                amount: parseInt(bid[2]),
                                bidTime: parseInt(bid[3]),
                                withdraw: bid[4],
                            };
                        }),
                    };
                }),
            auctionsLog: action.auctions.map((auc) => {
                return {
                    tokenId: parseInt(auc[0]),
                    tokenUri: auc[1],
                    auctionId: parseInt(auc[2]),
                    owner: auc[3],
                    endAt: parseInt(auc[4]),
                    isActive: auc[5],
                    isCancelled: auc[6],
                    bids: auc[7].map((bid) => {
                        return {
                            bidder: bid[1],
                            amount: parseInt(bid[2]),
                            bidTime: parseInt(bid[3]),
                            withdraw: bid[4],
                        };
                    }),
                };
            }),
        };
    }

    if (action.type === 'GETAUCTIONSDATA') {
        return {
            ...state,
            auctionsData: action.auctionsData,
        };
    }

    if (action.type === 'GETUSERBIDS') {
        return {
            ...state,
            userBids: action.userBids.map((bid) => {
                return {
                    tokenId: parseInt(bid[0]),
                    amount: parseInt(bid[2]),
                    bidTime: parseInt(bid[3]),
                    withdraw: bid[4],
                };
            }),
        };
    }

    if (action.type === 'TRANSACTIONLOADING') {
        return {
            ...state,
            auctionTransactionLoading: action.loading,
        };
    }

    if (action.type === 'FETCHING') {
        return {
            ...state,
            fetchingLoading: action.loading,
        };
    }

    return defaultAuctionState;
};

const AuctionProvider = (props) => {
    const [AuctionState, dispatchAuctionAction] = useReducer(auctionReducer, defaultAuctionState);

    const loadContractHandler = (web3, NFTAuction, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(NFTAuction.abi, deployedNetwork.address) : '';
        dispatchAuctionAction({ type: 'CONTRACT', contract: contract });
        return contract;
    };

    const loadUserFundsHandler = async (contract, account) => {
        const userFunds = await contract.methods.userFunds(account).call();
        dispatchAuctionAction({ type: 'LOADFUNDS', userFunds: userFunds });
        return userFunds;
    };

    const loadAuctionsHandler = async (contract) => {
        dispatchAuctionAction({ type: 'FETCHING', loading: true });
        try {
            const auctions = await contract.methods.getAuctions().call();
            dispatchAuctionAction({ type: 'GETAUCTIONS', auctions: auctions });
            if (auctions.ok) {
                setTimeout(() => {
                    dispatchAuctionAction({ type: 'FETCHING', loading: false });
                }, 3000);
            }
            return auctions;
        } catch (error) {
            console.log(error);
            dispatchAuctionAction({ type: 'FETCHING', loading: false });
        }
    };

    const loadAuctionsDataHandler = async (nftContract, auctions) => {
        let auctionsData = [];
        dispatchAuctionAction({ type: 'FETCHING', loading: true });
        for (let i = 0; i < auctions.length; i++) {
            try {
                if (auctions.length === 0) {
                    dispatchAuctionAction({ type: 'FETCHING', loading: false });
                }
                const auctionMetaData = await nftContract.methods.getAuctionMetaData(auctions[i].tokenId).call();
                const owner = await nftContract.methods.ownerOf(auctions[i].tokenId).call();
                auctionsData = [
                    {
                        tokenId: auctions[i].tokenId,
                        auctionId: auctions[i].auctionId,
                        title: auctionMetaData[0][0],
                        description: auctionMetaData[0][1],
                        img: auctionMetaData[0][2],
                        category: auctionMetaData[0][3],
                        dateCreated: parseInt(auctionMetaData[10]) * 1000,
                        royalties: auctionMetaData[5],
                        type: auctionMetaData[0][5],
                        formate: auctionMetaData[0][6],
                        unlockable: auctionMetaData[0][4],
                        endAt: auctions[i].endAt,
                        bids: auctions[i].bids,
                        owner: owner,
                        creator: auctionMetaData[2],
                        isPromoted: auctionMetaData[7],
                        cancelled: auctions[i].isCancelled,
                        active: auctions[i].isActive,
                        user: auctions[i].owner,
                    },
                    ...auctionsData,
                ];

                dispatchAuctionAction({ type: 'GETAUCTIONSDATA', auctionsData: auctionsData });
            } catch (error) {
                console.log(error);
                dispatchAuctionAction({ type: 'FETCHING', loading: false });
            }
        }
    };

    const loadUserBidsHandler = async (contract, address) => {
        try {
            const userBids = await contract.methods.userBids(address).call();
            dispatchAuctionAction({ type: 'GETUSERBIDS', userBids: userBids });
            return userBids;
        } catch (error) {
            console.log(error);
        }
    };

    const setAuctionTransactionLoadingHandler = (loading) => {
        dispatchAuctionAction({ type: 'TRANSACTIONLOADING', loading: loading });
    };

    const setFetchingLoadingHandler = (loading) => {
        dispatchAuctionAction({ type: 'FETCHING', loading: loading });
    };

    const auctionContext = {
        contract: AuctionState.contract,
        userFunds: AuctionState.userFunds,
        auctions: AuctionState.auctions,
        auctionsLog: AuctionState.auctionsLog,
        auctionsData: AuctionState.auctionsData,
        userBids: AuctionState.userBids,
        auctionTransactionLoading: AuctionState.auctionTransactionLoading,
        fetchingLoading: AuctionState.fetchingLoading,
        loadContract: loadContractHandler,
        loadUserFunds: loadUserFundsHandler,
        loadAuctions: loadAuctionsHandler,
        loadAuctionsData: loadAuctionsDataHandler,
        setFetchingLoading: setFetchingLoadingHandler,
        loadUserBids: loadUserBidsHandler,
        setAuctionTransactionLoading: setAuctionTransactionLoadingHandler,
    };

    return <AuctionContext.Provider value={auctionContext}>{props.children}</AuctionContext.Provider>;
};

export default AuctionProvider;
