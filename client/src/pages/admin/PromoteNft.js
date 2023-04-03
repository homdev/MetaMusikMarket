import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { settings } from '../../helpers/settings';
import web3 from '../../connect-web3/web3';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useAuctions from '../../hooks/useAuctions';
import useCollection from '../../hooks/useCollection';
import useWeb3 from '../../hooks/useWeb3.js';

// COMPONENTS
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import PromotedNftsTable from './PromotedNftsTable';
import PromotedAuctionsTable from './PromotedAuctionsTable';
import { formatPrice } from '../../helpers/utils';

function PromoteNft() {
    const marketplaceCtx = useMarketplace();
    const collectionCtx = useCollection();
    const auctionCtx = useAuctions();
    const web3Ctx = useWeb3();

    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const [promotionPrice, setPromotionPrice] = useState('');
    const { addToast } = useToasts();

    /*** ------------------------------------------- */
    //      LOAD CURRENT PRMOTION PRICE
    /*** ------------------------------------------- */
    useEffect(() => {
        if (marketplaceCtx.contract) {
            marketplaceCtx.laodPromotionPrice(marketplaceCtx.contract);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketplaceCtx.contract]);

    function setPromotionPriceHandler(e) {
        e.preventDefault();
        if (promotionPrice > 0 && promotionPrice !== '') {
            const enteredPrice = web3.utils.toWei(promotionPrice.toString(), 'ether');
            marketplaceCtx.contract.methods
                .setPromotionPrice(enteredPrice)
                .send({ from: web3Ctx.account })
                .once('sending', () => {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setMetaMaskOpened(true);
                })
                .on('receipt', () => {
                    marketplaceCtx.laodPromotionPrice(marketplaceCtx.contract);
                    setMetaMaskOpened(false);
                    addToast('Great! you have set the promotion price', {
                        appearance: 'success',
                    });
                })
                .on('error', (error) => {
                    setMetaMaskOpened(false);
                    addToast('Oops! an error occured', {
                        appearance: 'error',
                    });
                });
        }
    }

    /*** ------------------------------------------- */
    //      UNPORMOTE NFT
    /*** ------------------------------------------- */
    function unpromoteNFTHandler(ids) {
        marketplaceCtx.contract.methods
            .removePromotions(ids)
            .send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                setMetaMaskOpened(true);
            })
            .once('sending', () => {
                setMetaMaskOpened(true);
            })
            .on('error', (e) => {
                addToast('Oops! Something went wrong', {
                    appearance: 'error',
                });
                setMetaMaskOpened(false);
            })
            .on('receipt', () => {
                collectionCtx.loadCollection(collectionCtx.contract);
                auctionCtx.loadAuctions(auctionCtx.contract);
                auctionCtx.loadAuctionsData(
                    collectionCtx.contract,
                    auctionCtx.auctions.filter((auc) => auc.isActive === true)
                );
                addToast("Cool! you've unpromoted the selected NFTs", {
                    appearance: 'success',
                });
                setMetaMaskOpened(false);
            });
    }

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}
            <div className='row gy-5'>
                <div className='col-lg-12 z-index-40' data-aos='fade-right' data-aos-delay='100'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <div className='row mb-4'>
                                <div className='col-lg-6'>
                                    <h5>Set a promotion price</h5>
                                    <p className='text-muted mb-0'>
                                        The amount that user would pay to promote their NFTs
                                    </p>
                                </div>
                                <div className='col-lg-6 text-lg-end'>
                                    <p className='mb-0'>Current Price</p>
                                    <h5 className='text-primary mb-0'>
                                        {formatPrice(marketplaceCtx.promotionPrice).toFixed(2)} {settings.currency}
                                    </h5>
                                </div>
                            </div>
                            <form onSubmit={setPromotionPriceHandler}>
                                <div className='input-icon mb-3'>
                                    <div className='input-icon-text bg-none'>
                                        <i className='text-primary lab la-ethereum'></i>
                                    </div>
                                    <input
                                        className='form-control bg-white shadow-0'
                                        type='number'
                                        autoComplete='off'
                                        name='promotion_price'
                                        id='promotion_price'
                                        min='0'
                                        step='0.0001'
                                        value={promotionPrice}
                                        onChange={(e) => setPromotionPrice(e.target.value)}
                                        placeholder={`e.g. add promotion price with ${settings.currency}`}
                                    />
                                </div>
                                <button className='btn btn-primary mb-3 w-100 py-2' type='submit'>
                                    <i className='lab la-ethereum me-2'></i>Set promotion price
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-lg-12' data-aos='fade-right' data-aos-delay='200'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Promoted NFTs</h5>
                            <PromotedNftsTable unpromote={unpromoteNFTHandler} />
                        </div>
                    </div>
                </div>

                <div className='col-lg-12' data-aos='fade-right' data-aos-delay='200'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Promoted Auctions</h5>
                            <PromotedAuctionsTable unpromote={unpromoteNFTHandler} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PromoteNft;
