import React, { useEffect, useState } from 'react';
import { formatCategory, truncate, configEtherScanUrl } from '../../helpers/utils';
import reactImageSize from 'react-image-size';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useMarketplace from '../../hooks/useMarketplace';

function NFTInfoPanel({ img, dateCreated, name, description, category, artist, royalties, unlockable, formate, type }) {
    const web3Ctx = useWeb3();
    const marketplaceCtx = useMarketplace();

    const [imgSize, setImgSize] = useState('');

    /*** =============================================== */
    //      GET NFT IMAGE DIMENSIONS
    /*** =============================================== */
    useEffect(() => {
        async function getImageSize(x) {
            try {
                const { width, height } = await reactImageSize(x);
                setImgSize(`${width} x ${height}`);
            } catch {
                setImgSize('Not detected');
            }
        }
        getImageSize(img);
    }, [img]);

    return (
        <>
            <p className='d-inline-block fw-normal text-white bg-primary px-3 py-2 mb-3 rounded-sm text-sm mb-0'>
                <i className='las la-image me-2 align-middle'></i>
                {formatCategory(category)}
            </p>

            <p className='text-muted mb-4'>{description}</p>

            <div className='row mb-4'>
                <div className='col-xl-8'>
                    <div
                        className='card shadow-0 bg-white rounded-xl'
                        style={{
                            border: marketplaceCtx.themeMode === 'light' ? '3px solid #e9ecef' : '3px solid #282830',
                        }}
                    >
                        <div className='card-body p-4'>
                            <ul className='list-unstyled text-sm text-gray-800 mb-0'>
                                <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-user-circle'></i>
                                        <span className='ms-2'>Item Artist</span>
                                    </p>
                                    <p className='mb-0'>
                                        <a
                                            href={configEtherScanUrl(web3Ctx.networkId, artist)}
                                            className='text-reset'
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            {truncate(artist, 10)}
                                        </a>
                                    </p>
                                </li>
                                <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-clock'></i>
                                        <span className='ms-2'>Created at</span>
                                    </p>
                                    <p className='mb-0'>{new Date(dateCreated).toLocaleDateString('en-US')}</p>
                                </li>
                                {type === 'image' && (
                                    <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                        <p className='mb-0 d-flex align-items-center'>
                                            <i className='text-primary las la-crop-alt'></i>
                                            <span className='ms-2'>Item Dimensions</span>
                                        </p>
                                        <p className='mb-0'>{imgSize}</p>
                                    </li>
                                )}
                                <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-icons'></i>
                                        <span className='ms-2'>Category</span>
                                    </p>
                                    <p className='mb-0'>{formatCategory(category)}</p>
                                </li>
                                <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-photo-video'></i>
                                        <span className='ms-2'>Formate</span>
                                    </p>
                                    <p className='mb-0'>{formate}</p>
                                </li>
                                <li className='d-flex align-items-center justify-content-between mb-2 pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-percentage'></i>
                                        <span className='ms-2'>Royalties</span>
                                    </p>
                                    <p className='mb-0'>{royalties}%</p>
                                </li>
                                <li className='d-flex align-items-center justify-content-between pb-1'>
                                    <p className='mb-0 d-flex align-items-center'>
                                        <i className='text-primary las la-cloud'></i>
                                        <span className='ms-2'>Downloaded files</span>
                                    </p>
                                    <p className='mb-0'>{unlockable !== '' ? 'Yes' : 'No'}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NFTInfoPanel;
