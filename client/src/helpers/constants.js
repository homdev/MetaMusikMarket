export const categoryOptions = [
    { label: 'Art', value: 'art', icon: 'las la-palette' },
    { label: 'Musique', value: 'music', icon: 'las la-music' },
    { label: 'Jeu', value: 'game', icon: 'las la-gamepad' },
    { label: 'Memes', value: 'memes', icon: 'las la-frog' },
    { label: 'Cartes NFT', value: 'trendingCards', icon: 'las la-mail-bulk' },
    { label: 'Objets de collection', value: 'collectibles', icon: 'las la-boxes' },
];

export const categorySelectBox = [
    { label: 'All', value: 'all' },
    { label: 'Art', value: 'art' },
    { label: 'Musique', value: 'music' },
    { label: 'Jeu', value: 'game' },
    { label: 'Memes', value: 'memes' },
    { label: 'Cartes NFT', value: 'trendingCards' },
    { label: 'Objets de collection', value: 'collectibles' },
];

export const particlesOptions = {
    fpsLimit: 15,
    fullScreen: {
        enable: false,
    },
    particles: {
        color: {
            value: '#3275ac',
        },
        links: {
            color: '#ffffff',
            distance: 150,
            enable: false,
            opacity: 0,
            width: 1,
        },
        collisions: {
            enable: false,
        },
        move: {
            direction: 'top',
            enable: true,
            outMode: 'out',
            random: true,
            speed: 0.5,
            straight: false,
        },
        number: {
            value: 250,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: 'circle',
        },
        size: {
            random: true,
            value: 4,
        },
    },
    detectRetina: true,
};
