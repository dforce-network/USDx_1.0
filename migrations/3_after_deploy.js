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
const DF = artifacts.require('DFToken.sol');

module.exports = async function(deployer, network, accounts) {

    let contractFunds = await Funds.deployed();
    let contractProtocol = await Protocol.deployed();
    let contractPool = await Pool.deployed();
    let contractStore = await Store.deployed();
    let contractCollateral = await Collateral.deployed();
    let contarctEngine = await Engine.deployed();
    let contractGuard = await Guard.deployed();
    let contractPriceFeed = await PriceFeed.deployed();
    let contractMedianizer = await Medianizer.deployed();
    let contractUSDx = await USDx.deployed();
    let contractDF = await DF.deployed();

    let count = 0

    function print(str) {
        count++;
        console.log(`\n${count} #######`, str);
    }

    function printTx(str) {
        console.log(`\n-#######`, str);
    }

    function error(str) {
        console.log(`\n!!!!!!!`, str); 
    }

    // USDx
    await contractUSDx.setAuthority.sendTransaction(contarctEngine.address).then(result => {
        print("contractUSDx.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractUSDx.setAuthority")
    })

    await contractUSDx.mint.sendTransaction(accounts[0], 0).then(result => {
        print("contractUSDx.mint");
        printTx(result.tx);
    }).catch(error => {
        error("contractUSDx.mint")
    })

    // DF
    await contractDF.setAuthority.sendTransaction(contarctEngine.address).then(result => {
        print("contractDF.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractDF.setAuthority")
    })

    let ten = new BN(Number(10000000000 * 10 ** 18).toLocaleString().replace(/,/g,''));

    await contractDF.mint.sendTransaction(accounts[0], ten).then(result => {
        print("contractDF.mint");
        printTx(result.tx);
    }).catch(error => {
        error("contractDF.mint")
    })

    // store
    await contractStore.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractStore.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractStore.setAuthority")
    })

    // Pool
    await contractPool.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractPool.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractPool.setAuthority")
    })

    // Collateral
    await contractCollateral.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractCollateral.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractCollateral.setAuthority")
    })

    // Funds
    await contractFunds.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractFunds.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contractFunds.setAuthority")
    })

    // Engine
    await contarctEngine.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contarctEngine.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        error("contarctEngine.setAuthority")
    })

    // Guard
    await contractGuard.permitx.sendTransaction(contarctEngine.address, contractStore.address).then(result => {
        print("contractGuard.permitx Store");
        printTx(result.tx);
    }).catch(error => {
        error("contractGuard.permitx Store")
    })

    await contractGuard.permitx.sendTransaction(contarctEngine.address, contractPool.address).then(result => {
        print("contractGuard.permitx Pool");
        printTx(result.tx);
    }).catch(error => {
        error("contractGuard.permitx Pool")
    })

    await contractGuard.permitx.sendTransaction(contarctEngine.address, contractCollateral.address).then(result => {
        print("contractGuard.permitx Collateral");
        printTx(result.tx);
    }).catch(error => {
        error("contractGuard.permitx Collateral")
    })

    await contractGuard.permitx.sendTransaction(contarctEngine.address, contractFunds.address).then(result => {
        print("contractGuard.permitx Funds");
        printTx(result.tx);
    }).catch(error => {
        error("contractGuard.permitx Funds")
    })

    await contractGuard.permitx.sendTransaction(contractProtocol.address, contarctEngine.address).then(result => {
        print("contractGuard.permitx Engine");
        printTx(result.tx);
    }).catch(error => {
        error("contractGuard.permitx Engine")
    })

    // Protocol
    await contractProtocol.requestImplChange.sendTransaction(contarctEngine.address).then(result => {
        print("contractProtocol.requestImplChange");
        printTx(result.tx);
    }).catch(error => {
        error("contractProtocol.requestImplChange")
    })

    await contractProtocol.confirmImplChange.sendTransaction().then(result => {
        print("contractProtocol.confirmImplChange");
        printTx(result.tx);
    }).catch(error => {
        error("contractProtocol.confirmImplChange")
    })
};