import React from 'react';
import { motion } from 'framer-motion/dist/es/index';
import { Link } from 'react-router-dom';

const fullScreenLoaderStyle = {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    left: '0',
    background: 'rgba(0, 0, 0, 0.87)',
    zIndex: '9999',
};

function RegisterAlert({ closeAlert }) {
    return (
        <motion.div
            className='d-flex align-items-center justify-content-center'
            style={fullScreenLoaderStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            <div className='row w-100 text-center'>
                <div className='col-lg-6 mx-auto' data-aos='fade-up' data-aos-delay='100'>
                    <div className='card p-lg-5 rounded-xl'>
                        <div className='card-body px-4 py-5'>
                            <p className='h3'>We've noticed that you're not registered</p>
                            <p className='lead mb-3'>
                                Please register first so you can interact with the marketplace functionalities
                            </p>
                            <ul className='list-inline mb-0'>
                                <li className='list-inline-item m-1'>
                                    <Link to='/register' className='btn btn-primary' onClick={closeAlert}>
                                        Register Now
                                    </Link>
                                </li>
                                <li className='list-inline-item m-1'>
                                    <button className='btn btn-dark' tybe='button' onClick={closeAlert}>
                                        Keep Browsing
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default RegisterAlert;
