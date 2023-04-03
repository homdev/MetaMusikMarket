import React from 'react';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

function NftProps({ nftProperties }) {
    const marketplaceCtx = useMarketplace();

    return (
        <div className='row mb-5 pt-4'>
            <div className='col-xl-8'>
                <div className='row gy-3'>
                    <div className='col-12'>
                        <h6 className='mb-1'>Properties</h6>
                    </div>
                    {nftProperties.length > 0 ? (
                        nftProperties
                            .filter((prop) => prop.value !== '' && prop.name !== '')
                            .map((prop, i) => {
                                return (
                                    <div className='col-lg-6' key={i}>
                                        <div
                                            className='p-4 pe-4 rounded-xl bg-white'
                                            style={{
                                                border:
                                                    marketplaceCtx.themeMode === 'light'
                                                        ? '3px solid #e9ecef'
                                                        : '3px solid #282830',
                                            }}
                                        >
                                            <p className='mb-0 text-gray-800 fw-bold'>{prop.name}</p>
                                            <p className='text-muted mb-0 text-sm'>{prop.value}</p>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className='d-inline-block'>
                            <p className='text-muted mb-0 d-flex align-items-center bg-gray-200 rounded py-2 px-3'>
                                <i className='las la-folder text-dark me-2'></i>
                                There're no custom properties provided
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NftProps;
