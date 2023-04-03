const Collectible = artifacts.require('Collectible');
const Marketplace = artifacts.require('Marketplace');
const NFTAuction = artifacts.require('NFTAuction');
const UserInfo = artifacts.require('UserInfo');
const NFTAnalytics = artifacts.require('NFTAnalytics');

module.exports = async function (deployer) {
    var commission = 25; // commission represented in wei
    var name = 'Marketplace MRF';
    var symbol = 'MRF';
    await deployer.deploy(UserInfo);
    const user = await UserInfo.deployed();
    await deployer.deploy(NFTAnalytics, user.address);
    const analytics = await NFTAnalytics.deployed();
    await deployer.deploy(Collectible, name, symbol, commission, analytics.address);
    const NFT = await Collectible.deployed();
    const nft_address = NFT.address;
    await deployer.deploy(Marketplace, nft_address, user.address, analytics.address);
    const market = await Marketplace.deployed();
    await deployer.deploy(NFTAuction, nft_address, user.address, market.address, analytics.address);
};
