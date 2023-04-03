import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { settings } from '../../helpers/settings';
import { formatPrice } from '../../helpers/utils';

// HOOKS
import useUser from '../../hooks/useUser';
import useWeb3 from '../../hooks/useWeb3';

function AuctionCta({ topBid, isCurrentBidder, setIsModalOpen, cancelHandler, withdrawBidHandler, owner }) {
    const web3Ctx = useWeb3();
    const userCtx = useUser();

    const [networkId, setNetworkId] = useState(0);

    /*** --------------------------------------- */
    //      GET ACTIVE NETWORK ID
    /*** --------------------------------------- */
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

    return (
        <>
            {topBid > 0 ? (
                <div className='d-inline-block mt-4'>
                    <h6 className='mb-3'>Top Bid</h6>
                    <div className='text-sm text-muted fw-normal mb-0 d-flex align-items-center'>
                        <span className='icon bg-primary text-white me-2 mb-1'>
                            <i className='lab la-ethereum fa-fw'></i>
                        </span>
                        <p className='mb-0 h4 d-flex align-items-end fw-bold ms-2 text-dark'>
                            {formatPrice(topBid).toFixed(3)} {settings.currency}
                        </p>
                    </div>
                </div>
            ) : (
                <div className='d-inline-block mt-4'>
                    <p className='text-muted mb-0 d-flex align-items-center bg-gray-200 rounded p-3'>
                        <i className='lab la-ethereum text-dark me-2 mb-1'></i>
                        <span className='lh-reset'>There's no active bids</span>
                    </p>
                </div>
            )}

            {web3Ctx.account !== owner && (
                <>
                    {userCtx.userIsRegistered ? (
                        <div className='mt-4'>
                            {isCurrentBidder === false && (
                                <button
                                    type='button'
                                    className='btn btn-primary text-nowrap'
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <i className='lab la-ethereum me-2'></i>
                                    Place Bid
                                </button>
                            )}
                            {isCurrentBidder === true && (
                                <button
                                    type='button'
                                    className='btn btn-danger text-nowrap'
                                    onClick={withdrawBidHandler}
                                >
                                    <i className='lab la-ethereum me-2'></i>
                                    Withdraw Bid
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {window.ethereum && networkId === settings.networkId && (
                                <Link className='btn btn-primary text-nowrap' to='/register'>
                                    <i className='las la-user me-2'></i>
                                    Register to Bid
                                </Link>
                            )}
                        </>
                    )}
                </>
            )}

            {web3Ctx.account === owner && (
                <div className='mt-4'>
                    <button type='button' className='btn btn-danger text-nowrap' onClick={cancelHandler}>
                        Cancel Auction
                    </button>
                </div>
            )}
        </>
    );
}

export default AuctionCta;
