import React, { useMemo } from 'react';
import { settings } from '../../helpers/settings';
import { formatPrice, formteFullDate } from '../../helpers/utils';
import { Link } from 'react-router-dom';

// HOOKS
import useAuctions from '../../hooks/useAuctions';
import useMarketplace from '../../hooks/useMarketplace';

const transferLogBoxStyle = {
    overflowY: 'scroll',
    maxHeight: '400px',
};

function PricesLog({ history }) {
    const marketplaceCtx = useMarketplace();
    const auctionCtx = useAuctions();

    const pricesLog = useMemo(() => {
        return history
            .filter((item) => parseInt(item.price) > 0)
            .filter((item) => item.from.account !== marketplaceCtx.contract.options.address)
            .filter((item) => item.from.account !== auctionCtx.contract.options.address);
    }, [history, marketplaceCtx.contract, auctionCtx.contract]);

    return (
        <div className='pb-5'>
            <div
                className='rounded-xl'
                style={{
                    border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                }}
            >
                <div className='p-4 rounded-xl bg-white' style={pricesLog > 4 ? transferLogBoxStyle : null}>
                    {pricesLog.map((item, index) => {
                        return (
                            <div
                                className={`d-flex align-items-center text-muted p-2 bg-light rounded-lg ${
                                    index === pricesLog.length - 1 ? 'mb-0' : 'mb-2'
                                }`}
                                key={index}
                            >
                                <Link className='text-muted' to={`/users/${item.from.account}`} key={index}>
                                    <div className='author-avatar mt-1'>
                                        <span
                                            className='author-avatar-inner'
                                            style={{
                                                background: `url(${item.from.avatar})`,
                                            }}
                                        ></span>
                                    </div>
                                </Link>
                                <div className='mx-3'>
                                    <p className='mb-0 text-sm'>
                                        <strong className='text-dark lh-reset'>
                                            {formatPrice(item.price).toFixed(3)} {settings.currency}
                                        </strong>
                                    </p>
                                    <p className='mb-0 text-sm'>
                                        By
                                        <Link className='text-muted' to={`/users/${item.from.account}`} key={index}>
                                            <strong className='lh-reset text-dark mx-2'>
                                                {item.from.name === '' ? 'Adi Gallia' : item.from.name}
                                            </strong>
                                        </Link>
                                        at {formteFullDate(item.time)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {pricesLog && pricesLog.length === 0 && (
                        <h6 className='text-center mb-0'>There're no records at the moment</h6>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PricesLog;
