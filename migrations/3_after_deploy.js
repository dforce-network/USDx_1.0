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
// const Convert = artifacts.require('DFConvert.sol');
const xDAI = artifacts.require('DSWrappedToken.sol');
const xPAX = artifacts.require('DSWrappedToken.sol');
const xTUSD = artifacts.require('DSWrappedToken.sol');
const xUSDC = artifacts.require('DSWrappedToken.sol');
// const DF = artifacts.require('DFToken.sol');
const DF_Addr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

module.exports = async function (deployer, network, accounts) {

    let contractFunds = await Funds.deployed();
    let contractProtocol = await Protocol.deployed();
    let contractPool = await Pool.deployed();
    let contractStore = await Store.deployed();
    let contractCollateral = await Collateral.deployed();
    let contractEngine = await Engine.deployed();
    let contractGuard = await Guard.deployed();
    let contractPriceFeed = await PriceFeed.deployed();
    let contractMedianizer = await Medianizer.deployed();
    let contractUSDx = await USDx.deployed();
    let contractSetting = await Setting.deployed();
    // let contractConvert = await Convert.deployed();
    // let contractDF = await DF.deployed();

    // let contractxDAI  = await xDAI.deployed();
    // let contractxPAX  = await xPAX.deployed();
    // let contractxTUSD  = await xTUSD.deployed();
    // let contractxUSDC  = await xUSDC.deployed();

    let count = 0

    function print(str) {
        count++;
        console.log(`\n${count} #######`, str);
    }

    function printTx(str) {
        console.log(`\n-#######`, str);
    }

    function perror(str) {
        console.log(`\n!!!!!!!`, str);
    }

    // USDx
    await contractUSDx.setAuthority.sendTransaction(contractEngine.address).then(result => {
        print("contractUSDx.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractUSDx.setAuthority")
    })

    // xDAI
    // await contractxDAI.setAuthority.sendTransaction(contractEngine.address).then(result => {
    //     print("contractxDAI.setAuthority");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractxDAI.setAuthority")
    // })

    // // xPAX
    // await contractxPAX.setAuthority.sendTransaction(contractEngine.address).then(result => {
    //     print("contractxPAX.setAuthority");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractxPAX.setAuthority")
    // })

    // // xUSDC
    // await contractxUSDC.setAuthority.sendTransaction(contractEngine.address).then(result => {
    //     print("contractxUSDC.setAuthority");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractxUSDC.setAuthority")
    // })
    

    // // DF
    // await contractDF.setAuthority.sendTransaction(contractEngine.address).then(result => {
    //     print("contractDF.setAuthority");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractDF.setAuthority")
    // })

    // // Mint DF
    // let ten = new BN(Number(1000000000 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    // await contractDF.mint.sendTransaction(accounts[0], ten).then(result => {
    //     print("contractDF.mint");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractDF.mint")
    // })

    // Set guard => Store 
    await contractStore.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractStore.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractStore.setAuthority")
    })

    // Set guard => Pool
    await contractPool.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractPool.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractPool.setAuthority")
    })

    // Set guard => Collateral
    await contractCollateral.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractCollateral.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractCollateral.setAuthority")
    })

    // Set guard => Funds
    await contractFunds.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractFunds.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractFunds.setAuthority")
    })

    // Set guard => Engine
    await contractEngine.setAuthority.sendTransaction(contractGuard.address).then(result => {
        print("contractEngine.setAuthority");
        printTx(result.tx);
    }).catch(error => {
        perror("contractEngine.setAuthority")
    })

    // Set guard => Convert
    // await contractConvert.setAuthority.sendTransaction(contractGuard.address).then(result => {
    //     print("contractConvert.setAuthority");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractConvert.setAuthority")
    // })

    // Store permit => Engine
    await contractGuard.permitx.sendTransaction(contractEngine.address, contractStore.address).then(result => {
        print("contractGuard.permitx Store Engine");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Store Engine")
    })

    // Store permit => Convert
    // await contractGuard.permitx.sendTransaction(contractConvert.address, contractStore.address).then(result => {
    //     print("contractGuard.permitx Store Convert");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractGuard.permitx Store Convert")
    // })

    // Store permit => Setting
    await contractGuard.permitx.sendTransaction(contractSetting.address, contractStore.address).then(result => {
        print("contractGuard.permitx Store Setting");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Store Setting")
    })

    // Pool permit => Engine
    await contractGuard.permitx.sendTransaction(contractEngine.address, contractPool.address).then(result => {
        print("contractGuard.permitx Pool");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Pool")
    })

    // Collateral permit => Engine
    await contractGuard.permitx.sendTransaction(contractEngine.address, contractCollateral.address).then(result => {
        print("contractGuard.permitx Collateral");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Collateral")
    })

    // Funds permit => Engine
    await contractGuard.permitx.sendTransaction(contractEngine.address, contractFunds.address).then(result => {
        print("contractGuard.permitx Funds");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Funds")
    })

    // Funds permit => Engine
    // await contractGuard.permitx.sendTransaction(contractEngine.address, contractConvert.address).then(result => {
    //     print("contractGuard.permitx Convert");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractGuard.permitx Convert")
    // })

    // Store permit => Pool
    // await contractGuard.permitx.sendTransaction(contractConvert.address, contractPool.address).then(result => {
    //     print("contractGuard.permitx Pool Convert");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractGuard.permitx Pool Convert")
    // })

    // Store permit => Collateral
    // await contractGuard.permitx.sendTransaction(contractConvert.address, contractCollateral.address).then(result => {
    //     print("contractGuard.permitx Collateral Convert");
    //     printTx(result.tx);
    // }).catch(error => {
    //     perror("contractGuard.permitx Collateral Convert")
    // })

    // Engine permit => Protocol
    await contractGuard.permitx.sendTransaction(contractProtocol.address, contractEngine.address).then(result => {
        print("contractGuard.permitx Engine");
        printTx(result.tx);
    }).catch(error => {
        perror("contractGuard.permitx Engine")
    })

    // Protocol set Engine instance
    await contractProtocol.requestImplChange.sendTransaction(contractEngine.address).then(result => {
        print("contractProtocol.requestImplChange");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.requestImplChange")
    })

    await contractProtocol.confirmImplChange.sendTransaction().then(result => {
        print("contractProtocol.confirmImplChange");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.confirmImplChange")
    })

    //Set commission rate deposit ==> 0
    await contractSetting.setCommissionRate.sendTransaction(0, 0).then(result => {
        print("contractSetting.setCommissionRate");
        printTx(result.tx);
    }).catch(error => {
        perror("contractSetting.setCommissionRate")
    })

    //Set commission rate destroy ==> 0.001
    await contractSetting.setCommissionRate.sendTransaction(1, 10).then(result => {
        print("contractSetting.setCommissionRate");
        printTx(result.tx);
    }).catch(error => {
        perror("contractSetting.setCommissionRate")
    })

    //Set commission token ==> DF
    await contractSetting.setCommissionToken.sendTransaction(0, DF_Addr).then(result => {
        print("contractSetting.setCommissionToken");
        printTx(result.tx);
    }).catch(error => {
        perror("contractSetting.setCommissionToken")
    })

    //Set destroy usdx threshold ==> 0.01
    let th = new BN(Number(0.01 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    await contractSetting.setDestroyThreshold.sendTransaction(th).then(result => {
        print("contractSetting.setDestroyThreshold");
        printTx(result.tx);
    }).catch(error => {
        perror("contractSetting.setDestroyThreshold")
    })

    //Set DF medianizer
    await contractSetting.setCommissionMedian.sendTransaction(DF_Addr, contractMedianizer.address).then(result => {
        print("contractSetting.setCommissionMedian");
        printTx(result.tx);
    }).catch(error => {
        perror("contractSetting.setCommissionMedian")
    })

    // Medianizer
    await contractMedianizer.set.sendTransaction(contractPriceFeed.address).then(result => {
        print("MedianizerSetFeed.post");
        printTx(result.tx);
    }).catch(error => {
        perror("MedianizerSetFeed.post")
    })

    // PriceFeed
    let price = new BN(Number(2 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    await contractPriceFeed.post.sendTransaction(price, 2058870102, contractMedianizer.address).then(result => {
        print("contractPriceFeed.post");
        printTx(result.tx);
    }).catch(error => {
        perror("contractPriceFeed.post")
    })
};