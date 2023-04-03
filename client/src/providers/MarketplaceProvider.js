import React, { useReducer } from 'react';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
    contract: null,
    offerCount: null,
    contractAddress: null,
    offers: [],
    sellers: null,
    promotionPrice: null,
    userFunds: 0,
    mktIsLoading: true,
    themeMode: 'dark',
};

const marketplaceReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'LOADOFFERCOUNT') {
        return {
            ...state,
            offerCount: action.offerCount,
        };
    }

    if (action.type === 'LOADOFFERS') {
        return {
            ...state,
            offers: action.offers,
        };
    }

    if (action.type === 'UPDATEOFFER') {
        const offers = state.offers.filter((offer) => offer.offerId !== parseInt(action.offerId));

        return {
            ...state,
            offers: offers,
        };
    }

    if (action.type === 'ADDOFFER') {
        const index = state.offers.findIndex((offer) => offer.offerId === parseInt(action.offer.offerId));
        let offers = [];

        if (index === -1) {
            offers = [
                ...state.offers,
                {
                    offerId: parseInt(action.offer.offerId),
                    id: parseInt(action.offer.id),
                    user: action.offer.user,
                    price: parseInt(action.offer.price),
                    fulfilled: false,
                    cancelled: false,
                },
            ];
        } else {
            offers = [...state.offers];
        }

        return {
            ...state,
            offers: offers,
        };
    }

    if (action.type === 'LOADFUNDS') {
        return {
            ...state,
            userFunds: parseInt(action.userFunds),
        };
    }

    if (action.type === 'LOADING') {
        return {
            ...state,
            mktIsLoading: action.loading,
        };
    }

    if (action.type === 'SWITCHMODE') {
        return {
            ...state,
            themeMode: action.themeMode,
        };
    }

    if (action.type === 'PROMOTIONPRICE') {
        return {
            ...state,
            promotionPrice: action.promotionPrice,
        };
    }

    if (action.type === 'GETCONTRACTADDRESS') {
        return {
            ...state,
            contractAddress: action.contractAddress,
        };
    }

    if (action.type === 'LOADSELLERS') {
        return {
            ...state,
            sellers: action.sellers
                .map((seller) => {
                    return {
                        address: seller[0],
                        value: seller[1],
                    };
                })
                .filter((seller) => seller.value > 0),
        };
    }

    return defaultMarketplaceState;
};

const MarketplaceProvider = (props) => {
    const [MarketplaceState, dispatchMarketplaceAction] = useReducer(marketplaceReducer, defaultMarketplaceState);

    const loadContractHandler = (web3, NFTMarketplace, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(NFTMarketplace.abi, deployedNetwork.address) : '';
        dispatchMarketplaceAction({ type: 'CONTRACT', contract: contract });
        return contract;
    };

    const loadOffersHandler = async (contract, offerCount) => {
        let offers = [];
        for (let i = 0; i < offerCount; i++) {
            const offer = await contract.methods.offers(i + 1).call();
            offers.push(offer);
        }
        offers = offers
            .map((offer) => {
                offer.offerId = parseInt(offer.offerId);
                offer.id = parseInt(offer.id);
                offer.price = parseInt(offer.price);
                return offer;
            })
            .filter((offer) => offer.fulfilled === false && offer.cancelled === false);
        dispatchMarketplaceAction({ type: 'LOADOFFERS', offers: offers });
    };

    const updateOfferHandler = (offerId) => {
        dispatchMarketplaceAction({ type: 'UPDATEOFFER', offerId: offerId });
    };

    const addOfferHandler = (offer) => {
        dispatchMarketplaceAction({ type: 'ADDOFFER', offer: offer });
    };

    const loadUserFundsHandler = async (contract, account) => {
        const userFunds = await contract.methods.userFunds(account).call();
        dispatchMarketplaceAction({ type: 'LOADFUNDS', userFunds: userFunds });
        return userFunds;
    };

    const loadSellersHandler = async (contract) => {
        const sellers = await contract.methods.getSellers().call();
        dispatchMarketplaceAction({ type: 'LOADSELLERS', sellers: sellers });
        return sellers;
    };

    const getContractAddressHandler = async (contract) => {
        try {
            const contractAddress = await contract._address;
            dispatchMarketplaceAction({ type: 'GETCONTRACTADDRESS', contractAddress: contractAddress });
            return contractAddress;
        } catch (error) {
            console.log(error);
        }
    };

    const setMktIsLoadingHandler = (loading) => {
        dispatchMarketplaceAction({ type: 'LOADING', loading: loading });
    };

    const switchModeHandler = (themeMode) => {
        dispatchMarketplaceAction({ type: 'SWITCHMODE', themeMode: themeMode });
    };

    const laodPromotionPriceHandler = async (contract) => {
        const promotionPrice = await contract.methods.promotionPrice().call();
        dispatchMarketplaceAction({ type: 'PROMOTIONPRICE', promotionPrice: promotionPrice });
        return promotionPrice;
    };

    const marketplaceContext = {
        contract: MarketplaceState.contract,
        offerCount: MarketplaceState.offerCount,
        offers: MarketplaceState.offers,
        sellers: MarketplaceState.sellers,
        userFunds: MarketplaceState.userFunds,
        contractAddress: MarketplaceState.contractAddress,
        mktIsLoading: MarketplaceState.mktIsLoading,
        themeMode: MarketplaceState.themeMode,
        promotionPrice: MarketplaceState.promotionPrice,
        loadContract: loadContractHandler,
        loadOffers: loadOffersHandler,
        updateOffer: updateOfferHandler,
        addOffer: addOfferHandler,
        loadSellers: loadSellersHandler,
        loadUserFunds: loadUserFundsHandler,
        getContractAddress: getContractAddressHandler,
        setMktIsLoading: setMktIsLoadingHandler,
        switchMode: switchModeHandler,
        laodPromotionPrice: laodPromotionPriceHandler,
    };

    return <MarketplaceContext.Provider value={marketplaceContext}>{props.children}</MarketplaceContext.Provider>;
};

export default MarketplaceProvider;
