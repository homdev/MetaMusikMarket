export const DECIMALS = 10 ** 18;

export const ether = (wei) => wei / DECIMALS;

export const formatPrice = (price) => {
    const precision = 100; // Use 2 decimal places

    price = ether(price);
    price = Math.round(price * precision) / precision;

    return price;
};

export function navbarChangeStyle() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function () {
        let windowScroll = document.scrollingElement.scrollTop;
        if (windowScroll >= 10) {
            navbar.classList.add('navbar-active');
        } else {
            navbar.classList.remove('navbar-active');
        }
    });
}

export function authCloseNavbar() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach((link) => {
        link.addEventListener('click', function () {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', false);
        });
    });
}

export function formatDate(itemDate) {
    return `${new Date(itemDate).getDate()}/${new Date(itemDate).getMonth() + 1}/${new Date(
        itemDate
    ).getFullYear()} ${new Date(itemDate).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
}

export function formteFullDate(date) {
    return `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}/${new Date(date).getFullYear()} ${new Date(
        date
    ).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
}

export function formatCategory(category) {
    if (category === 'art') {
        category = 'Art';
    } else if (category === 'trendingCards') {
        category = 'Cartes NFT';
    } else if (category === 'game') {
        category = 'Jeu';
    } else if (category === 'memes') {
        category = 'Memes';
    } else if (category === 'collectibles') {
        category = 'Objets de collection';
    } else if (category === 'music') {
        category = 'Musique';
    } else {
        category = 'General';
    }
    return category;
}

export function truncate(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    separator = separator || '...';
    let sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}

export function truncateStart(fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    separator = separator || '...';
    let charsToShow = strLen,
        frontChars = Math.ceil(charsToShow);

    return fullStr.substr(0, frontChars) + separator;
}

export function configEtherScanUrl(network, account) {
    let blockExplorerUrl;
    if (network === 3) {
        blockExplorerUrl = 'https://ropsten.etherscan.io';
    } else if (network === 4) {
        blockExplorerUrl = 'https://rinkeby.etherscan.io';
    } else if (network === 42) {
        blockExplorerUrl = 'https://kovan.etherscan.io';
    } else if (network === 5) {
        blockExplorerUrl = 'https://goerli.etherscan.io';
    } else if (network === 56) {
        blockExplorerUrl = 'https://bscscan.com';
    } else if (network === 137) {
        blockExplorerUrl = 'https://polygonscan.com';
    } else if (network === 97) {
        blockExplorerUrl = 'https://testnet.bscscan.com';
    } else if (network === 44787) {
        blockExplorerUrl = 'https://alfajores.celoscan.xyz/';
    } else if (network === 80001) {
        blockExplorerUrl = 'https://mumbai.polygonscan.com';
    } else {
        blockExplorerUrl = 'https://etherscan.io';
    }

    return `${blockExplorerUrl}/address/${account}`;
}

export function arrayMatch(arr1, arr2) {
    var arr = [];
    arr1 = arr1.toString().split(',').map(Number);
    arr2 = arr2.toString().split(',').map(Number);
    // for array1
    for (var i in arr1) {
        if (arr2.indexOf(arr1[i]) !== -1) arr.push(arr1[i]);
    }

    return arr.sort((x, y) => x - y);
}

export function generateRandomImage(max) {
    const val = Math.floor(Math.random() * max) + 1;
    if (val === 0) {
        return 'https://i.postimg.cc/KzFk8y0R/avatar-1.png';
    } else if (val === 1) {
        return 'https://i.postimg.cc/KzFk8y0R/avatar-1.png';
    } else if (val === 2) {
        return 'https://i.postimg.cc/x81XL3DQ/avatar-2.png';
    } else if (val === 3) {
        return 'https://i.postimg.cc/j23Lcnt7/avatar-3.png';
    } else if (val === 4) {
        return 'https://i.postimg.cc/MK4njBsk/avatar-4.png';
    } else if (val === 5) {
        return 'https://i.postimg.cc/Y9p0wzSF/avatar-5.png';
    } else if (val === 6) {
        return 'https://i.postimg.cc/rpGsbPqc/avatar-6.png';
    } else if (val === 7) {
        return 'https://i.postimg.cc/ZRVRYv9M/avatar-7.png';
    }
}
