import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { settings } from './helpers/settings';
import web3 from './connect-web3/web3';
import Web3 from 'web3';
import AOS from 'aos';

// CONTRACT ABIs
import Collectible from './contracts/Collectible.json';
import Marketplace from './contracts/Marketplace.json';
import UserInfo from './contracts/UserInfo.json';
import NFTAuction from './contracts/NFTAuction.json';
import NFTAnalytics from './contracts/NFTAnalytics.json';

// HOOKS
import useWeb3 from './hooks/useWeb3';
import useCollection from './hooks/useCollection';
import useMarketplace from './hooks/useMarketplace';
import useAuctions from './hooks/useAuctions';
import useUser from './hooks/useUser';
import useAnalytics from './hooks/useAnalytics';

// COMPONENTS
import Header from './components/general/Header';
import Footer from './components/general/Footer';
import ScrollTopButton from './components/general/ScrollTopButton';
import NotFound from './components/general/NotFound';
import NoMetaMaskAlert from './components/general/NoMetaMaskAlert';
import NoContractAlert from './components/general/NoContractAlert';
import ScrollToTop from './components/general/ScrollToTop';
import RegisterAlert from './components/general/RegisterAlert';
import ViewOnlyAlert from './components/general/ViewOnlyAlert';

// NEW PAGES
import HomePage from './pages/home';
import ActivityPage from './pages/activity';
import ExplorePage from './pages/explore';
import FAQsPage from './pages/faqs';
import AdminPage from './pages/admin';
import ContactPage from './pages/contact';
import AuthorsPage from './pages/authors';
import SearchPage from './pages/search';
import CategoryPage from './pages/category';
import AccountPage from './pages/account';
import RegisterPage from './pages/register';
import UserGalleryPage from './pages/user-gallery';
import MintNFTPage from './pages/mint';
import AuctionsPage from './pages/auctions';
import NFTSinglePage from './pages/nft-single';
import AuctionSinglePage from './pages/auction-single';

// Main Style
import './App.dark.css';
import './mode.switcher.css';

