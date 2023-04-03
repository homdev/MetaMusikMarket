import React, { useMemo } from 'react';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import { settings } from '../../helpers/settings';
import 'react-h5-audio-player/lib/styles.css';
import { formatPrice } from '../../helpers/utils';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useCollection from '../../hooks/useCollection';

const melodyStyle = {
    fontSize: '7rem',
    color: '#fff',
    position: 'absolute',
    top: 'calc(50% - 3rem)',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

function AuctionThumbnail({ thumbnail, type, promote, promotionPrice, owner, isPromoted }) {
    const web3Ctx = useWeb3();
    const collectionCtx = useCollection();

    const eligibleForPromotion = useMemo(() => {
        if (settings.maxFeaturedItems >= collectionCtx.collection.filter((nft) => nft.isPromoted === true).length) {
            return true;
        } else {
            return false;
        }
    }, [collectionCtx.collection]);

    return (
        <>
            <div className={`card shadow rounded-xl ${type === 'audio' ? 'audio' : ''}`}>
                <div className='card-body position-relative d-flex align-items-end'>
                    {type === 'image' ? (
                        thumbnail && <img className='img-fluid rounded w-100' src={thumbnail} alt='...' />
                    ) : type === 'audio' ? (
                        <>
                            <i className='las la-music' style={melodyStyle}></i>
                            <AudioPlayer src={thumbnail} autoPlayAfterSrcChange={false} showJumpControls={false} />
                        </>
                    ) : (
                        thumbnail && <ReactPlayer url={thumbnail} controls={true} width='100%' height='auto' />
                    )}

                    {isPromoted && (
                        <div className='position-absolute m-4 top-0 start-0 text-white'>
                            <span className='bg-primary px-2 py-1 rounded-sm text-sm text-uppercase'>Promoted</span>
                        </div>
                    )}
                </div>
            </div>

            {parseInt(promotionPrice) > 0 && owner === web3Ctx.account && !isPromoted && eligibleForPromotion && (
                <div className='mt-4 top-0 start-0 w-100'>
                    <button className='btn btn-primary w-100' type='button' onClick={promote}>
                        Promote your NFT for {formatPrice(promotionPrice).toFixed(2)} {settings.currency}
                    </button>
                </div>
            )}
        </>
    );
}

export default AuctionThumbnail;
