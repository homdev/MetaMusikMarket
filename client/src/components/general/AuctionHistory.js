import React from 'react';
import { settings } from '../../helpers/settings';
import { formatPrice, formteFullDate } from '../../helpers/utils';
import { Link } from 'react-router-dom';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';

const transferLogBoxStyle = {
    overflowY: 'scroll',
    maxHeight: '400px',
};
function AuctionHistory({ history, creator, mktAddress, owner }) {
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    return (
        <div className='pb-5'>
            <div
                className='rounded-xl'
                style={{
                    border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                }}
            >
                <div className='p-4 rounded-xl bg-white' style={history.length > 4 ? transferLogBoxStyle : null}>
                    {history && (
                        <div className={`d-flex p-2 rounded-lg bg-light ${history.length !== 0 && 'mb-2'}`}>
                            <div className='author-avatar mt-1'>
                                <span
                                    className='author-avatar-inner'
                                    style={{
                                        background: `url(${
                                            creator && creator.avatar === '' ? '/images/astronaut.png' : creator.avatar
                                        })`,
                                    }}
                                ></span>
                            </div>
                            <div className='ms-3'>
                                <p className='mb-0 text-sm text-muted'>
                                    Created By
                                    <Link className='text-reset' to={`/users/${creator.account}`}>
                                        <strong className='ms-2 text-dark'>
                                            {creator && creator.name === '' ? 'Adi Gallia' : creator.name}
                                        </strong>
                                    </Link>
                                </p>
                                <p className='mb-0 text-sm text-muted'>
                                    at
                                    <strong className='ms-2 fw-normal text-dark text-xs'>
                                        {formteFullDate(creator.time)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {history &&
                        history.map((el, index) => {
                            if (el.from.account === mktAddress && el.to.account === owner) {
                                return (
                                    <div
                                        className={`d-flex p-2 rounded-lg bg-light ${
                                            index !== history.length - 1 && 'mb-2'
                                        }`}
                                        key={index}
                                    >
                                        <div className='author-avatar mt-1'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(${
                                                        el.to.avatar === '' ? '/images/astronaut.png' : el.to.avatar
                                                    })`,
                                                }}
                                            ></span>
                                        </div>
                                        <div className='ms-3'>
                                            <p className='mb-0 text-sm text-muted'>
                                                <Link className='text-reset' to={`/users/${el.to.account}`}>
                                                    <strong className='me-2 text-dark'>
                                                        {el.to.name === '' ? 'Adi Gallia' : el.to.name}
                                                    </strong>
                                                </Link>
                                                Cancel Auction
                                            </p>
                                            <p className='mb-0 text-sm text-muted'>
                                                at
                                                <strong className='ms-2 fw-normal text-dark text-xs'>
                                                    {formteFullDate(el.time)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            } else if (el.from.account === mktAddress && el.to.account !== owner) {
                                return (
                                    <div
                                        className={`d-flex p-2 rounded-lg bg-light ${
                                            index !== history.length - 1 && 'mb-2'
                                        }`}
                                        key={index}
                                    >
                                        <div className='author-avatar mt-1'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(${
                                                        el.to.avatar === '' ? '/images/astronaut.png' : el.to.avatar
                                                    })`,
                                                }}
                                            ></span>
                                        </div>
                                        <div className='ms-3'>
                                            <p className='mb-0 text-sm text-muted'>
                                                Transferred to
                                                <Link className='text-reset' to={`/users/${el.to.account}`}>
                                                    <strong className='ms-2 text-dark'>
                                                        {el.to.name === '' ? 'Adi Gallia' : el.to.name}
                                                    </strong>
                                                </Link>
                                            </p>
                                            <p className='mb-0 text-sm text-muted'>
                                                at
                                                <strong className='ms-2 fw-normal text-dark text-xs'>
                                                    {formteFullDate(el.time)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            } else if (el.to.account === auctionCtx.contract.options.address) {
                                return (
                                    <div
                                        className={`d-flex p-2 rounded-lg bg-light ${
                                            index !== history.length - 1 && 'mb-2'
                                        }`}
                                        key={index}
                                    >
                                        <div className='author-avatar mt-1'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(${
                                                        el.from.avatar === '' ? '/images/astronaut.png' : el.from.avatar
                                                    })`,
                                                }}
                                            ></span>
                                        </div>
                                        <div className='ms-3'>
                                            <p className='mb-0 text-sm text-muted'>
                                                <Link className='text-reset' to={`/users/${el.to.account}`}>
                                                    <strong className='mx-2 text-dark'>
                                                        {el.from.name === '' ? 'Adi Gallia' : el.from.name}
                                                    </strong>
                                                </Link>
                                                Set Auction
                                            </p>
                                            <p className='mb-0 text-sm text-muted'>
                                                at
                                                <strong className='ms-2 fw-normal text-dark text-xs'>
                                                    {formteFullDate(el.time)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            } else if (el.to.account === marketplaceCtx.contract.options.address) {
                                return (
                                    <div
                                        className={`d-flex p-2 rounded-lg bg-light ${
                                            index !== history.length - 1 && 'mb-2'
                                        }`}
                                        key={index}
                                    >
                                        <div className='author-avatar mt-1'>
                                            <span
                                                className='author-avatar-inner'
                                                style={{
                                                    background: `url(${
                                                        el.from.avatar === '' ? '/images/astronaut.png' : el.from.avatar
                                                    })`,
                                                }}
                                            ></span>
                                        </div>
                                        <div className='ms-3'>
                                            <p className='mb-0 text-sm text-muted'>
                                                <Link className='text-reset' to={`/users/${el.to.account}`}>
                                                    <strong className='mx-2 text-dark'>
                                                        {el.from.name === '' ? 'Adi Gallia' : el.from.name}
                                                    </strong>
                                                </Link>
                                                Add price{' '}
                                                <strong className='lh-reset text-dark'>
                                                    {formatPrice(el.price)} {settings.currency}
                                                </strong>
                                            </p>
                                            <p className='mb-0 text-sm text-muted'>
                                                at
                                                <strong className='ms-2 fw-normal text-dark text-xs'>
                                                    {formteFullDate(el.time)}
                                                </strong>
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
        </div>
    );
}

export default AuctionHistory;
