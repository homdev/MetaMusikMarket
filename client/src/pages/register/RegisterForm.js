import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import web3 from '../../connect-web3/web3';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { generateRandomImage } from '../../helpers/utils';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useUser from '../../hooks/useUser';
import useAnalytics from '../../hooks/useAnalytics';

// COMPONENTS
import MetaMaskLoader from '../../components/general/MetaMaskLoader';

function RegisterForm() {
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const analyticsCtx = useAnalytics();
    const { addToast } = useToasts();

    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const history = useHistory();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    /*** ---------------------------------------- */
    //      CONNECT WALLET
    /*** ---------------------------------------- */
    const connectWalletHandler = async () => {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error(error);
        }
        // Load accounts
        web3Ctx.loadAccount(web3);
    };

    /*** ---------------------------------------- */
    //      REGISTER USER FORM SUBMISSION
    /*** ---------------------------------------- */
    function onSubmit(data) {
        if (
            userCtx.usersList &&
            userCtx.usersList
                .filter((user) => user.account !== web3Ctx.account)
                .map((el) => el.fullName.trim())
                .includes(data.fullName.trim())
        ) {
            addToast('This name is already taken', {
                appearance: 'error',
            });
        } else if (
            userCtx.usersList &&
            data.email.trim() !== '' &&
            userCtx.usersList
                .filter((user) => user.account !== web3Ctx.account)
                .map((el) => el.email)
                .includes(data.email)
        ) {
            addToast('This email is already taken', {
                appearance: 'error',
            });
        } else {
            userCtx.contract.methods
                .addUser([
                    web3Ctx.account,
                    data.fullName,
                    data.email,
                    data.role,
                    data.about,
                    data.facebook,
                    data.twitter,
                    data.instagram,
                    data.dribbble,
                    data.header,
                    data.avatar === '' ? generateRandomImage(7) : data.avatar,
                ])
                .send({ from: web3Ctx.account })
                .once('sending', function (payload) {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setMetaMaskOpened(true);
                })
                .on('receipt', (receipt) => {
                    userCtx.getUsersList(userCtx.contract);
                    userCtx.getUserInformation(userCtx.contract, web3Ctx.account);
                    web3Ctx.loadAccount(web3);
                    analyticsCtx.loadTransactions(analyticsCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                    setMetaMaskOpened(false);
                    addToast('Cool! your data has been updated!', {
                        appearance: 'success',
                    });
                    history.push('/my-account');
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='row gy-4'>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>Nom complet</label>
                        <input
                            type='text'
                            className={`${errors.fullName ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='e.g. Jason Doe'
                            {...register('fullName', { required: true, minLength: 6, maxLength: 20 })}
                        />
                        {errors.fullName && <span className='invalid-feedback'>Veuillez saisir votre nom complet</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>Adresse électronique</label>
                        <input
                            type='email'
                            className={`${errors.email ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='e.g. jasondoe@gmail.com'
                            {...register('email', { required: true })}
                        />
                    </div>
                    <div className='col-lg-12'>
                        <label className='form-label fw-bold text-dark'>Role</label>
                        <input
                            type='text'
                            className={`${errors.role ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='i.e. software engineer'
                            {...register('role')}
                        />
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de l'avatar</label>
                        <input
                            type='url'
                            className={`${errors.avatar ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='Image URL for your avatar...'
                            {...register('avatar', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.avatar && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de l'en-tête</label>
                        <input
                            type='url'
                            className={`${errors.header ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='Image URL for your header...'
                            {...register('header', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.header && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-12'>
                        <label className='form-label fw-bold text-dark'>A propos de</label>
                        <textarea
                            className={`${errors.about ? 'is-invalid' : null} form-control bg-white`}
                            rows='7'
                            placeholder='Enter some brief about yourself'
                            {...register('about')}
                        ></textarea>
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de Facebook</label>
                        <input
                            type='url'
                            className={`${errors.facebook ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.facebook.com/username'
                            {...register('facebook', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.facebook && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de Twitter</label>
                        <input
                            type='url'
                            className={`${errors.twitter ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.twitter.com/username'
                            {...register('twitter', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.twitter && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL d'Instagram</label>
                        <input
                            type='url'
                            className={`${errors.instagram ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.instagram.com/username'
                            {...register('instagram', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.instagram && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de Dribbble</label>
                        <input
                            type='url'
                            className={`${errors.dribbble ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.dribbble.com/username'
                            {...register('dribbble', {
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.dribbble && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-12'>
                        {web3Ctx.account ? (
                            <button className='btn btn-primary w-100 py-2' type='submit'>
                                S'inscrire
                            </button>
                        ) : (
                            <button
                                type='button'
                                className='btn btn-gradient-primary btn-sm px-3 w-100 py-2 d-lg-flex align-items-center justify-content-center'
                                onClick={connectWalletHandler}
                            >
                                <i className='las la-wallet me-2 mb-2'></i>
                                Connectez votre portefeuille
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}

export default RegisterForm;
