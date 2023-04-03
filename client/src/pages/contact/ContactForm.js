import React, { useEffect } from 'react';
import { useForm } from '@formspree/react';
import { Link } from 'react-router-dom';
import { settings } from '../../helpers/settings';

function ContactForm({ gridWidth }) {
    const [state, handleSubmit] = useForm(settings.UISettings.contactFormAddressId);

    /*** ------------------------------------------- */
    //      BOOTSTRAP VALIDATION
    /*** ------------------------------------------- */
    useEffect(() => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation');

        // Loop over them and prevent submission
        Array.prototype.slice.call(forms).forEach(function (form) {
            form.addEventListener(
                'submit',
                function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    form.classList.add('was-validated');
                },
                false
            );
        });
    }, []);

    /*** ------------------------------------------- */
    //      SUCCESS MESSAGE TEMPLATE
    /*** ------------------------------------------- */
    if (state.succeeded) {
        return (
            <div className={`${gridWidth} text-center`}>
                <p className='mb-0 fw-bold mt-5 mb-0'>
                    <i
                        className='las la-grin-beam'
                        style={{ fontSize: '10rem', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' }}
                    ></i>
                </p>

                <h1 className='h2'>Merci de nous avoir contactés.</h1>
                <p className='text-muted'>Nous vous répondrons dans les plus brefs délais.</p>
                <Link to='/' className='btn btn-gradient-primary'>
                Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div className={gridWidth}>
            <h2 className='h2 mb-5 text-center' data-aos='fade-up' data-aos-delay='100' data-aos-once='true'>
            Envoyez-nous un message
            </h2>
            <form className='contact-form needs-validation' noValidate onSubmit={handleSubmit}>
                <div className='row gy-3'>
                    <div className='col-lg-6' data-aos='fade' data-aos-delay='200' data-aos-once='true'>
                        <label className='form-label fw-bold lead' htmlFor='fullname'>
                        Nom complet
                        </label>
                        <div className='input-icon'>
                            <div className='input-icon-text'>
                                <i className='text-primary las la-user'></i>
                            </div>
                            <input
                                className='form-control bg-white shadow-0'
                                type='text'
                                autoComplete='off'
                                name='fullname'
                                id='fullname'
                                required={true}
                                placeholder='Saisissez votre nom complet'
                            />
                            <div className='invalid-feedback bg-danger rounded-sm text-white px-3 py-1'>
                            Veuillez saisir votre nom complet
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6' data-aos='fade' data-aos-delay='300' data-aos-once='true'>
                        <label className='form-label fw-bold lead' htmlFor='email'>
                        Adresse électronique
                        </label>
                        <div className='input-icon'>
                            <div className='input-icon-text'>
                                <i className='text-primary las la-envelope'></i>
                            </div>
                            <input
                                className='form-control bg-white shadow-0'
                                type='email'
                                autoComplete='off'
                                name='email'
                                id='email'
                                required={true}
                                placeholder='Saisissez votre adresse électronique'
                            />
                            <div className='invalid-feedback bg-danger rounded-sm text-white px-3 py-1'>
                            Veuillez saisir votre adresse électronique
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-12' data-aos='fade' data-aos-delay='400' data-aos-once='true'>
                        <label className='form-label fw-bold lead' htmlFor='subject'>
                            Objet
                        </label>
                        <div className='input-icon'>
                            <div className='input-icon-text'>
                                <i className='text-primary las la-file-alt'></i>
                            </div>
                            <input
                                className='form-control bg-white shadow-0'
                                type='text'
                                autoComplete='off'
                                name='subject'
                                id='subject'
                                placeholder='Entrez votre sujet'
                            />
                        </div>
                    </div>

                    <div className='col-lg-12' data-aos='fade' data-aos-delay='500' data-aos-once='true'>
                        <label className='form-label fw-bold lead' htmlFor='message'>
                            Message
                        </label>
                        <textarea
                            className='form-control bg-white shadow-0'
                            rows='4'
                            name='message'
                            id='message'
                            placeholder='Comment pouvons-nous vous aider ?'
                            required={true}
                        ></textarea>
                        <div className='invalid-feedback bg-danger rounded-sm text-white px-3 py-1'>
                        Veuillez saisir votre message
                        </div>
                    </div>

                    <div className='col-lg-12' data-aos='fade' data-aos-delay='600' data-aos-once='true'>
                        <button className='btn btn-primary w-100' type='submit' disabled={state.submitting}>
                            <i className='las la-paper-plane me-2'></i>Envoyez votre message
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
