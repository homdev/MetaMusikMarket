# MetaRealFights | NFT Marketplace

**MetaRealFights** is an online marketplace where you can buy, sell or trade NFT tokens. It gives creators a direct way to sell their non-fungible assets such as artwork, and customers can purchase these assets by using a cryptocurrency.

Anyone can sign up to MetaRealFights and link his crypto wallet with it [Supports only MetaMask Wallet for now] and start trading. MetaRealFights will feature listings of all of the different kinds of NFTs such as art, collectibles, domain names, music, photography, sports trading cards... etc.

By using MetaRealFights, you will normally be given a chance to buy or sell NFT either at a fixed price or as a kind of auction [auctions will be available in the next release]. If you’ve purchased an NFT, it basically means that you have exclusive ownership of this unique digital asset and you have the ability to resell it again.

## Requirements

-   Code Editing Software (eg: Dreamweaver, Sublime Text, Visual Studio Code)
-   Local Ethereum environment, we prefer Ganache
-   Crypto Wallet. MetaMask
-   Node.js environment

## Getting started

This app uses **React.js functional components**, making advantage of the React Hooks. Also, this app is using **Solidity & Web3.js** to create & deal with Smart Contracts.

### Template's directory structure

As this App is using `Truffle` framework, you should the same structure you get from running this truffle command `truffle unbox react`

-   `/client` - Serves the app Front End components & functionalities.
-   `/contracts` - Contains app smart contracts.
-   `/migrations` - contains JavaScript files that help you to generate abis from our smart contracts.
-   `/test` - Some unit test function to validate the app functionality
-   `.gitattributes`
-   `.gitignore`
-   `truffle-config.js` - Configuration file for truffle framework that works on Ganache

## Installation

**1•** Make sure you're installing **Truffle** on your local machine:

```
npm install -g truffle
```

**2-** Download and install **Ganache** on your local machine, download from [here](https://trufflesuite.com/ganache/)

**3-** Run the Ganache local network after installing it.

**4-** Inside `\client` directory, install react dependencies:

```
npm install
```

or

```
npm install --legacy-peer-deps
```

**5-** Run the following command in your root directory:

```
truffle migrate --network development --reset
```

**6** Install truffle dependencies at the root directory:

```
npm install
```

**7** After installing node modules, still on `\client` directory, run the development server, and you're ready to go.

```
npm start
```

## Important settings

-   **Render NFTs without MetaMask:**
    You have to add the Network RPC URL of the network where you deploy your contracts to `settings` object. from `/client/helpers/settings` change the `rpcUrl` property with your network RPC URL.
    Also, change the `networkId` property to your network chain ID.
-   **Change logo:**
    You can change theme logo and brand name from settings object. from `/client/helpers/settings`
-   **Set your custom commission:**
    To change sale commission you can change it from 2 places, the 2 are mandatory:
    1- At `/client/helpers/settings.js` from settings object, on `saleCommession` property. 1000 represents 100% e.g. 250 represents 25% etc...
    2- 2. At `/migrations/2_deploy_contracts.js` from `fees` variable. put the same value you've added to settings file
-   **Change forms addresses:**
    This app uses **Formspree** for sending contact requests and newsletter subscriptions, register to [Formspree](https://formspree.io/) and follow instructions to get forms id and add theme to `settings` object
-   **Set featured items "Featured this Month":**
    From `settings` object, you can add arrays of featured items into `featuredItems` property, each item inside the array represents the `id` of desired asset, it starts from 1, so carefully pick your needed assets.

## Deployment

### 1. Host Provider - for the Front End

Ideally, any share hosting that supports **React** will work for you, if you know how to configure and deploy a React project, you'll only need to upload `/client` folder and run `npm run build` on your server.
If you don't know how to run the build on your server, follow the following steps.

-   Inside `/client` directory, run the following command

```
npm run build
```

-   This command will generate `/build` directory inside `/client` folder
-   Upload only the `/build` directory to your server. And you're done for UI part

## Network Deployment - for the smart contracts

Add your network configs inside `truffle-config.js` file, we've included the configs of **BSC** and **Polygon** networks, you can add your desired Ethereum network inside the `networks` object.

Add your MetaMask wallet secret passphrase to the `mnumenic` variable.

Make sure that you have credits into the MetaMask account that will run the deployments, if you want to run it with another account, make sure to include a third parameter to the `provider: () =>` function, this parameter represents the index of your account into your wallet, e.g. if you will run with the **third** account, then add **2**

```
provider: () => new HDWalletProvider(mnemonic, "https://rpc-mumbai.maticvigil.com", 2)
```

After you finish the configuration, run this command with the network name at the root directory

```
truffle migrate --network yourNetworkName --reset
```

## How it works

-   User connect crypto wallet with the marketplace
-   User sign up
-   Mint/Create NFT and define characteristics
-   List digital assets/NFTs for sale
-   NFTs transferred to the marketplace.
-   Buyers/investors purchase the NFT token.
-   Marketplace transfers the NFT token to the buyer.
-   Buyers can redistribute the NFT token.

## 3rd-Parties

The following links lead to the scripts we have used in this app, they are free lisenced and available to use.

| Plugin                    | Source                                              |
| ------------------------- | --------------------------------------------------- |
| Bootstrap                 | https://getbootstrap.com                            |
| Line Awesome              | https://icons8.com/line-awesome                     |
| Swiper.js                 | https://swiperjs.com                                |
| Framer Motion             | https://www.npmjs.com/package/framer-motion         |
| React Parallax Mouse      | https://www.npmjs.com/package/react-parallax-mouse  |
| React toast notifications | https://jossmac.github.io/react-toast-notifications |
| React Dropdown Select     | https://github.com/sanusart/react-dropdown-select   |
| Formspree                 | https://www.npmjs.com/package/@formspree/react      |

**Note!** - All images used are not allowed to use, it's only for demo purpose

## Changelog

```
----------------------------------------
    v1.1.0
----------------------------------------
    - Supporting audio/video NFTs
    - Adding blocking inappropriate NFTs/Auctions functionality
    - Adding Auctions list to the admin panel
    - Adding switch network functionality
    - Removing blocked NFTs from transaction records
    - Generating random placeholder avatars during registration
    - General tweaks and bug fixes


----------------------------------------
    v1.0.0
----------------------------------------
    - Initial release
```
