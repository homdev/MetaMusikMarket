import React, { useState, useEffect } from 'react';
import { settings } from '../../helpers/settings';
import ReactPlayer from 'react-player';

function ImageCpt({ type, img }) {
    const [nftImage, setNftImage] = useState('');

    useEffect(() => {
        let signal = true;
        if (img && img !== '') {
            async function getNftImage() {
                const response =
                    img && img !== '' && (await fetch(`https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${img}`));
                const metadata = await response.json();
                if (signal) {
                    setNftImage(metadata.properties.image.description);
                }
            }
            if (signal) {
                getNftImage();
            }
        }

        return () => (signal = false);
    }, [img]);

    return (
        <>
            {type === 'image' ? (
                <span
                    className='author-avatar-inner rounded-xl'
                    style={{
                        background:
                            nftImage !== ''
                                ? `url(https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage})`
                                : '',
                    }}
                ></span>
            ) : type === 'video' ? (
                <div className='player-wrapper z-index-20'>
                    <ReactPlayer
                        url={nftImage !== '' ? `https://${settings.IPFSGateway}.infura-ipfs.io/ipfs/${nftImage}` : ''}
                        controls={false}
                        width='140%'
                        height='100%'
                    />
                </div>
            ) : (
                <>
                    <span
                        className='author-avatar-inner rounded-xl'
                        style={{ background: `linear-gradient(45deg, #4ca1af, #c4e0e5)` }}
                    ></span>
                    <i className='las la-music text-white position-absolute top-50 start-50 translate-middle z-index-20'></i>
                </>
            )}
        </>
    );
}

export default ImageCpt;
