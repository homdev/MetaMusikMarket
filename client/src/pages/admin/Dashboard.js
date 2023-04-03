import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { settings } from '../../helpers/settings.js';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useAnalytics from '../../hooks/useAnalytics';
import useWeb3 from '../../hooks/useWeb3.js';

// COMPONENTS
import UsersTable from './UsersTable';
import NftsTable from './NftsTable';
import AuctionsTable from './AuctionsTable';
import PendingNftsTable from './PendingNftsTable';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';

function Dashboard() {
    const userCtx = useUser();
    const collectionCtx = useCollection();
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();
    const analyticsCtx = useAnalytics();
    const web3Ctx = useWeb3();

    const [usersNumber, setUsersNumber] = useState(0);
    const [collectionNumber, setCollectionNumber] = useState(0);
    const [auctionsNumber, setAuctionsNumber] = useState(0);
    const [whiteListedNumber, setWhiteListedNumber] = useState(0);
    const [ownerFunds, setOwnerFunds] = useState(0);
    const [isMetaMaskOpened, setIsMetaMaskOpened] = useState(false);
    const { addToast } = useToasts();

    /*** =============================================== */
    //      GET USERS LIST LENGTH
    /*** =============================================== */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList) {
            setUsersNumber(userCtx.usersList.length);
        }
    }, [userCtx.contract, userCtx.usersList]);

    /*** =============================================== */
    //      GET Auctions LENGTH
    /*** =============================================== */
    useEffect(() => {
        if (auctionCtx.contract) {
            setAuctionsNumber(auctionCtx.auctions.filter((auc) => auc.isActive === true).length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.contract, auctionCtx.auctions]);

    /*** =============================================== */
    //      GET WHITELISTED USERS LENGTH
    /*** =============================================== */
    useEffect(() => {
        if (userCtx.contract && userCtx.whiteList) {
            setWhiteListedNumber(
                userCtx.whiteList.filter((user) => user.address !== '0x0000000000000000000000000000000000000000').length
            );
        }
    }, [userCtx.contract, userCtx.whiteList]);

    // Get Collection Number
    useEffect(() => {
        if (collectionCtx.contract && collectionCtx.collection) {
            setCollectionNumber(collectionCtx.collection.length);
        }
    }, [collectionCtx.contract, collectionCtx.collection]);

    /*** =============================================== */
    //      GET OWNER PROFITS
    /*** =============================================== */
    useEffect(() => {
        if (marketplaceCtx.contract && userCtx.contract && userCtx.appOwner) {
            async function getOwnerFunds() {
                const ownerFunds = await marketplaceCtx.contract.methods.userFunds(userCtx.appOwner).call();
                setOwnerFunds(ownerFunds);
            }
            getOwnerFunds();
        }
    }, [userCtx.appOwner, marketplaceCtx.contract, userCtx.contract]);

    /*** =============================================== */
    //      BLOCK NFT
    /*** =============================================== */
    function BlockNftHandler(ids) {
        collectionCtx.contract.methods
            .unwanted(ids)
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setIsMetaMaskOpened(true);
            })
            .once('sending', () => {
                setIsMetaMaskOpened(true);
            })
            .on('error', (e) => {
                addToast('Oops! Something went wrong', {
                    appearance: 'error',
                });
                setIsMetaMaskOpened(false);
            })
            .on('receipt', () => {
                addToast("Cool! you've blocked the selected NFT", {
                    appearance: 'success',
                });
                setIsMetaMaskOpened(false);
                collectionCtx.loadCollection(collectionCtx.contract);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
            });
    }

    /*** =============================================== */
    //      BLOCK AUCTION
    /*** =============================================== */
    function BlocAuctionHandler(ids) {
        auctionCtx.contract.methods
            .unwanted(ids)
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setIsMetaMaskOpened(true);
            })
            .once('sending', () => {
                setIsMetaMaskOpened(true);
            })
            .on('error', (e) => {
                addToast('Oops! Something went wrong', {
                    appearance: 'error',
                });
                setIsMetaMaskOpened(false);
            })
            .on('receipt', () => {
                addToast("Cool! you've blocked the selected Auctions", {
                    appearance: 'success',
                });
                setIsMetaMaskOpened(false);
                auctionCtx.loadAuctions(auctionCtx.contract);
                collectionCtx.loadCollection(collectionCtx.contract);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
            });
    }

    /*** =============================================== */
    //      APPROVE NFT
    /*** =============================================== */
    function approveNFTHandler(ids) {
        marketplaceCtx.contract.methods
            .approveNFT(ids)
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setIsMetaMaskOpened(true);
            })
            .once('sending', () => {
                setIsMetaMaskOpened(true);
            })
            .on('error', (e) => {
                addToast('Oops! Something went wrong', {
                    appearance: 'error',
                });
                setIsMetaMaskOpened(false);
            })
            .on('receipt', () => {
                collectionCtx.loadCollection(collectionCtx.contract);
                addToast("Cool! you've approved the selected Auctions", {
                    appearance: 'success',
                });
                setIsMetaMaskOpened(false);
            });
    }

    return (
        <>
            {isMetaMaskOpened && <MetaMaskLoader />}
            <div className='row g-4' data-aos='fade-up' data-aos-delay='200'>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>Total Registered Users</h5>
                            <p className='h2 fw-normal mb-0'>{usersNumber}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>Total NFTs</h5>
                            <p className='h2 fw-normal mb-0'>{collectionNumber}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>Open Auctions</h5>
                            <p className='h2 fw-normal mb-0'>{auctionsNumber}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>Marketplace Commission</h5>
                            <p className='h2 fw-normal mb-0'>{(settings.saleCommission / 1000) * 100}%</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>WhiteListed Users</h5>
                            <p className='h2 fw-normal mb-0'>{whiteListedNumber}</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-4'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5>Marketplace Owner Profits</h5>
                            <p className='h2 fw-normal mb-0'>
                                {parseFloat(ownerFunds / 10 ** 18)}{' '}
                                <span className='h5 fw-normal text-muted'>{settings.currency}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Pending NFTs</h5>
                            <PendingNftsTable approveNft={approveNFTHandler} />
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Users List</h5>
                            <UsersTable />
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>NFTs List</h5>
                            <NftsTable blockNfts={BlockNftHandler} />
                        </div>
                    </div>
                </div>
                <div className='col-lg-12'>
                    <div className='card shadow-0 rounded-xl p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Auctions List</h5>
                            <AuctionsTable blockAuction={BlocAuctionHandler} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;
