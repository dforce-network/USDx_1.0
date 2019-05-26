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
const DF = artifacts.require('DFToken.sol');

const USDx_Addr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
const DFN_Addr = "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4";

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(USDx, "0x6b6b00000000000000000000000000");
    await deployer.deploy(DF, "0x6b6600000000000000000000000000");
    await deployer.deploy(Guard);
    await deployer.deploy(Protocol);
    await deployer.deploy(Store,
        [
            '0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a',
            '0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f',
            '0xebb02dbf58104b93af2a89ae55ef2d7a7be36247',
            '0x676ce98a3bc9c191903262f887bb312ce20f851f'
        ], [100, 200, 300, 400]);
    await deployer.deploy(Collateral);
    await deployer.deploy(Funds, "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4");
    await deployer.deploy(Pool, Collateral.address);
    await deployer.deploy(Medianizer);
    await deployer.deploy(PriceFeed);
    await deployer.deploy(Engine, "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6", "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4",
        Store.address, Pool.address, Collateral.address, Funds.address, Medianizer.address);
};