function App() {
    const web3Ctx = useWeb3();
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();
    const userCtx = useUser();
    const [noMetaMask, setNoMetaMask] = useState(false);
    const [noContract, setNoContract] = useState(false);
    const [registeredAlert, setRegisteredAlert] = useState(true);
    const [networkType, setNetworkType] = useState(null);
    const [topSellers, setTopSellers] = useState([]);
    const [networkId, setNetworkId] = useState(4);
    const [web3Provider, setWeb3Provider] = useState(
        window.ethereum ? new Web3(window.ethereum) : new Web3(settings.rpcUrl)
    );
    const { addToast } = useToasts();
    const history = useHistory();

    /*** ----------------------------------------------- */
    //      INITIATE AOS ANIMATION
    /*** ----------------------------------------------- */
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    /*** ----------------------------------------------- */
    //      GET TOP SELLERS
    /*** ----------------------------------------------- */
    useEffect(() => {
        if (marketplaceCtx.sellers && marketplaceCtx.sellers.length > 0) {
            setTopSellers(marketplaceCtx.sellers);
        }
    }, [marketplaceCtx.contract, marketplaceCtx.sellers]);

    /*** ----------------------------------------------- */
    //      GET ACTIVE NETWORK ID
    /*** ----------------------------------------------- */
    useEffect(() => {
        async function getNetworkId() {
            if (window.ethereum) {
                const networkId = await web3Ctx.loadNetworkId(new Web3(window.ethereum));
                setNetworkId(networkId);
            }
        }
        getNetworkId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*** ----------------------------------------------- */
    //      TOGGLE WEB3 PROVIDER
    /*** ----------------------------------------------- */
    useEffect(() => {
        if (window.ethereum && networkId === settings.networkId) {
            setWeb3Provider(new Web3(window.ethereum));
        } else {
            setWeb3Provider(new Web3(settings.rpcUrl));
        }
    }, [networkId]);

    useEffect(() => {
        /*** ----------------------------------------------- */
        //      CHECK IF THE BROWSER CONTAINS METAMASK
        /*** ----------------------------------------------- */
        if (!web3) {
            setNoMetaMask(true);
            document.body.style.overflow = 'hidden';
            return;
        }

        /*** ----------------------------------------------- */
        //      GET BLOCKCHAIN DATA
        /*** ----------------------------------------------- */
        const calclateInitialSettings = async () => {
            // Request accounts acccess if needed

            // Load account
            const account = await web3Ctx.loadAccount(web3Provider);

            // Load Network ID
            const networkId = await web3Ctx.loadNetworkId(web3Provider);
            // }

            // Load Contracts
            const nftDeployedNetwork = Collectible.networks[networkId];
            const nftContract = collectionCtx.loadContract(web3Provider, Collectible, nftDeployedNetwork);
            const mktDeployedNetwork = Marketplace.networks[networkId];
            const mktContract = marketplaceCtx.loadContract(web3Provider, Marketplace, mktDeployedNetwork);
            const userDeployedNetwork = UserInfo.networks[networkId];
            const userContract = userCtx.loadContract(web3Provider, UserInfo, userDeployedNetwork);
            const auctionDeployedNetwork = NFTAuction.networks[networkId];
            const auctionContract = auctionCtx.loadContract(web3Provider, NFTAuction, auctionDeployedNetwork);
            const analyticsDeployedNetwork = NFTAnalytics.networks[networkId];
            const analyticsContract = analyticsCtx.loadContract(web3Provider, NFTAnalytics, analyticsDeployedNetwork);

            if (nftContract) {
                // Load total Supply
                collectionCtx.loadTotalSupply(nftContract);

                // Load Collection
                collectionCtx.loadCollection(nftContract);

                if (window.ethereum && networkId === settings.networkId) {
                    // Event subscription
                    nftContract.events
                        .Transfer()
                        .on('data', (event) => {
                            collectionCtx.loadCollection(nftContract);
                            collectionCtx.setNftIsLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });
                }
            } else {
                setNoContract(false);
                return;
            }

            if (auctionContract) {
                auctionCtx.loadAuctions(auctionContract);
                account && auctionCtx.loadUserFunds(auctionContract, account);
                collectionCtx.loadTotalSupply(nftContract);

                if (window.ethereum && networkId === settings.networkId) {
                    auctionContract.events
                        .CreateAuction()
                        .on('data', (event) => {
                            auctionCtx.loadAuctions(auctionContract);
                            auctionCtx.setAuctionTransactionLoading(false);
                            history.push('/auctions');
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });
                    auctionContract.events
                        .CancelAuction()
                        .on('data', (event) => {
                            auctionCtx.loadAuctions(auctionContract);
                            auctionCtx.setAuctionTransactionLoading(false);
                            collectionCtx.loadCollection(nftContract);
                            history.push('/explore');
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });

                    auctionContract.events
                        .Bid()
                        .on('data', (event) => {
                            auctionCtx.loadAuctions(auctionContract);
                            auctionCtx.setAuctionTransactionLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });

                    auctionContract.events
                        .Withdraw()
                        .on('data', (event) => {
                            auctionCtx.loadAuctions(auctionContract);
                            auctionCtx.setAuctionTransactionLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });

                    auctionContract.events
                        .EndAuction()
                        .on('data', (event) => {
                            auctionCtx.loadAuctions(auctionContract);
                            auctionCtx.setAuctionTransactionLoading(false);
                            collectionCtx.loadCollection(nftContract);
                            history.push('/explore');
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });
                }
            } else {
                setNoContract(false);
                return;
            }

            if (mktContract) {
                marketplaceCtx.loadSellers(mktContract);
                marketplaceCtx.getContractAddress(mktContract);
                account && marketplaceCtx.loadUserFunds(mktContract, account);
                userCtx.getAppOwner(mktContract);

                if (window.ethereum && networkId === settings.networkId) {
                    // Event OfferFilled subscription
                    mktContract.events
                        .BoughtNFT()
                        .on('data', (event) => {
                            marketplaceCtx.updateOffer(event.returnValues._offerId);
                            collectionCtx.updateOwner(event.returnValues._tokenId, event.returnValues.winner);
                            marketplaceCtx.setMktIsLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });

                    // Event Offer subscription
                    mktContract.events
                        .Offer()
                        .on('data', (event) => {
                            marketplaceCtx.addOffer(event.returnValues);
                            marketplaceCtx.setMktIsLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });

                    // Event offerCancelled subscription
                    mktContract.events
                        .SaleCancelled()
                        .on('data', (event) => {
                            marketplaceCtx.updateOffer(event.returnValues.offerId);
                            collectionCtx.updateOwner(event.returnValues.id, event.returnValues.owner);
                            marketplaceCtx.setMktIsLoading(false);
                        })
                        .on('error', (error) => {
                            console.log(error);
                        });
                }
            } else {
                setNoContract(false);
                return;
            }

            // If User contract Loaded
            if (userContract) {
                userCtx.setUserIsLoading(false);
                account && userCtx.getUserInformation(userContract, account);
                userCtx.getUsersList(userContract);
                userCtx.loadWhiteList(userContract);
                userCtx.loadActivity(userContract);
            } else {
                userCtx.setUserIsLoading(true);
            }

            // If Analytics contract Loaded
            if (analyticsContract) {
                analyticsCtx.loadTransactions(analyticsContract);
            } else {
                userCtx.setUserIsLoading(true);
            }

            collectionCtx.setNftIsLoading(false);
            collectionCtx.setNftTransactionLoading(false);
            marketplaceCtx.setMktIsLoading(false);
            userCtx.setUserIsLoading(false);

            if (window.ethereum && networkId === settings.networkId) {
                // Metamask Event Subscription - Account changed
                window.ethereum.on('accountsChanged', (accounts) => {
                    web3Ctx.loadAccount(web3Provider);
                    userCtx.getUsersList(userContract);
                    accounts[0] && userCtx.getUserInformation(userContract, accounts[0]);
                    accounts[0] && marketplaceCtx.loadUserFunds(mktContract, accounts[0]);
                    accounts[0] && auctionCtx.loadUserFunds(auctionContract, accounts[0]);
                    addToast('Compte Changé !', {
                        appearance: 'success',
                    });
                    setRegisteredAlert(true);
                    if (userCtx.contract && userCtx.usersList) {
                        if (userCtx.usersList.length > 0) {
                            const registeredAccounts = userCtx.usersList.map((user) => user.account);
                            userCtx.checkRegisteration(registeredAccounts.includes(web3Ctx.account));
                        }
                    }
                });

                // Metamask Event Subscription - Network changed
                window.ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
                });

                await web3Provider.eth.net
                    .getNetworkType()
                    .then((res) => setNetworkType(res))
                    .catch((err) => console.log(err));
            }
        };

        calclateInitialSettings();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (window.ethereum && networkId !== settings.networkId) {
        // Metamask Event Subscription - Network changed
        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });
    }

    /*** ----------------------------------------------- */
    //      FETCHING AUCTIONS DATA
    /*** ----------------------------------------------- */
    useEffect(() => {
        if (collectionCtx.contract && auctionCtx.contract && auctionCtx.auctions) {
            auctionCtx.loadAuctionsData(
                collectionCtx.contract,
                auctionCtx.auctions.filter((auc) => auc.isActive === true)
            );
            auctionCtx.setFetchingLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collectionCtx.contract, auctionCtx.contract, auctionCtx.auctions]);

    /*** ----------------------------------------------- */
    //      CHECK IF USER IS REGISTERED
    /*** ----------------------------------------------- */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList) {
            if (userCtx.usersList.length > 0) {
                const registeredAccounts = userCtx.usersList.map((user) => user.account);
                userCtx.checkRegisteration(registeredAccounts.includes(web3Ctx.account));
            } else if (userCtx.usersList.length === 0) {
                userCtx.checkRegisteration(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.contract, userCtx.usersList, web3Ctx.account]);

    /*** ----------------------------------------------- */
    //      CLOSE REGISTERATION ALERT
    /*** ----------------------------------------------- */
    function closeAlert() {
        setRegisteredAlert(false);
    }

    /*** ----------------------------------------------- */
    //      RENDER ALERT IF METAMASK IS NOT EXISTED
    /*** ----------------------------------------------- */
    if (noMetaMask) {
        return <NoMetaMaskAlert />;
    }

    /*** ----------------------------------------------- */
    //      RENDER ALERT IF USER IS ON WRONG NETWORK
    /*** ----------------------------------------------- */
    if (noContract) {
        return <NoContractAlert network={networkType} />;
    }

    return (
        <div className='page-holder d-flex flex-column pt-5 pt-lg-0'>
            {window.ethereum && networkId !== settings.networkId && <NoContractAlert />}
            {!noContract && <Header netId={networkId} />}
            {!userCtx.userIsRegistered && web3Ctx.account && registeredAlert && (
                <RegisterAlert closeAlert={closeAlert} />
            )}
            <ScrollToTop>
                <Switch>
                    <Route path='/' exact>
                        <HomePage topSellers={topSellers} />
                        <ScrollTopButton />
                    </Route>
                    <Route path='/contact'>
                        <ContactPage />
                    </Route>
                    <Route path='/mint'>
                        <MintNFTPage netId={networkId} />
                    </Route>
                    <Route path='/explore'>
                        <ExplorePage />
                    </Route>
                    <Route path='/auctions'>
                        <AuctionsPage />
                    </Route>
                    <Route path='/assets/:id'>
                        <NFTSinglePage />
                    </Route>
                    <Route path='/nftauction/:id'>
                        <AuctionSinglePage />
                    </Route>
                    <Route path='/categories/:category'>
                        <CategoryPage />
                    </Route>
                    <Route path='/search'>
                        <SearchPage />
                    </Route>
                    <Route path='/activity'>
                        <ActivityPage />
                    </Route>
                    <Route path='/faq'>
                        <FAQsPage />
                    </Route>
                    {userCtx.appOwner === web3Ctx.account && userCtx.userIsRegistered && (
                        <Route path='/admin'>
                            <AdminPage />
                        </Route>
                    )}
                    <Route path='/users/:address'>
                        <UserGalleryPage topSellers={topSellers} />
                    </Route>
                    <Route path='/sellers'>
                        <AuthorsPage sellers={topSellers} />
                    </Route>
                    {userCtx.userIsRegistered && (
                        <Route path='/my-account'>
                            <AccountPage />
                        </Route>
                    )}
                    {!userCtx.userIsRegistered && (
                        <Route path='/register'>
                            <RegisterPage />
                        </Route>
                    )}
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </ScrollToTop>
            <Footer />

            {(window.ethereum && networkId === settings.networkId) || <ViewOnlyAlert />}
        </div>
    );
}

export default App;
