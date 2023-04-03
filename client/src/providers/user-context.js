import React from 'react';

const UserContext = React.createContext({
    contract: null,
    appOwner: null,
    appOwnerDetails: null,
    userInformation: null,
    usersList: null,
    userBalance: null,
    whiteList: null,
    activity: null,
    userAssets: null,
    userInformationError: false,
    usersListError: false,
    userIsLoading: true,
    userIsRegistered: true,
    getUserInformation: () => {},
    getAppOwner: () => {},
    getAppOwnerDetails: () => {},
    loadUserBalance: () => {},
    getUsersList: () => {},
    loadWhiteList: () => {},
    loadUserAssets: () => {},
    loadContract: () => {},
    loadActivity: () => {},
    checkRegisteration: () => {},
    setUserIsLoading: () => {},
});

export default UserContext;
