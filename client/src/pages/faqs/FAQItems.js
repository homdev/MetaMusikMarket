import React from 'react';

export const techQuestions = [
    {
        question: 'Avec quelle pile la place de marché est-elle construite ?',
        answer: (
            <div className='text-muted mb-0'>
                Nous utilisons :
                <ul className='mb-0'>
                    <li>
                        <strong className='text-dark'>Solidity </strong>- construire des contrats intelligents
                    </li>
                    <li>
                        <strong className='text-dark'>Truffle suite </strong> – l'environnement de développement, le cadre
                        de test et un pipeline d'actifs pour les blockchains.
                    </li>
                    <li>
                        <strong className='text-dark'>Web3.js </strong> – Bibliothèque JavaScript qui permet d'interagir
                        avec un nœud Ethereum local ou distant
                    </li>
                    <li>
                        <strong className='text-dark'>IPFS </strong> – Serveur pour enregistrer des images avec des métadonnées dans la
                        chaîne de blocs
                    </li>
                    <li>
                        <strong className='text-dark'>MetaMask </strong> – Portefeuille de crypto-monnaie pour l'échange de NFT
                    </li>
                    <li>
                        <strong className='text-dark'>React.js </strong> – JavaScript pour construire l'interface utilisateur et
                        et de tout relier entre eux
                    </li>
                    <li>
                        <strong className='text-dark'>Bootstrap 5 </strong> – UI
                    </li>
                </ul>
            </div>
        ),
    },
    {
        question: 'Quelles sont les blockchains prises en charge ?',
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
        question: 'Quels sont les portefeuilles pris en charge ?',
        answer: 'Actuellement, vous pouvez utiliser le portefeuille MetaMask.',
    },
    {
        question: "D'autres questions ?",
        answer: (
            <p className='text-muted mb-0'>
                Si vous ne trouvez pas les réponses ici,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    prendre contact
                </a>
                . Nous serons heureux de vous aider.
            </p>
        ),
    },
];

export const purchaseQuestions = [
    {
        question: 'Quels sont les modes de paiement acceptés ?',
        answer: (
            <p className='text-muted mb-0'>
                Nous acceptons tous les principaux fournisseurs de cartes de paiement, Apple Pay, Google Pay et PayPal..
            </p>
        ),
    },
    {
        question: 'Sur combien de sites Internet puis-je utiliser votre produit ?',
        answer: (
            <>
                <p className='text-muted'>
                Si vous choisissez l'option <strong className='text-dark'>Plan de démarrage</strong>, vous pouvez utiliser le produit
                    sur un seul site web (+ un environnement de développement).
                </p>
                <p className='text-muted mb-0'>
                Si vous optez pour le <strong className='text-dark'>Plan illimité</strong>, vous pouvez utiliser le produit sur
                    autant de sites web que vous le souhaitez.
                </p>
            </>
        ),
    },
    {
        question: 'Quelle est votre politique de remboursement ?',
        answer: (
            <>
                <p className='text-muted'>
                Vous disposez de 24 heures pour inspecter votre achat et déterminer s'il ne répond pas aux attentes que nous avons formulées.
                    attentes que nous avons formulées. Si vous souhaitez être remboursé, Web3 vous remboursera et vous demandera de préciser en quoi le produit n'a pas répondu à vos attentes.
                    de préciser en quoi le produit n'a pas répondu aux attentes.
                </p>
                <p className='text-muted'>
                Toutefois, nous ne sommes pas obligés d'accorder des remboursements dans les situations énumérées ci-dessous.
                </p>
                <ul className='mb-0'>
                    <li>Vous n'en voulez pas après l'avoir téléchargé</li>
                    <li>Vous changez d'avis</li>
                    <li>Vous avez acheté un article par erreur</li>
                    <li>Vous n'avez pas les compétences suffisantes pour utiliser l'article.</li>
                </ul>
            </>
        ),
    },
    {
        question: 'La taxe sur les ventes ou la TVA est-elle incluse dans le prix ?',
        answer: 'La TVA ou la taxe sur les ventes sont incluses dans le prix du produit.',
    },
    {
        question: "D'autres questions ?",
        answer: (
            <p className='text-muted mb-0'>
                Si vous ne trouvez pas les réponses ici,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    prendre contact
                </a>
                . Nous serons heureux de vous aider.
            </p>
        ),
    },
];

export const licenseQuestions = [
    {
        question: 'Sur combien de sites Internet puis-je utiliser votre produit ?',
        answer: (
            <>
                <p className='text-muted'>
                Si vous choisissez l'option <strong className='text-dark'>Plan de démarrage</strong>, vous pouvez utiliser le produit
                    sur un seul site web (+ un environnement de développement).
                </p>
                <p className='text-muted mb-0'>
                Si vous optez pour le <strong className='text-dark'>Plan illimité</strong>, you can use the product on
                    as many websites as you wish.
                </p>
            </>
        ),
    },
    {
        question: 'Le prix du produit est-il unique ou récurrent (mensuel/annuel) ?',
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
        question: "D'autres questions ?",
        answer: (
            <p className='text-muted mb-0'>
                Si vous ne trouvez pas les réponses ici,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    prendre contact
                </a>
                . Nous serons heureux de vous aider.
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
        question: "Comment puis-je obtenir de l'aide ?",
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
        question: "D'autres questions ?",
        answer: (
            <p className='text-muted mb-0'>
                Si vous ne trouvez pas les réponses ici,{' '}
                <a
                    rel='noopener noreferrer'
                    href='https://webconcepter.com/contact-us/'
                    className='text-primary fw-bold'
                    target='_blank'
                >
                    prendre contact
                </a>
                . Nous serons heureux de vous aider.
            </p>
        ),
    },
];
