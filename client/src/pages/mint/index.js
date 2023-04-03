import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-dropdown-select';
import Web3 from 'web3';
import { categoryOptions } from '../../helpers/constants';
import { settings } from '../../helpers/settings';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useUser from '../../hooks/useUser';
import useCollection from '../../hooks/useCollection';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import SuccessMessage from '../../components/general/SuccessMessage';
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import ItemPreview from './ItemPreview';

const auth = 'Basic ' + Buffer.from(settings.IPFSProjectID + ':' + settings.IPFSProjectSecret).toString('base64');

// IPFS CREATE HOST
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

function MintNFTPage() {
    const history = useHistory();
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const collectionCtx = useCollection();

    const [mintSuccess, setMintSuccess] = useState(false);
    const [enteredName, setEnteredName] = useState('');
    const [descriptionIsValid, setDescriptionIsValid] = useState(true);
    const [enteredDescription, setEnteredDescription] = useState('');
    const [nameIsValid, setNameIsValid] = useState(true);
    const [selectedFile, setSelectedFile] = useState();
    const [withUnlockable, setWithUnlockable] = useState(false);
    const [unlockable, setUnlockable] = useState('');
    const [royalties, setRoyalties] = useState(0);
    const [isMetaMaskOpened, setIsMetaMaskOpened] = useState(false);
    const [fileIsValid, setFileIsValid] = useState(true);
    const [fileValidationMsg, setFileValidationMsg] = useState('');
    const [preview, setPreview] = useState();
    const [nftType, setNftType] = useState('image');
    const [enteredCategory, setEnteredCategory] = useState('General');
    const [formate, setFormate] = useState('');
    const { addToast } = useToasts();
    const [networkId, setNetworkId] = useState(0);
    const [values, setValues] = useState([]);

    useEffect(() => {
        const propsContainer = document.querySelector('.props-container');
        const formE = document.querySelector('form');
        const addBtn = document.querySelector('.add-btn');

        function inserHtml() {
            const propsHTML = `
            <div class='row mt-2'>
                <div class='col-6'>
                    <div class='input-icon flex-nowrap category-select'>
                        <div class='input-icon-text bg-none'>
                            <i class='las la-folder text-primary z-index-20'></i>
                        </div>
                        <input
                            type='text'
                            class='form-control prop prop-name bg-white shadow-0'
                            placeholder='Name'
                        />
                    </div>
                </div>
                <div class='col-6 d-flex align-items-center'>
                    <div class='input-icon flex-nowrap category-select w-100 me-3'>
                        <div class='input-icon-text bg-none'>
                            <i class='las la-folder text-primary z-index-20'></i>
                        </div>
                        <input
                            type='text'
                            class='form-control prop prop-value bg-white shadow-0'
                            placeholder='Value'
                        />
                    </div>
                    <button class='btn btn-danger remove-btn btn-sm' type="button">
                        <i class='las la-times pointer-none'></i>
                    </button>
                </div>
        </div>
            
        `;
            propsContainer.insertAdjacentHTML('beforeEnd', propsHTML);
        }

        document.body.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('remove-btn')) {
                e.target.parentElement.parentElement.remove();
            }
        });

        addBtn.addEventListener('click', inserHtml);
        formE.addEventListener('submit', () => {
            const properties = document.querySelectorAll('.prop-name');
            let vals = [];
            for (let i = 0; i < properties.length; i++) {
                vals.push({
                    name: properties[i].value,
                    value: properties[i].parentElement.parentElement.parentElement.querySelector('.prop-value').value,
                });
            }
            setValues(vals);
        });
    }, []);

    /*** ---------------------------------------------- */
    //      GET ACTIVE NETWORK ID
    /*** ---------------------------------------------- */
    useEffect(() => {
        async function getNetworkId() {
            if (window.ethereum) {
                const networkId = await web3Ctx.loadNetworkId(new Web3(window.ethereum));
                setNetworkId(networkId);
            }
        }
        getNetworkId();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*** ---------------------------------------------- */
    //      CHANGE PAGE TITLE
    /*** ---------------------------------------------- */
    useEffect(() => {
        document.title = `Mint an NFT | ${settings.UISettings.marketplaceBrandName}`;
    }, []);

    /*** ---------------------------------------------- */
    //      CATCH NFT IMAGE
    /*** ---------------------------------------------- */
    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFile]);

    /*** ---------------------------------------------- */
    //      CATCH NFT NAME
    /*** ---------------------------------------------- */
    const enteredNameHandler = (event) => {
        setEnteredName(event.target.value);
    };

    /*** ---------------------------------------------- */
    //      CATCH NFT DESCRIPTION
    /*** ---------------------------------------------- */
    const enteredDescriptionHandler = (event) => {
        setEnteredDescription(event.target.value);
    };

    /*** ---------------------------------------------- */
    //      CATCH NFT UNCLOCKABLE CONTENT
    /*** ---------------------------------------------- */
    const enteredUnlockableHandler = (event) => {
        setUnlockable(event.target.value);
    };

    /*** ---------------------------------------------- */
    //      VALIDATE UPLOADED IMAGE SIZE
    /*** ---------------------------------------------- */
    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        if (e.target.files.length > 0) {
            for (let i = 0; i <= e.target.files.length - 1; i++) {
                const fsize = e.target.files.item(i).size;
                const file = Math.round(fsize / 1024);
                // The size of the file.
                if (file >= settings.NFTmaxSize) {
                    setFileValidationMsg('File too Big, please select a file less than 1mb');
                    setFileIsValid(false);
                    setSelectedFile(undefined);
                    return;
                } else {
                    setFileIsValid(true);
                    setFormate(e.target.files.item(i).type);
                }
            }
        }
        setSelectedFile(e.target.files[0]);
    };

    /*** ---------------------------------------------- */
    //      SUBMIT MINTING FORM
    /*** ---------------------------------------------- */
    const submissionHandler = (event) => {
        event.preventDefault();

        // Validate form fields
        enteredName ? setNameIsValid(true) : setNameIsValid(false);
        enteredDescription ? setDescriptionIsValid(true) : setDescriptionIsValid(false);
        selectedFile ? setFileIsValid(true) : setFileIsValid(false);
        const formIsValid = enteredName && enteredDescription && selectedFile;

        // Upload file to IPFS and push to the blockchain
        const mintNFT = async () => {
            setIsMetaMaskOpened(true);

            // Add file to the IPFS
            const fileAdded = await ipfs.add(selectedFile);
            if (!fileAdded) {
                console.error('Something went wrong when updloading the file');
                return;
            }

            const metadata = {
                title: 'Asset Metadata',
                type: 'object',
                properties: {
                    image: {
                        type: 'string',
                        description: fileAdded.path,
                    },
                    title: {
                        type: 'string',
                        description: enteredName,
                    },
                    description: {
                        type: 'string',
                        description: enteredDescription,
                    },
                    category: {
                        type: 'string',
                        description: enteredCategory,
                    },
                    properties: {
                        type: 'string',
                        description: values,
                    },
                    royalties: {
                        type: 'string',
                        description: royalties,
                    },
                    type: {
                        type: 'string',
                        description: nftType,
                    },
                    formate: {
                        type: 'string',
                        description: formate,
                    },
                    unlockableContent: {
                        type: 'string',
                        description: unlockable,
                    },
                },
            };

            const metadataAdded = await ipfs.add(JSON.stringify(metadata));
            if (!metadataAdded) {
                console.error('Something went wrong when updloading the file');
                return;
            }

            /*** ---------------------------------------------- */
            //      MINTING NFT
            /*** ---------------------------------------------- */
            collectionCtx.contract.methods
                .MintNFT(
                    [
                        enteredName,
                        enteredDescription,
                        metadataAdded.path,
                        enteredCategory,
                        unlockable,
                        nftType,
                        formate,
                        false,
                    ],
                    parseInt(royalties)
                )
                .send({ from: web3Ctx.account })
                .on('transactionHash', (hash) => {
                    setIsMetaMaskOpened(true);
                })
                .once('sending', () => {
                    setIsMetaMaskOpened(true);
                })
                .on('receipt', () => {
                    collectionCtx.loadCollection(collectionCtx.contract);
                    collectionCtx.loadTotalSupply(collectionCtx.contract);
                    addToast('Great! you have succefully minted your NFT', {
                        appearance: 'success',
                    });
                    setIsMetaMaskOpened(false);
                    setMintSuccess(true);
                    setTimeout(() => {
                        history.push('/my-account');
                    }, 2500);
                })
                .on('error', (e) => {
                    addToast('Something went wrong when pushing to the blockchain', {
                        appearance: 'error',
                    });
                    setIsMetaMaskOpened(false);
                });
        };
        formIsValid && mintNFT();
    };

    /*** ---------------------------------------------- */
    //      INJECT VALIDATION CLASSES TO INPUT FIELDS
    /*** ---------------------------------------------- */
    const nameClass = nameIsValid ? 'form-control' : 'form-control is-invalid';
    const descriptionClass = descriptionIsValid ? 'form-control' : 'form-control is-invalid';
    const fileClass = fileIsValid ? 'form-control' : 'form-control is-invalid';

    /*** ---------------------------------------------- */
    //      SUCCESS MESSAGE AFTER MINTING
    /*** ---------------------------------------------- */
    if (mintSuccess)
        return (
            <SuccessMessage
                heading="Great! You've successfully minted your NFT"
                subheading="We're redirecting to homepage"
            />
        );

    return (
        <>
            {isMetaMaskOpened ? <MetaMaskLoader /> : null}
            <PageBanner heading='Mint an NFT' />
            <section className='py-5'>
                <div className='container py-5'>
                    <div className='row g-5'>
                        <div className='col-xl-8' data-aos='fade' data-aos-delay='100'>
                            <div className='mb-5 pb-4'>
                                <div className='d-flex align-items-center  mb-4'>
                                    <i className='las la-cloud la-3x text-primary me-2'></i>
                                    <h2 className='h4 mb-0'>Upload Type</h2>
                                </div>
                                <div className='toggle-nav'>
                                    <button
                                        className={`toggle-nav-btn flex-fill ${nftType === 'image' ? 'active' : null}`}
                                        onClick={() => {
                                            setNftType('image');
                                            nftType !== 'image' && setSelectedFile(null);
                                        }}
                                    >
                                        Image
                                    </button>
                                    <button
                                        className={`toggle-nav-btn flex-fill ${nftType === 'audio' ? 'active' : null}`}
                                        onClick={() => {
                                            setNftType('audio');
                                            nftType !== 'audio' && setSelectedFile(null);
                                        }}
                                    >
                                        Audio
                                    </button>
                                    <button
                                        className={`toggle-nav-btn flex-fill ${nftType === 'video' ? 'active' : null}`}
                                        onClick={() => {
                                            setNftType('video');
                                            nftType !== 'video' && setSelectedFile(null);
                                        }}
                                    >
                                        Video
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={submissionHandler}>
                                {nftType === 'image' ? (
                                    <div className='d-flex align-items-center justify-content-center mb-4'>
                                        <i className='las la-image la-3x text-primary me-2'></i>
                                        <h2 className='h4 mb-0'>Upload Image</h2>
                                    </div>
                                ) : nftType === 'audio' ? (
                                    <div className='d-flex align-items-center justify-content-center mb-4'>
                                        <i className='las la-record-vinyl la-3x text-primary me-2'></i>
                                        <h2 className='h4 mb-0'>Upload Audio</h2>
                                    </div>
                                ) : (
                                    nftType === 'video' && (
                                        <div className='d-flex align-items-center justify-content-center mb-4'>
                                            <i className='las la-video la-3x text-primary me-2'></i>
                                            <h2 className='h4 mb-0'>Upload Video</h2>
                                        </div>
                                    )
                                )}

                                <div className='row mb-5 gy-4'>
                                    <div className='col-lg-12'>
                                        <input
                                            className={`form-control shadow-0 bg-none custom-file-upload ${fileClass}`}
                                            type='file'
                                            autoComplete='off'
                                            name='nft_image'
                                            id='nft_image'
                                            accept={`${
                                                nftType === 'image'
                                                    ? '.jpg, .png, .gif'
                                                    : nftType === 'audio'
                                                    ? '.mp3'
                                                    : '.mp4, .webm, .gov'
                                            }`}
                                            placeholder='e.g. Crypto Funk'
                                            onChange={onSelectFile}
                                        />
                                        <label
                                            className={`form-label text-gray-500 text-center border-gray-400 ${
                                                selectedFile ? 'p-3' : 'p-5'
                                            }`}
                                            htmlFor='nft_image'
                                        >
                                            {!selectedFile && (
                                                <div className='my-5'>
                                                    <i
                                                        className={`las text-muted ${
                                                            nftType === 'image'
                                                                ? 'la-image'
                                                                : nftType === 'audio'
                                                                ? 'la-record-vinyl'
                                                                : 'la-video'
                                                        }`}
                                                        style={{ fontSize: '5rem' }}
                                                    ></i>
                                                    <h6 className='mb-0 fw-normal text-gray-500'>
                                                        Click here to uplad
                                                    </h6>
                                                    <p className='text-muted mb-0'>Waiting to catch your file</p>
                                                    <p className='text-danger'>{fileValidationMsg}</p>
                                                </div>
                                            )}

                                            {selectedFile &&
                                                (nftType === 'image' ? (
                                                    <img src={preview} className='img-fluid' alt={enteredName} />
                                                ) : nftType === 'audio' ? (
                                                    <AudioPlayer
                                                        src={preview}
                                                        autoPlayAfterSrcChange={false}
                                                        showJumpControls={false}
                                                    />
                                                ) : (
                                                    <ReactPlayer url={preview} controls={true} width='100%' />
                                                ))}
                                        </label>
                                    </div>
                                </div>

                                <div className='d-flex align-items-center mb-4'>
                                    <i className='las la-icons la-3x me-2 text-primary'></i>
                                    <h2 className='h4 mb-0'>Add Info</h2>
                                </div>

                                <div>
                                    <div className='row gy-3 has-field-icons'>
                                        <div className='col-lg-12'>
                                            <label className='form-label text-dark lead fw-bold' htmlFor='nft_title'>
                                                Title
                                            </label>
                                            <div className='input-icon'>
                                                <div className='input-icon-text bg-none'>
                                                    <i className='text-primary las la-user-edit'></i>
                                                </div>
                                                <input
                                                    className={`form-control bg-white shadow-0 ${nameClass}`}
                                                    type='text'
                                                    autoComplete='off'
                                                    name='nft_title'
                                                    id='nft_title'
                                                    placeholder='e.g. Crypto Funk'
                                                    value={enteredName}
                                                    onChange={enteredNameHandler}
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <label className='form-label text-dark lead fw-bold' htmlFor='nft_category'>
                                                Category
                                            </label>
                                            <div className='input-icon flex-nowrap category-select'>
                                                <div className='input-icon-text bg-none'>
                                                    <i className='las la-icons text-primary z-index-20'></i>
                                                </div>
                                                <Select
                                                    searchable={false}
                                                    options={categoryOptions}
                                                    className='form-select border-gray-300 shadow-0 bg-white'
                                                    value={enteredCategory}
                                                    onChange={(values) =>
                                                        setEnteredCategory(values.map((el) => el.value).toString())
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className='col-lg-6'>
                                            <label
                                                className='form-label text-dark lead fw-bold'
                                                htmlFor='nft_royalties'
                                            >
                                                Royalties
                                            </label>
                                            <div className='input-icon flex-nowrap category-select'>
                                                <div className='input-icon-text bg-none'>
                                                    <i className='las la-percentage text-primary z-index-20'></i>
                                                </div>
                                                <Select
                                                    searchable={false}
                                                    options={settings.royalties}
                                                    className='form-select border-gray-300 shadow-0 bg-white'
                                                    value={royalties}
                                                    onChange={(values) =>
                                                        setRoyalties(values.map((el) => el.value).toString())
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* PROPERTIES ================= */}
                                        <div className='col-lg-12 props-container'>
                                            <div className='d-flex align-items-center mb-3'>
                                                <label
                                                    className='form-label text-dark lead fw-bold mb-0'
                                                    htmlFor='nft_royalties'
                                                >
                                                    Properties
                                                </label>
                                                <button className='add-btn ms-2 border-gray-300' type='button'>
                                                    <i className='las la-plus text-gray-800'></i>
                                                </button>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-6'>
                                                    <div className='input-icon flex-nowrap category-select'>
                                                        <div className='input-icon-text bg-none'>
                                                            <i className='las la-folder text-primary z-index-20'></i>
                                                        </div>
                                                        <input
                                                            type='text'
                                                            className='form-control prop prop-name bg-white shadow-0'
                                                            placeholder='Name'
                                                        />
                                                    </div>
                                                </div>
                                                <div className='col-lg-6'>
                                                    <div className='input-icon flex-nowrap category-select'>
                                                        <div className='input-icon-text bg-none'>
                                                            <i className='las la-folder text-primary z-index-20'></i>
                                                        </div>
                                                        <input
                                                            type='text'
                                                            className='form-control prop prop-value bg-white shadow-0'
                                                            placeholder='Value'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='col-lg-12'>
                                            <label
                                                className='form-label text-dark lead fw-bold'
                                                htmlFor='nft_description'
                                            >
                                                Description
                                            </label>
                                            <div className='input-icon'>
                                                <div className='input-icon-text bg-none'>
                                                    <i className='las la-align-left text-primary'></i>
                                                </div>
                                                <textarea
                                                    rows='6'
                                                    className={`form-control shadow-0 bg-white pt-3 ${descriptionClass}`}
                                                    name='nft_description'
                                                    id='nft_description'
                                                    placeholder='Provide some good description about your asset'
                                                    value={enteredDescription}
                                                    onChange={enteredDescriptionHandler}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className='col-lg-12'>
                                            <div className='form-check form-switch d-flex align-items-center'>
                                                <input
                                                    className='form-check-input'
                                                    type='checkbox'
                                                    role='switch'
                                                    id='unlockable'
                                                    onChange={() => {
                                                        setWithUnlockable(!withUnlockable);
                                                        setUnlockable('');
                                                    }}
                                                />
                                                <label className='fw-bold h6 ms-3 pt-1 mb-0' htmlFor='unlockable'>
                                                    Unlock once purchased
                                                </label>
                                            </div>
                                        </div>

                                        {withUnlockable && (
                                            <div className='col-lg-12'>
                                                <label
                                                    className='form-label text-dark lead fw-bold'
                                                    htmlFor='unlockableContent'
                                                >
                                                    Unlockable Content
                                                </label>
                                                <div className='input-icon'>
                                                    <div className='input-icon-text bg-none'>
                                                        <i className='text-primary las la-cloud'></i>
                                                    </div>
                                                    <input
                                                        className={`form-control bg-white shadow-0 ${unlockable}`}
                                                        type='text'
                                                        autoComplete='off'
                                                        name='unlockable_content'
                                                        id='unlockableContent'
                                                        placeholder='Add a download url for your content...'
                                                        value={withUnlockable ? unlockable : ''}
                                                        onChange={enteredUnlockableHandler}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* SUBMIT */}
                                        <div className='col-12'>
                                            {userCtx.userIsRegistered ? (
                                                <button className='btn btn-primary mb-3' type='submit'>
                                                    <i className='lab la-ethereum me-2'></i>Mint NFT
                                                </button>
                                            ) : (
                                                <>
                                                    {window.ethereum && networkId === settings.networkId ? (
                                                        <Link className='btn btn-primary' to='/register'>
                                                            <i className='las la-user me-2'></i>Register to Mint
                                                        </Link>
                                                    ) : (
                                                        <div className='py-3 px-4 d-inline-block lh-reset bg-light rounded'>
                                                            <p className='fw-bold mb-2'>
                                                                Visitors cannot perform this action
                                                            </p>
                                                            <span className='text-muted'>
                                                                Connect a wallet and try again
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* PREVIEW ITEM */}
                        <div className='col-xl-4' data-aos='fade' data-aos-delay='200'>
                            <ItemPreview
                                heading='Preview Item'
                                type={nftType}
                                preview={preview}
                                title={enteredName}
                                category={enteredCategory}
                                author={web3Ctx.account}
                                royalties={royalties}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default MintNFTPage;
