import React, { useMemo } from 'react';
import { formteFullDate } from '../../helpers/utils';
import { Link } from 'react-router-dom';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';

function NftHistory({ history, creator, mktAddress, owner, isAuction, creatorName, creatorAvatar, createdTime }) {
    const transferLogBoxStyle = {
        overflowY: 'scroll',
        maxHeight: '400px',
    };
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const aucAddress = useMemo(() => {
        return auctionCtx.contract.options.address;
    }, [auctionCtx.contract]);

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
                                            creator && creatorAvatar === '' ? '/images/astronaut.png' : creatorAvatar
                                        })`,
                                    }}
                                ></span>
                            </div>
                            <div className='ms-3'>
                                <p className='mb-0 text-sm text-muted'>
                                    Created By
                                    <Link className='text-reset' to={`/users/${creator}`}>
                                        <strong className='ms-2 text-dark'>
                                            {creator && creatorName === '' ? 'Adi Gallia' : creatorName}
                                        </strong>
                                    </Link>
                                </p>
                                <p className='mb-0 text-sm text-muted'>
                                    at
                                    <strong className='ms-2 fw-normal text-dark text-xs'>
                                        {formteFullDate(createdTime)}
                                    </strong>
                                </p>
                            </div>
                        </div>
                    )}

                    {history &&
                        history.map((el, index) => {
                            return (
                                <div key={index}>
                                    {el.to.account === mktAddress ? (
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
                                                        background: `url(/images/mkt-avatar.png)`,
                                                    }}
                                                ></span>
                                            </div>
                                            <div className='ms-3'>
                                                <p className='mb-0 text-sm text-muted'>
                                                    Transferred to
                                                    <Link className='text-reset' to='/'>
                                                        <strong className='ms-2 text-dark'>Marketplace</strong>
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
                                    ) : el.from.account === mktAddress ? (
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
                                    ) : el.from.account === mktAddress ? (
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
                                    ) : el.from.account === aucAddress ? (
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
                                    ) : el.to.account === aucAddress ? (
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
                                                        background: `url(/images/mkt-avatar.png)`,
                                                    }}
                                                ></span>
                                            </div>
                                            <div className='ms-3'>
                                                <p className='mb-0 text-sm text-muted'>
                                                    Transferred to
                                                    <Link className='text-reset' to='/'>
                                                        <strong className='ms-2 text-dark'>Marketplace</strong>
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
                                    ) : (
                                        el.from.account === aucAddress && (
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
                                                                el.to.avatar === ''
                                                                    ? '/images/astronaut.png'
                                                                    : el.to.avatar
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
                                        )
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default NftHistory;
