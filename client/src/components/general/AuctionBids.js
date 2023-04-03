import React from 'react';
import { settings } from '../../helpers/settings';
import { formatPrice, formteFullDate } from '../../helpers/utils';
import { Link } from 'react-router-dom';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';

const transferLogBoxStyle = {
    overflowY: 'scroll',
    maxHeight: '400px',
};

function AuctionBids({ bids }) {
    const marketplaceCtx = useMarketplace();
    const userCtx = useUser();

    return (
        <div className='pb-5'>
            <div
                className='rounded-xl'
                style={{
                    border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                }}
            >
                <div className='p-4 rounded-xl bg-white' style={bids.length > 4 ? transferLogBoxStyle : null}>
                    {bids.map((bid, index) => {
                        return (
                            <div
                                className={`d-flex align-items-center text-muted p-2 bg-light rounded-lg ${
                                    index === bids.length - 1 ? 'mb-0' : 'mb-2'
                                }`}
                                key={index}
                            >
                                <Link className='text-muted' to={`/users/${bid.bidder}`} key={index}>
                                    <div className='author-avatar mt-1'>
                                        <span
                                            className='author-avatar-inner'
                                            style={{
                                                background: `url(${
                                                    userCtx.usersList.filter((user) => user.account === bid.bidder)[0]
                                                        .avatar
                                                })`,
                                            }}
                                        ></span>
                                    </div>
                                </Link>
                                <div className='mx-3'>
                                    <p className='mb-0 text-sm'>
                                        <span className='lh-reset'>Bid</span>
                                        <strong className='text-dark lh-reset ms-2'>
                                            {formatPrice(bid.amount).toFixed(3)} {settings.currency}
                                        </strong>
                                    </p>
                                    <p className='mb-0 text-sm'>
                                        By
                                        <Link className='text-muted' to={`/users/${bid.bidder}`} key={index}>
                                            <strong className='lh-reset text-dark mx-2'>
                                                {
                                                    userCtx.usersList.filter((user) => user.account === bid.bidder)[0]
                                                        .fullName
                                                }
                                            </strong>
                                        </Link>
                                        at {formteFullDate(bid.bidTime * 1000)}
                                    </p>
                                </div>

                                <div className='ms-auto'>
                                    {bid.withdraw ? (
                                        <span className='badge lh-reset bg-danger'>Annulé</span>
                                    ) : (
                                        <span className='badge lh-reset bg-info'>Actif</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {bids && bids.length === 0 && <h6 className='text-center mb-0'>Il n'y a pas d'offres pour le moment</h6>}
                </div>
            </div>
        </div>
    );
}

export default AuctionBids;
