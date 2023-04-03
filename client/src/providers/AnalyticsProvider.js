import React, { useReducer } from 'react';
import AnalyticsContext from './analytics-context';

const defaultAnalyticsState = {
    contract: null,
    transactions: null,
    nftHistory: null,
};

const analyticsReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'GETTRANSACTIONS') {
        return {
            ...state,
            transactions: action.transactions
                .filter((el) => el[0][0] !== '0x0000000000000000000000000000000000000000')
                .map((el) => {
                    return {
                        from: {
                            address: el[0][0],
                            name: el[0][1],
                            avatar: el[0][2],
                        },
                        to: {
                            address: el[1][0],
                            name: el[1][1],
                            avatar: el[1][2],
                        },
                        tokenId: parseInt(el[2]),
                        price: parseFloat(el[3]),
                        time: parseInt(el[4]) * 1000,
                    };
                }),
        };
    }

    if (action.type === 'GETNFTHISTORY') {
        return {
            ...state,
            nftCreator: {
                account: action.nftHistory[0][0][0],
                name: action.nftHistory[0][0][1],
                avatar: action.nftHistory[0][0][2],
                time: parseInt(action.nftHistory[0][2]) * 1000,
            },
            nftHistory: action.nftHistory.slice(1).map((el) => {
                return {
                    from: {
                        account: el[0][0],
                        name: el[0][1],
                        avatar: el[0][2],
                    },
                    to: {
                        account: el[1][0],
                        name: el[1][1],
                        avatar: el[1][2],
                    },
                    time: parseInt(el[2]) * 1000,
                    price: el[3],
                };
            }),
        };
    }

    return defaultAnalyticsState;
};

const AnalyticsProvider = (props) => {
    const [AnalyticsState, dispatchAnalyticsAction] = useReducer(analyticsReducer, defaultAnalyticsState);

    const loadContractHandler = (web3, UserInfo, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(UserInfo.abi, deployedNetwork.address) : '';
        dispatchAnalyticsAction({ type: 'CONTRACT', contract: contract });
        return contract;
    };

    const loadTransactionsHandler = async (contract) => {
        try {
            const transactions = await contract.methods.get_transactions().call();
            dispatchAnalyticsAction({ type: 'GETTRANSACTIONS', transactions: transactions });
            return transactions;
        } catch (error) {
            console.log(error);
        }
    };

    const getNftHistoryHandler = async (contract, id) => {
        try {
            const nftHistory = await contract.methods.getNFTTransactions(id).call();
            dispatchAnalyticsAction({ type: 'GETNFTHISTORY', nftHistory: nftHistory });
            return nftHistory;
        } catch (error) {
            return;
        }
    };

    const analyticsContext = {
        contract: AnalyticsState.contract,
        transactions: AnalyticsState.transactions,
        nftHistory: AnalyticsState.nftHistory,
        loadContract: loadContractHandler,
        loadTransactions: loadTransactionsHandler,
        getNftHistory: getNftHistoryHandler,
    };

    return <AnalyticsContext.Provider value={analyticsContext}>{props.children}</AnalyticsContext.Provider>;
};

export default AnalyticsProvider;
