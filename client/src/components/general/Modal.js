import React from 'react';
import { AnimatePresence, motion } from 'framer-motion/dist/es/index';

function Modal({ children, status, layout, modalClose, variant, dismissable }) {
    return (
        <>
            <AnimatePresence>
                {status && (
                    <motion.div
                        className={`modal-card rounded p-3 ${variant}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            default: { duration: 0.1 },
                        }}
                    >
                        <div style={layout}>
                            <motion.div
                                className='card shadow position-relative py-5 py-lg-0'
                                initial={{ scale: 0.75, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.75, opacity: 0 }}
                                transition={{
                                    delay: 0.2,
                                    default: { duration: 0.2 },
                                }}
                            >
                                {dismissable !== false && (
                                    <button
                                        type='button'
                                        className='btn-close lead position-absolute top-0 end-0 m-3 shadow-0'
                                        aria-label='Close'
                                        onClick={modalClose}
                                    ></button>
                                )}
                                {children}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Modal;
