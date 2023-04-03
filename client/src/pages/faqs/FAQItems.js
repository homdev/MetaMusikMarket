import React from 'react';

export const techQuestions = [
    {
        question: 'What stack is the marketplace built with?',
        answer: (
            <div className='text-muted mb-0'>
                We use:
                <ul className='mb-0'>
                    <li>
                        <strong className='text-dark'>Solidity </strong>- building smart contracts
                    </li>
                    <li>
                        <strong className='text-dark'>Truffle suite </strong> – development environment, testing
                        framework, and asset pipeline for blockchains.
                    </li>
                    <li>
                        <strong className='text-dark'>Web3.js </strong> – JavaScript Library that allows interacting
                        with a local or remote Ethereum node
                    </li>
                    <li>
                        <strong className='text-dark'>IPFS </strong> – Server to save images with metadata in the
                        blockchain
                    </li>
                    <li>
                        <strong className='text-dark'>MetaMask </strong> – Crypto wallet for trading NFTs
                    </li>
                    <li>
                        <strong className='text-dark'>React.js </strong> – JavaScript framework to build the user
                        interface and connect everything together
                    </li>
                    <li>
                        <strong className='text-dark'>Bootstrap 5 </strong> – UI
                    </li>
                </ul>
            </div>
        ),
    },
    {
        question: 'What blockchains are supported?',
        answer: (
            <div className='text-muted mb-0'>
                Our products support these blockchains:
                <ul className='mb-0'>
                    <li>Ethereum</li>
                    <li>Polyogn</li>
                    <li>Binance Smart Chain</li>
                    <li>Celo</li>
                    <li>Harmony</li>
                </ul>
            </div>
        ),
    },
    {
        question: 'What wallets are supported?',
        answer: 'At the moment, you can use MetaMask wallet.',
    },
    {
        question: 'More questions?',
        answer: (
            <p className='text-muted mb-0'>
                If you can’t find the answers here,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    get in touch
                </a>
                . We will be happy to help.
            </p>
        ),
    },
];

export const purchaseQuestions = [
    {
        question: 'What payment methods do you accept?',
        answer: (
            <p className='text-muted mb-0'>
                We accept all the major payment card providers, Apple Pay, Google Pay, and PayPal.
            </p>
        ),
    },
    {
        question: 'On how many websites can I use your product?',
        answer: (
            <>
                <p className='text-muted'>
                    If you will choose the <strong className='text-dark'>Startup Plan</strong>, you can use the product
                    on one website (+ one development environment).
                </p>
                <p className='text-muted mb-0'>
                    If you opt for the <strong className='text-dark'>Unlimited Plan</strong>, you can use the product on
                    as many websites as you wish.
                </p>
            </>
        ),
    },
    {
        question: 'What is your refund policy?',
        answer: (
            <>
                <p className='text-muted'>
                    You have 24 hours to inspect your purchase and to determine if it does not meet the expectations
                    laid forth by us. If you wish to receive a refund, Web3 will issue you a refund and ask you
                    to specify how the product failed to live up to expectations.
                </p>
                <p className='text-muted'>
                    However, we are not obliged to give refunds in any of the situations listed below.
                </p>
                <ul className='mb-0'>
                    <li>You don’t want it after you’ve downloaded it</li>
                    <li>You change your mind</li>
                    <li>You bought an item by mistake</li>
                    <li>You do not have sufficient expertise to use the item.</li>
                </ul>
            </>
        ),
    },
    {
        question: 'Is Sales Tax or VAT included in the price?',
        answer: 'VAT or Sales Tax are included in the product price.',
    },
    {
        question: 'More questions?',
        answer: (
            <p className='text-muted mb-0'>
                If you can’t find the answers here,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    get in touch
                </a>
                . We will be happy to help.
            </p>
        ),
    },
];

export const licenseQuestions = [
    {
        question: 'On how many websites can I use your product?',
        answer: (
            <>
                <p className='text-muted'>
                    If you will choose the <strong className='text-dark'>Startup Plan</strong>, you can use the product
                    on one website (+ one development environment).
                </p>
                <p className='text-muted mb-0'>
                    If you opt for the <strong className='text-dark'>Unlimited Plan</strong>, you can use the product on
                    as many websites as you wish.
                </p>
            </>
        ),
    },
    {
        question: 'Is the price of the product one-time or recurring (monthly/yearly)?',
        answer: (
            <>
                <p className='text-muted'>
                    We sell our products with a yearly subscription but the license is valid for the lifetime of the
                    product.
                </p>
                <p className='text-muted'>
                    The subscription comes with access to the repository, support, and free updates.
                </p>
                <p className='text-muted mb-0'>
                    If you don’t renew your subscription for the next year, you will still have a valid license to use
                    the product forever, but you won’t be able to get more updates.
                </p>
            </>
        ),
    },
    {
        question: 'What happens after my support is expired?',
        answer: (
            <>
                <p className='text-muted'>
                    When your plan expires, your product remains working & your license valid. But you lose your support
                    & updates.
                </p>
                <p className='text-muted mb-0'>To extend your support, you will have to extend your membership plan.</p>
            </>
        ),
    },
    {
        question: 'More questions?',
        answer: (
            <p className='text-muted mb-0'>
                If you can’t find the answers here,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    get in touch
                </a>
                . We will be happy to help.
            </p>
        ),
    },
];

export const supportQuestions = [
    {
        question: 'Do you provide support for your products?',
        answer: 'Yes, all our products come with free support during your active subscription.',
    },
    {
        question: 'What happens after my support is expired?',
        answer: (
            <>
                <p className='text-muted'>
                    When your plan expires, your product remains working & your license valid. But you lose your support
                    & updates.
                </p>
                <p className='text-muted mb-0'>To extend your support, you will have to extend your membership plan.</p>
            </>
        ),
    },
    {
        question: 'How can I get support?',
        answer: (
            <>
                <p className='text-muted'>The Startup Plan comes with e-mail support.</p>
                <p className='text-muted mb-0'>
                    The Unlimited Plan comes with e-mail support, but we are available also on Slack.
                </p>
            </>
        ),
    },
    {
        question: 'What is included in Support?',
        answer: (
            <>
                <p className='text-muted'>Support includes:</p>
                <ul>
                    <li>Availability to answer your questions (e-mail: 2 business days, Slack: 1 business day)</li>
                    <li>Answering technical questions about item’s features</li>
                    <li>Assistance with reported bugs and issues</li>
                    <li>Discretionary version updates during the license period</li>
                </ul>
                <p className='text-muted'>Support doesn’t include:</p>
                <ul className='mb-0'>
                    <li>Customization services (available with additional fees)</li>
                    <li>Installation services (available with additional fees)</li>
                </ul>
            </>
        ),
    },
    {
        question: 'More questions?',
        answer: (
            <p className='text-muted mb-0'>
                If you can’t find the answers here,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    get in touch
                </a>
                . We will be happy to help.
            </p>
        ),
    },
];
