import React, { useReducer } from 'react';

import UserContext from './user-context';

const defaultUserState = {
    contract: null,
    appOwner: null,
    userInformation: null,
    appOwnerDetails: null,
    userInformationError: false,
    usersList: null,
    whiteList: null,
    userAssets: null,
    userBalance: null,
    activity: null,
    usersListError: false,
    userIsRegistered: true,
    userIsLoading: true,
};

const UserReducer = (state, action) => {
    if (action.type === 'USERCONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'GETUSERINFO') {
        return {
            ...state,
            userInformation: {
                ...state.userInformation,
                fullName: action.userInformation[1],
                email: action.userInformation[2],
                role: action.userInformation[3],
                about: action.userInformation[4],
                facebook: action.userInformation[5],
                twitter: action.userInformation[6],
                instagram: action.userInformation[7],
                dribbble: action.userInformation[8],
                header: action.userInformation[9],
                avatar: action.userInformation[10],
            },
        };
    }

    if (action.type === 'GETUSERINFOERROR') {
        return {
            ...state,
            userInformationError: true,
        };
    }

    if (action.type === 'GETUSERSLIST') {
        const appUsersList = action.usersList.map((item, index) => {
            return {
                account: item[0],
                fullName: item[1],
                email: item[2],
                role: item[3],
                about: item[4],
                facebook: item[5],
                twitter: item[6],
                instagram: item[7],
                dribbble: item[8],
                header: item[9],
                avatar: item[10],
            };
        });
        const uniqueUsersList = [...new Map(appUsersList.map((item) => [item['account'], item])).values()];
        return {
            ...state,
            usersList: uniqueUsersList,
        };
    }

    if (action.type === 'GETUSERSLISTERROR') {
        return {
            ...state,
            usersListError: true,
        };
    }

    if (action.type === 'GETACTIVITY') {
        return {
            ...state,
            activity: action.activity.map((el) => {
                return {
                    address: el[0],
                    price: el[1],
                    royalties: parseInt(el[2]),
                    commission: parseInt(el[3]) / 10,
                    type: el[5],
                    time: parseInt(el[4]) * 1000,
                };
            }),
        };
    }

    if (action.type === 'GETOWNER') {
        return {
            ...state,
            appOwner: action.appOwner,
        };
    }

    if (action.type === 'GETUSERBALANCE') {
        return {
            ...state,
            userBalance: action.userBalance,
        };
    }

    if (action.type === 'GETUSERASSETS') {
        return {
            ...state,
            userAssets: {
                created: action.userAssets[0],
            },
        };
    }

    if (action.type === 'GETWHITELIST') {
        return {
            ...state,
            whiteList: action.whiteList.map((user) => {
                return {
                    address: user,
                };
            }),
        };
    }

    if (action.type === 'GETOWNERDETAILS') {
        return {
            ...state,
            appOwnerDetails: {
                ...state.appOwnerDetails,
                fullName: action.appOwnerDetails[1],
                email: action.appOwnerDetails[2],
                role: action.appOwnerDetails[3],
                about: action.appOwnerDetails[4],
            },
        };
    }

    if (action.type === 'ISREGISTERED') {
        return {
            ...state,
            userIsRegistered: action.userIsRegistered,
        };
    }

    if (action.type === 'LOADING') {
        return {
            ...state,
            userIsLoading: action.loading,
        };
    }

    return defaultUserState;
};

const UserProvider = (props) => {
    const [UserState, dispatchUserAction] = useReducer(UserReducer, defaultUserState);

    const loadContractHandler = (web3, UserInfo, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(UserInfo.abi, deployedNetwork.address) : '';
        dispatchUserAction({ type: 'USERCONTRACT', contract: contract });
        return contract;
    };

    const setUserIsLoadingHandler = (loading) => {
        dispatchUserAction({ type: 'LOADING', loading: loading });
    };

    const getUserInformationHandler = async (userContract, account) => {
        try {
            const userInformation = await userContract.methods.getUser(account).call();
            dispatchUserAction({ type: 'GETUSERINFO', userInformation: userInformation });
            return userInformation;
        } catch (error) {
            // return;
            console.log('getUserInformationHandler', error);
        }
    };

    const getUsersListHandler = async (userContract) => {
        try {
            const usersList = await userContract.methods.getUsersList().call();
            dispatchUserAction({ type: 'GETUSERSLIST', usersList: usersList });
            return usersList;
        } catch (err) {
            // return;
            console.log('getUsersListHandler', err);
        }
    };

    const loadAppOwnerHandler = async (contract) => {
        try {
            const appOwner = await contract.methods.owner().call();
            dispatchUserAction({ type: 'GETOWNER', appOwner: appOwner });
            return appOwner;
        } catch (error) {
            //  return;
            console.log('loadAppOwnerHandler');
        }
    };

    const loadUserBalanceHandler = async (contract, account) => {
        try {
            const userBalance = await contract.methods.balanceOf(account).call();
            dispatchUserAction({ type: 'GETUSERBALANCE', userBalance: userBalance });
            return userBalance;
        } catch (error) {
            // return;
            console.log('loadUserBalanceHandler');
        }
    };

    const loadWhiteListHandler = async (contract) => {
        try {
            const whiteList = await contract.methods.getWhitelisted().call();
            dispatchUserAction({ type: 'GETWHITELIST', whiteList: whiteList });
            return whiteList;
        } catch (error) {
            // return;
            console.log('loadWhiteListHandler');
        }
    };

    const loadUserAssetsHandler = async (contract, account) => {
        try {
            const userAssets = await contract.methods.getCollect(account).call();
            dispatchUserAction({ type: 'GETUSERASSETS', userAssets: userAssets });
            return userAssets;
        } catch (error) {
            // return;
            console.log('loadUserAssets');
        }
    };

    const loadActivityHandler = async (contract) => {
        try {
            const activity = await contract.methods.get_activities().call();
            dispatchUserAction({ type: 'GETACTIVITY', activity: activity });
            return activity;
        } catch (error) {
            console.log(error);
        }
    };

    const checkRegisterationHandler = (userIsRegistered) => {
        dispatchUserAction({ type: 'ISREGISTERED', userIsRegistered: userIsRegistered });
    };

    const loadAppOwnerDetailsHandler = async (contract, account) => {
        const appOwnerDetails = await contract.methods.getUser(account).call();
        dispatchUserAction({ type: 'GETOWNERDETAILS', appOwnerDetails: appOwnerDetails });
        return appOwnerDetails;
    };

    const userContext = {
        contract: UserState.contract,
        appOwner: UserState.appOwner,
        appOwnerDetails: UserState.appOwnerDetails,
        userIsLoading: UserState.userIsLoading,
        userInformation: UserState.userInformation,
        userInformationError: UserState.userInformationError,
        usersList: UserState.usersList,
        usersListInformation: UserState.usersListInformation,
        userBalance: UserState.userBalance,
        whiteList: UserState.whiteList,
        userAssets: UserState.userAssets,
        activity: UserState.activity,
        userIsRegistered: UserState.userIsRegistered,
        getUsersList: getUsersListHandler,
        getUserInformation: getUserInformationHandler,
        getAppOwner: loadAppOwnerHandler,
        getAppOwnerDetails: loadAppOwnerDetailsHandler,
        loadUserBalance: loadUserBalanceHandler,
        loadWhiteList: loadWhiteListHandler,
        loadUserAssets: loadUserAssetsHandler,
        loadActivity: loadActivityHandler,
        loadContract: loadContractHandler,
        setUserIsLoading: setUserIsLoadingHandler,
        checkRegisteration: checkRegisterationHandler,
    };

    return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

export default UserProvider;
