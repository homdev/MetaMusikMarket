import React from 'react';

// HOOKS
import useMarketplace from '../../hooks/useMarketplace';

function ToggleModeBtn() {
    const marketplaceCtx = useMarketplace();

    /*** =============================================== */
    //      SWITCH LIGHT/DARK THEME MODE BUTTON
    /*** =============================================== */
    function switchModeHandler(e) {
        if (e.target.checked) {
            marketplaceCtx.switchMode('dark');
            document
                .querySelector('head')
                .insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/App.dark.css">');
            document.querySelectorAll('link[href="/App.css"]').forEach((link) => link.remove());
        } else {
            marketplaceCtx.switchMode('light');
            document.querySelector('head').insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="/App.css">');
            document.querySelectorAll('link[href="/App.dark.css"]').forEach((link) => link.remove());
        }
    }

    return (
        <div className='toggleWrapper'>
            <input
                type='checkbox'
                className='dn'
                id='dn'
                onChange={(e) => switchModeHandler(e)}
                checked={Boolean(marketplaceCtx.themeMode === 'dark')}
            />
            <label htmlFor='dn' className='toggle'>
                <span className='toggle__handler'>
                    <span className='crater crater--1'></span>
                    <span className='crater crater--2'></span>
                    <span className='crater crater--3'></span>
                </span>
                <span className='star star--1'></span>
                <span className='star star--2'></span>
                <span className='star star--3'></span>
                <span className='star star--4'></span>
                <span className='star star--5'></span>
                <span className='star star--6'></span>
            </label>
        </div>
    );
}

export default ToggleModeBtn;
