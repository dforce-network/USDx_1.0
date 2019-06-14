const BN = require('bn.js');

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
const Setting = artifacts.require('DFSetting.sol');
const DSWrappedToken = artifacts.require('DSWrappedToken.sol');
// const DF = artifacts.require('DFToken.sol');

// const USDx_Addr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
const DF_Addr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

let daiW = new BN(Number(0.01 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let paxW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let tusdW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let usdcW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(USDx, "0x6b6b00000000000000000000000000");
    // await deployer.deploy(DF, "0x6b6600000000000000000000000000");
    await deployer.deploy(Guard);
    await deployer.deploy(Protocol);
    
var xDAI  = await deployer.deploy(DSWrappedToken, '0xf494e07dfdbce883bf699cedf818fde2fa432db4', 18, "0x6b6b00000000000000000000000000");
var xPAX  = await deployer.deploy(DSWrappedToken, '0x2901ea287e0299d595783faedae3ca0ab2bc4e53', 12, "0x6b6c00000000000000000000000000");
var xTUSD = await deployer.deploy(DSWrappedToken, '0xfb010ff66700b6ace85fa68e2d98ab754b6f7af4', 8, "0x6b6a00000000000000000000000000"); 
var xUSDC = await deployer.deploy(DSWrappedToken, '0x481f8ff13489695b2e1c81691a95a81f8cb96e32', 6, "0x6b6800000000000000000000000000"); 
    
    console.log('----------------------------------\n');
    console.log('xDAI address : ' + xDAI.address);
    console.log('xPAX address : ' + xPAX.address);
    console.log('xTUSD address : ' + xTUSD.address);
    console.log('xUSDC address : ' + xUSDC.address);
    console.log('----------------------------------\n');
    await deployer.deploy(Store,
        [
            '0xf494e07dfdbce883bf699cedf818fde2fa432db4',
            '0x2901ea287e0299d595783faedae3ca0ab2bc4e53',
            '0xfb010ff66700b6ace85fa68e2d98ab754b6f7af4',
            '0x481f8ff13489695b2e1c81691a95a81f8cb96e32'
        ], 
        [
            xDAI.address,
            xPAX.address,
            xTUSD.address,
            xUSDC.address,
        ],
        [daiW, paxW, tusdW, usdcW]);
    await deployer.deploy(Collateral);
    await deployer.deploy(Funds, DF_Addr);
    await deployer.deploy(Pool, Collateral.address);
    await deployer.deploy(Medianizer);
    await deployer.deploy(PriceFeed);
    await deployer.deploy(Engine, USDx.address, Store.address, Pool.address, Collateral.address, Funds.address);
    await deployer.deploy(Setting, Store.address);
    
};
