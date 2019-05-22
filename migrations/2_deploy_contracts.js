const Fees = artifacts.require('DFFunds.sol');
const ConverterProxy = artifacts.require('DFProtocol.sol');
const DataStore = artifacts.require('DFStore.sol');
const Pool = artifacts.require('DFPool.sol');
const Bank = artifacts.require('DFCollareral.sol');
const Converter = artifacts.require('DFEngine.sol');
const Guard = artifacts.require('DSGuard.sol');
const PriceFeed = artifacts.require('PriceFeed.sol');
const Medianizer = artifacts.require('Medianizer.sol');

const USDx_Addr = "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6";
const DFN_Addr = "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4";

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Guard);
    await deployer.deploy(ConverterProxy);
    await deployer.deploy(DataStore,
        [
            '0x235b370de0b0cd3fb9e987e4957a9db0f1c3dd5a',
            '0x9aa0fa0a4e2634fbbf1b716fcabf8650a8fa330f',
            '0xebb02dbf58104b93af2a89ae55ef2d7a7be36247',
            '0x676ce98a3bc9c191903262f887bb312ce20f851f'
        ], [100, 200, 300, 400]);
    await deployer.deploy(Bank);
    await deployer.deploy(Fees, "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4");
    await deployer.deploy(Pool, Bank.address);
    await deployer.deploy(Converter, "0x17996ea27d03d68ddc618f9b8f0faf43838acaf6", "0xfaacf3d2a2ce1102073038e035d24c1c78b6e9c4",
        DataStore.address, Pool.address, Bank.address, Fees.address);
    await deployer.deploy(Medianizer);
    await deployer.deploy(PriceFeed);
};