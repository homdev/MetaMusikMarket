import React, { useEffect, useState } from 'react';
import Select from 'react-dropdown-select';
import { useToasts } from 'react-toast-notifications';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';
import useUser from '../../hooks/useUser';
import useWeb3 from '../../hooks/useWeb3.js';

// COMPONENTS
import MetaMaskLoader from '../../components/general/MetaMaskLoader';
import WhiteListTable from './WhiteListTable';

function WhiteList() {
    const userCtx = useUser();
    const marketplaceCtx = useMarketplace();
    const web3Ctx = useWeb3();
    const { addToast } = useToasts();

    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const [usersList, setUsersList] = useState(null);
    const [whiteList, setWhiteList] = useState(null);
    const [choosedAddress, setChoosedAddress] = useState('');
    const [whitelistAddress, setwhitelistAddress] = useState('');

    /*** ------------------------------------------------------ */
    //      SELECT ITEM TEMPLATE
    /*** ------------------------------------------------------ */
    const ListItem = ({ avatar, fullName, email }) => {
        return (
            <div className='d-flex align-items-center'>
                <div className='author-avatar'>
                    <span className='author-avatar-inner' style={{ background: `url(${avatar})` }}></span>
                </div>
                <div className='ms-3'>
                    <p className='fw-bold text-base mb-0'>{fullName}</p>
                    <p className='text-xxs mb-0'>{email}</p>
                </div>
            </div>
        );
    };

    /*** ------------------------------------------------------ */
    //      GET USERS LIST SELECT OPTIONS
    /*** ------------------------------------------------------ */
    useEffect(() => {
        if (userCtx.contract && userCtx.usersList && marketplaceCtx.contract && userCtx.appOwner && userCtx.whiteList) {
            const users = userCtx.usersList
                .filter((user) => {
                    return user.account !== userCtx.appOwner;
                })
                .filter((user) => !userCtx.whiteList.map((el) => el.address).includes(user.account))
                .map((user) => {
                    return {
                        value: user.account,
                        label: <ListItem {...user} />,
                    };
                });
            setUsersList(users);
        }
    }, [userCtx.contract, userCtx.usersList, marketplaceCtx.contract, userCtx.appOwner, userCtx.whiteList]);

    /*** ------------------------------------------------------ */
    //      GET WHITELISTED USERS SELECT OPTIONS
    /*** ------------------------------------------------------ */
    useEffect(() => {
        if (userCtx.contract && userCtx.whiteList && userCtx.usersList) {
            const users = userCtx.whiteList
                .filter((user) => user.address !== '0x0000000000000000000000000000000000000000')
                .map((user) => {
                    return {
                        value: user.address,
                        label: (
                            <ListItem
                                fullName={userCtx.usersList.filter((el) => el.account === user.address)[0].fullName}
                                email={userCtx.usersList.filter((el) => el.account === user.address)[0].email}
                                avatar={userCtx.usersList.filter((el) => el.account === user.address)[0].avatar}
                            />
                        ),
                    };
                });
            setWhiteList(users);
        }
    }, [userCtx.whiteList, userCtx.usersList, userCtx.contract]);

    /*** ------------------------------------------------------ */
    //      ADD TO WHITELIST FUNCTION
    /*** ------------------------------------------------------ */
    function addToWhiteListHandler(e) {
        e.preventDefault();
        if (choosedAddress !== '') {
            userCtx.contract.methods
                .addToWhitelist(choosedAddress)
                .send({ from: web3Ctx.account })
                .once('sending', function (payload) {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setMetaMaskOpened(false);
                    addToast(`Génial! vous avez ajouté un utilisateur à la liste blanche`, {
                        appearance: 'success',
                    });
                })
                .on('receipt', (receipt) => {
                    setChoosedAddress('');
                    userCtx.loadWhiteList(userCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                })
                .on('error', (e) => {
                    addToast("Oups ! une erreur s'est produite", {
                        appearance: 'error',
                    });
                    setMetaMaskOpened(false);
                });
        }
    }

    /*** ------------------------------------------------------ */
    //      REMOVE FROM WHITELIST FUNCTION
    /*** ------------------------------------------------------ */
    function removeFromWhiteListHandler(e) {
        e.preventDefault();
        if (whitelistAddress !== '') {
            userCtx.contract.methods
                .removeFromWhitelist(whitelistAddress)
                .send({ from: web3Ctx.account })
                .once('sending', function (payload) {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setMetaMaskOpened(false);
                    addToast(`Génial ! vous avez supprimé un utilisateur de la liste blanche`, {
                        appearance: 'success',
                    });
                })
                .on('receipt', (receipt) => {
                    setwhitelistAddress('');
                    userCtx.loadWhiteList(userCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                })
                .on('error', (e) => {
                    addToast('Something went wrong when pushing to the blockchain', {
                        appearance: 'error',
                    });
                    setMetaMaskOpened(false);
                });
        }
    }

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}
            <div className='row gy-4'>
                <div className='col-lg-6 z-index-40' data-aos='fade-right' data-aos-delay='100'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Ajouter à la liste blanche</h5>

                            <form onSubmit={addToWhiteListHandler}>
                                {usersList && (
                                    <>
                                        <Select
                                            searchable={false}
                                            options={usersList}
                                            className='form-select border-gray-300 ps-3 shadow-0 bg-white'
                                            value={choosedAddress}
                                            onChange={(values) =>
                                                setChoosedAddress(values.map((el) => el.value).toString())
                                            }
                                        />

                                        <button className='btn btn-primary w-100 mt-3' type='submit'>
                                        Ajouter à la liste blanche
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 z-index-30' data-aos='fade-left' data-aos-delay='200'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Supprimer de la liste blanche</h5>

                            <form onSubmit={removeFromWhiteListHandler}>
                                {whiteList && (
                                    <>
                                        <Select
                                            searchable={false}
                                            options={whiteList}
                                            className='form-select border-gray-300 ps-3 shadow-0 bg-white'
                                            value={whitelistAddress}
                                            onChange={(values) =>
                                                setwhitelistAddress(values.map((el) => el.value).toString())
                                            }
                                        />

                                        <button className='btn btn-primary w-100 mt-3' type='submit'>
                                            Supprimer de la liste blanche
                                        </button>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>

                <div className='col-lg-12 z-index-20' data-aos='fade-up' data-aos-delay='300'>
                    <div className='card shadow-0 p-lg-3'>
                        <div className='card-body p-4'>
                            <h5 className='mb-4'>Utilisateurs de la liste blanche</h5>
                            <WhiteListTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WhiteList;
