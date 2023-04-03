import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    /*** ---------------------------------------------- */
    //      CHANGE NAVBAR STYLE
    /*** ---------------------------------------------- */
    useEffect(() => {
        document.querySelector('.navbar').classList.add('navbar-active');
        return () => {
            document.querySelector('.navbar').classList.remove('navbar-active');
        };
    }, []);

    return (
        <div className='container py-5'>
            <div className='row py-5 text-center'>
                <div className='col-lg-6 mx-auto'>
                    <p className='mb-0 fw-bold' style={{ fontSize: '10rem' }}>
                        404
                    </p>
                    <h1 className='h2 text-uppercase'>Non trouvé</h1>
                    <p className='text-muted'>Cette page n'a pas été trouvée, retournez à la page d'accueil</p>
                    <Link to='/' className='btn btn-gradient-primary'>
                    Page d'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
