import React from 'react';
import { formatCategory, truncateStart } from '../../helpers/utils';
import { settings } from '../../helpers/settings';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const melodyStyle = {
    fontSize: '5rem',
    color: '#fff',
    position: 'absolute',
    top: '4rem',
    left: '50%',
    transform: 'translateX(-50%)',
};

function ItemPreview({ heading, preview, title, category, author, royalties, type }) {
    return (
        <>
            <div className='d-flex align-items-center mb-4'>
                <i className='las la-eye la-3x me-2 text-primary'></i>
                <h2 className='h4 mb-0'>{heading}</h2>
            </div>

            <div className='card rounded-xl shadow'>
                <div className='card-body p-3 position-relative'>
                    <div className='position-relative mb-4 shadow'>
                        <div
                            className={`card-img-holder rounded overflow-hidden align-items-end ${
                                type === 'audio' && 'audio'
                            }`}
                        >
                            {type === 'image' ? (
                                <img
                                    className='img-fluid rounded w-75'
                                    src={type === 'image' && (!preview ? '/images/asset-2.png' : preview)}
                                    alt={title}
                                />
                            ) : type === 'audio' ? (
                                <>
                                    <i className='las la-music' style={melodyStyle}></i>
                                    <AudioPlayer
                                        src={type === 'audio' && (!preview ? '/example.mp3' : preview)}
                                        autoPlayAfterSrcChange={false}
                                        showJumpControls={false}
                                    />
                                </>
                            ) : (
                                <ReactPlayer
                                    url={type === 'video' && (!preview ? '/teaser.mp4' : preview)}
                                    controls={true}
                                    width='100%'
                                    height='auto'
                                />
                            )}
                        </div>
                    </div>
                    <div className='fw-bold lead mb-3 d-flex align-items-center justify-content-between'>
                        <p className='mb-0'>{title === '' ? 'MetaMusik' : truncateStart(title, 25)}</p>
                        <div className='badge bg-primary d-flex align-items-center text-white mb-0 ms-3'>
                            {formatCategory(category)}
                        </div>
                    </div>

                    <div className='d-flex align-items-center justify-content-between flex-wrap'>
                        <div className='author position-static z-index-20 d-flex align-items-center'>
                            <div className='author-avatar'>
                                <span
                                    className='author-avatar-inner'
                                    style={{
                                        background: 'url(/avatar-3.png)',
                                    }}
                                ></span>
                            </div>
                            <div className='ms-2'>
                                <p className='text-muted fw-normal mb-0 lh-1'>
                                    <span className='text-xs'>Détenu par</span>
                                    <strong className='d-block fw-bold h6 text-dark mb-0'>
                                        {truncateStart('MetaMusik', 10)}
                                    </strong>
                                </p>
                            </div>
                        </div>

                        <p className='text-muted fw-normal mb-0 lh-1'>
                            <span className='text-xs'>Prix actuel</span>
                            <strong className='d-block fw-bold h6 text-dark mb-0'>0.02 {settings.currency}</strong>
                        </p>
                    </div>

                    <div className='text-muted fw-normaltext-sm d-flex align-items-center mt-4 justify-content-between'>
                        <p className='mb-0 text-xs d-flex align-items-center'>
                            <i className='las la-percentage me-1'></i>
                            <span className='me-1 text-primary'>{royalties}%</span>
                            Royalties
                        </p>
                        <p className='text-xs mb-0 d-flex align-items-center'>
                            <i className='la-sm text-primary las la-clock mx-1 text-primary'></i>Il y a 8 heures
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

ItemPreview.defaultProps = {
    title: 'MetaMusik',
    category: 'music',
    type: 'image',
    preview: '',
};

export default ItemPreview;
