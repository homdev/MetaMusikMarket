import React, { useState } from 'react';
import Modal from './Modal';
import { settings } from '../../helpers/settings';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

const networks = {
    bsctest: {
        chainId: `0x${Number(settings.networkId).toString(16)}`,
        chainName: settings.UISettings.usedNetworkName,
        nativeCurrency: {
            name: `${settings.UISettings.usedNetworkName} Native Token`,
            symbol: settings.currency,
            decimals: 18,
        },
        rpcUrls: [settings.rpcUrl],
        blockExplorerUrls: [settings.blockExplorerUrls],
    },
};

const changeNetwork = async ({ networkName }) => {
    try {
        if (!window.ethereum) throw new Error('No crypto wallet found');
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    ...networks[networkName],
                },
            ],
        });
    } catch (error) {
        console.log(error.message);
    }
};

const handleNetworkSwitch = async (networkName) => {
    await changeNetwork({ networkName });
};

function NoContractAlert() {
    const [isModalOpen, setIsModalOpen] = useState(true);
    const marketplaceCtx = useMarketplace();

    /*** =============================================== */
    //      CLOSE MODAL FUNCTION
    /*** =============================================== */
    function closeModalHandler() {
        setIsModalOpen(false);
    }

    return (
        <Modal
            status={isModalOpen}
            variant='modal-card-inner position-fixed'
            modalClose={closeModalHandler}
            layout={{ width: '700px', maxWidth: '100%' }}
            dismissable={false}
        >
            <div
                className='card-body text-center px-4 p-lg-5'
                style={marketplaceCtx.themeMode === 'light' ? { background: '#fff' } : { background: '#141418' }}
            >
                <img src='/images/metamask.png' alt='metamask' className='flex-shrink-0 mb-4' width='65' />
                <div>
                    <h5 className='mb-1'>
                    Basculer le réseau vers <span className='text-primary'>{settings.UISettings.usedNetworkName}</span>
                    </h5>
                    <p className='text-muted mb-4'>Veuillez cliquer sur le bouton ci-dessous pour voir le contenu de l'application.</p>
                    <button className='btn btn-primary' onClick={() => handleNetworkSwitch(`bsctest`)}>
                    Réseau de commutation
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default NoContractAlert;
