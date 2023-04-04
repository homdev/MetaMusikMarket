import React, { useState, useMemo } from 'react';
import web3 from '../../connect-web3/web3';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useUser from '../../hooks/useUser';
import useAnalytics from '../../hooks/useAnalytics';

// COMPONENTS
import MetaMaskLoader from '../../components/general/MetaMaskLoader';

function InfoForm({ editInfo }) {
    const web3Ctx = useWeb3();
    const userCtx = useUser();
    const analyticsCtx = useAnalytics();

    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const { addToast } = useToasts();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValue: '' });

    /*** ------------------------------------------- */
    //      GET USER INFORMATION
    /*** ------------------------------------------- */
    const userInfo = useMemo(() => {
        if (userCtx.contract && userCtx.userInformation) {
            return userCtx.userInformation;
        }
    }, [userCtx.contract, userCtx.userInformation]);

    /*** ------------------------------------------- */
    //      EDIT INFO FORM SUBMISSION
    /*** ------------------------------------------- */
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
                    data.avatar,
                ])
                .send({ from: web3Ctx.account })
                .once('sending', function (payload) {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setMetaMaskOpened(true);
                })
                .on('receipt', (receipt) => {
                    web3Ctx.loadAccount(web3);
                    userCtx.getUsersList(userCtx.contract);
                    userCtx.getUserInformation(userCtx.contract, web3Ctx.account);
                    analyticsCtx.loadTransactions(analyticsCtx.contract);
                    userCtx.loadActivity(userCtx.contract);
                    editInfo();
                    setMetaMaskOpened(false);
                    addToast('Cool! vos données ont été mis à jour', {
                        appearance: 'success',
                    });
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
                        <label className='form-label'>Nom complet</label>
                        <input
                            type='text'
                            className={`${errors.fullName ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='e.g. Jason Doe'
                            defaultValue={userInfo ? userInfo.fullName : ''}
                            {...register('fullName', {
                                value: userInfo ? userInfo.fullName : '',
                                required: true,
                                minLength: 6,
                                maxLength: 20,
                            })}
                        />
                        {errors.fullName && <span className='invalid-feedback'>Veuillez saisir votre nom complet</span>}
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label'>Adresse électronique</label>
                        <input
                            type='email'
                            className={`${errors.email ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='e.g. jasondoe@gmail.com'
                            defaultValue={userInfo ? userInfo.email : ''}
                            {...register('email', { value: userInfo ? userInfo.email : '' })}
                        />
                    </div>
                    <div className='col-lg-12'>
                        <label className='form-label'>Role</label>
                        <input
                            type='text'
                            className={`${errors.role ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='i.e. Artiste, Musicien, Producteur, etc...'
                            defaultValue={userInfo ? userInfo.role : ''}
                            {...register('role', { value: userInfo ? userInfo.role : '' })}
                        />
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de l'avatar</label>
                        <input
                            type='text'
                            className={`${errors.avatar ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='Image URL for your avatar...'
                            defaultValue={userInfo ? userInfo.avatar : ''}
                            {...register('avatar', {
                                value: userInfo ? userInfo.avatar : '',
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
                            type='text'
                            className={`${errors.header ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='Image URL for your header...'
                            defaultValue={userInfo ? userInfo.header : ''}
                            {...register('header', {
                                value: userInfo ? userInfo.header : '',
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.header && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-lg-12'>
                        <label className='form-label'>A propos de</label>
                        <textarea
                            className={`${errors.about ? 'is-invalid' : null} form-control bg-white`}
                            rows='7'
                            defaultValue={userInfo ? userInfo.about : ''}
                            placeholder='Enter some brief about yourself'
                            {...register('about', { value: userInfo ? userInfo.about : '' })}
                        ></textarea>
                    </div>
                    <div className='col-lg-6'>
                        <label className='form-label fw-bold text-dark'>URL de Facebook</label>
                        <input
                            type='text'
                            className={`${errors.facebook ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.facebook.com/username'
                            defaultValue={userInfo ? userInfo.fullName : ''}
                            {...register('facebook', {
                                value: userInfo ? userInfo.facebook : '',
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
                            type='text'
                            className={`${errors.twitter ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.twitter.com/username'
                            defaultValue={userInfo ? userInfo.twitter : ''}
                            {...register('twitter', {
                                value: userInfo ? userInfo.twitter : '',
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
                            type='text'
                            className={`${errors.instagram ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.instagram.com/username'
                            defaultValue={userInfo ? userInfo.instagram : ''}
                            {...register('instagram', {
                                value: userInfo ? userInfo.instagram : '',
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
                            type='text'
                            className={`${errors.dribbble ? 'is-invalid' : null} form-control bg-white`}
                            placeholder='www.dribbble.com/username'
                            defaultValue={userInfo ? userInfo.dribbble : ''}
                            {...register('dribbble', {
                                value: userInfo ? userInfo.dribbble : '',
                                pattern: {
                                    value: /http(s?)(:\/\/)([a-zA-z0-9][^\s]*)(.com|.net|.gov|.org|.in|.png|.svg|.jpg|.jpeg|.zip)/,
                                },
                            })}
                        />
                        {errors.dribbble && <span className='invalid-feedback'>Veuillez saisir une URL valide</span>}
                    </div>
                    <div className='col-6'>
                        <button className='btn btn-primary w-100 py-2' type='submit'>
                        Mettre à jour les informations
                        </button>
                    </div>
                    <div className='col-6'>
                        <button className='btn btn-dark w-100 py-2' type='button' onClick={editInfo}>
                        Annuler
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default InfoForm;
