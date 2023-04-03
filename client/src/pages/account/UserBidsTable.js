import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { formatPrice, formteFullDate } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import { useToasts } from 'react-toast-notifications';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useAuctions from '../../hooks/useAuctions';
import useAnalytics from '../../hooks/useAnalytics';

function UserBidsTable() {
    const auctionCtx = useAuctions();
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const marketplaceCtx = useMarketplace();
    const analyticsCtx = useAnalytics();

    const [activeBids, setActiveBids] = useState([]);
    const { addToast } = useToasts();

    /*** ----------------------------------------- */
    //      GET USER BIDS
    /*** ----------------------------------------- */
    useEffect(() => {
        if (auctionCtx.contract) {
            auctionCtx.loadUserBids(auctionCtx.contract, web3Ctx.account);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionCtx.contract, web3Ctx.account]);

    /*** ----------------------------------------- */
    //      GET USER ACTIVE BIDS
    /*** ----------------------------------------- */
    useEffect(() => {
        if (auctionCtx.contract) {
            setActiveBids(auctionCtx.userBids.filter((bid) => bid.amount !== 0));
        }
    }, [auctionCtx.contract, web3Ctx.account, auctionCtx.userBids]);

    console.log(activeBids);

    /*** ----------------------------------------- */
    //      WITHDRAW BID FUNCTION
    /*** ----------------------------------------- */
    const withdrawBidHandler = (event, tokenId, auctionId) => {
        event.preventDefault();

        console.log(auctionId);

        auctionCtx.contract.methods
            .withdraw(tokenId, auctionId)
            .send({ from: web3Ctx.account })
            .once('sending', () => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('transactionHash', (hash) => {
                auctionCtx.setAuctionTransactionLoading(true);
            })
            .on('receipt', () => {
                auctionCtx.setAuctionTransactionLoading(false);
                analyticsCtx.loadTransactions(analyticsCtx.contract);
                userCtx.loadActivity(userCtx.contract);
                auctionCtx.loadUserBids(auctionCtx.contract, web3Ctx.account);
            })
            .on('error', (error) => {
                addToast('Oops! an error occured', {
                    appearance: 'error',
                });
                auctionCtx.setAuctionTransactionLoading(false);
            });
    };

    /*** ----------------------------------------- */
    //      TABLE COLUMNS
    /*** ----------------------------------------- */
    const columns = [
        {
            name: 'Auction',
            selector: (row) => row.tokenId,
            cell: (row) => (
                <div row={row}>
                    {auctionCtx.auctionsData.length > 0 && (
                        <Link to={`/nftauction/${row.tokenId}`} className='text-reset'>
                            <p className='fw-bold mb-0'>
                                {auctionCtx.auctionsData.filter((auc) => auc.tokenId === row.tokenId).length > 0 &&
                                    auctionCtx.auctionsData.filter((auc) => auc.tokenId === row.tokenId)[0].title}
                            </p>
                        </Link>
                    )}
                </div>
            ),
        },
        {
            name: 'Bid Time',
            selector: (row) => row.bidTime,
            cell: (row) => (
                <div row={row}>
                    <p className='mb-0 fw-bold'>{formteFullDate(row.bidTime)}</p>
                </div>
            ),
        },
        {
            name: 'Bid Amount',
            selector: (row) => row.amount,
            cell: (row) => (
                <div row={row}>
                    <p className='mb-0 fw-bold'>
                        {formatPrice(row.amount).toFixed(3)} {settings.currency}
                    </p>
                </div>
            ),
        },
        {
            name: 'Action',
            selector: (row) => row.tokenId,
            cell: (row) => (
                <div row={row}>
                    {auctionCtx.auctionsData.length > 0 && (
                        <button
                            className='btn btn-danger btn-sm pt-2'
                            type='button'
                            onClick={(e) =>
                                withdrawBidHandler(
                                    e,
                                    row.tokenId,
                                    auctionCtx.auctionsLog.filter(
                                        (auc) =>
                                            auc?.bids.filter((bid) => bid?.bidder === web3Ctx.account)?.at(-1)
                                                ?.bidTime === row.bidTime
                                    )[0].auctionId
                                )
                            }
                        >
                            Se retirer
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        activeBids.length > 0 &&
        auctionCtx.contract && (
            <>
                <h3 className='h3 mb-4 text-center'>Mes offres</h3>
                <DataTable
                    columns={columns}
                    data={activeBids}
                    pagination={activeBids.length >= 10 && true}
                    responsive
                    theme={marketplaceCtx.themeMode === 'dark' && 'solarized'}
                />
            </>
        )
    );
}

export default UserBidsTable;
