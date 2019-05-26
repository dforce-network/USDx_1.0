const Funds = artifacts.require('DFFunds.sol');
const Protocol = artifacts.require('DFProtocol.sol');
const Store = artifacts.require('DFStore.sol');
const Pool = artifacts.require('DFPool.sol');
const Collateral = artifacts.require('DFCollateral.sol');
const Engine = artifacts.require('DFEngine.sol');
const Guard = artifacts.require('DSGuard.sol');
const PriceFeed = artifacts.require('PriceFeed.sol');
const Medianizer = artifacts.require('Medianizer.sol');

module.exports = async function(deployer) {

    let contractFunds = await Funds.deployed();
    let contractProtocol = await Protocol.deployed();
    let contractPool = await Pool.deployed();
    let contractStore = await Store.deployed();
    let contractCollateral = await Collateral.deployed();
    let contarctEngine = await Engine.deployed();
    let contractGuard = await Guard.deployed();
    let contractPriceFeed = await PriceFeed.deployed();
    let contractMedianizer = await Medianizer.deployed();

    function print(str) {
        console.log("\n#######", str);
    }

    // store
    contractStore.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractStore.setAuthority");
        print(result.tx);
    })

    // Pool
    contractPool.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractPool.setAuthority");
        print(result.tx);
    })

    // Collateral
    contractCollateral.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractCollateral.setAuthority");
        print(result.tx);
    })

    // Funds
    contractFunds.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractFunds.setAuthority");
        print(result.tx);
    })

    // Guard
    contractGuard.permitx.sendTransaction(contarctEngine.address, contractStore.address).then(result => {
        print("contractGuard.permitx Store");
        print(result.tx);
    })

    contractGuard.permitx.sendTransaction(contarctEngine.address, contractPool.address).then(result => {
        print("contractGuard.permitx Pool");
        print(result.tx);
    })

    contractGuard.permitx.sendTransaction(contarctEngine.address, contractCollateral.address).then(result => {
        print("contractGuard.permitx Collateral");
        print(result.tx);
    })

    contractGuard.permitx.sendTransaction(contarctEngine.address, contractFunds.address).then(result => {
        print("contractGuard.permitx Funds");
        print(result.tx);
    })

    // Protocol
    contractProtocol.requestImplChange.sendTransaction(contarctEngine.address).then(result => {
        print("contractProtocol.requestImplChange");
        print(result.tx);
    })

    contractProtocol.confirmImplChange.sendTransaction().then(result => {
        print("contractProtocol.confirmImplChange");
        print(result.tx);
    })
};