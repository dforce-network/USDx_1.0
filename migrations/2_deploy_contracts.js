const Funds = artifacts.require('DFFunds.sol');
const Protocol = artifacts.require('DFProtocol.sol');
const Store = artifacts.require('DFStore.sol');
const Pool = artifacts.require('DFPool.sol');
const Collateral = artifacts.require('DFCollateral.sol');
const Engine = artifacts.require('DFEngine.sol');
const Guard = artifacts.require('DSGuard.sol');
const PriceFeed = artifacts.require('PriceFeed.sol');
const Medianizer = artifacts.require('Medianizer.sol');
const USDx = artifacts.require('USDXToken.sol');
// const DF = artifacts.require('DFToken.sol');

// const USDx_Addr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
const DF_Addr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(USDx, "0x6b6b00000000000000000000000000");
    // await deployer.deploy(DF, "0x6b6600000000000000000000000000");
    await deployer.deploy(Guard);
    await deployer.deploy(Protocol);
    await deployer.deploy(Store,
        [
            '0xf494e07dfdbce883bf699cedf818fde2fa432db4',
            '0x561b11000e95ac053eccec5bcefdc37e16c2491b',
            '0x25470030aa105bca679752e5c5e482c295de2b68',
            '0xbc34e50f589e389c507e0213501114bd2e70b1d7'
        ], [10, 20, 30, 40]);
    await deployer.deploy(Collateral);
    await deployer.deploy(Funds, DF_Addr);
    await deployer.deploy(Pool, Collateral.address);
    await deployer.deploy(Medianizer);
    await deployer.deploy(PriceFeed);
    await deployer.deploy(Engine, USDx.address, Store.address, Pool.address, Collateral.address, Funds.address);
};