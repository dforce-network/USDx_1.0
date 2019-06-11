const BN = require('bn.js');

// const Funds = artifacts.require('DFFunds.sol');
const Protocol = artifacts.require('DFProtocol.sol');
// const Store = artifacts.require('DFStore.sol');
const Pool = artifacts.require('DFPool.sol');
// const Collateral = artifacts.require('DFCollateral.sol');
const Engine = artifacts.require('DFEngine.sol');
// const Guard = artifacts.require('DSGuard.sol');
// const PriceFeed = artifacts.require('PriceFeed.sol');
// const Medianizer = artifacts.require('Medianizer.sol');
const USDx = artifacts.require('USDXToken.sol');
// const DF = artifacts.require('DFToken.sol');
const DF_Addr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

module.exports = async function (deployer, network, accounts) {

    if (network == 'development')
        return;

    // let contractFunds = await Funds.deployed();
    let contractProtocol = await Protocol.deployed();
    let contractPool = await Pool.deployed();
    // let contractStore = await Store.deployed();
    // let contractCollateral = await Collateral.deployed();
    let contarctEngine = await Engine.deployed();
    // let contractGuard = await Guard.deployed();
    // let contractPriceFeed = await PriceFeed.deployed();
    // let contractMedianizer = await Medianizer.deployed();
    let contractUSDx = await USDx.deployed();

    let erc20ABI = [{
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [{
          "name": "",
          "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "spender",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "from",
            "type": "address"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{
          "name": "",
          "type": "uint8"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
          "name": "owner",
          "type": "address"
        }],
        "name": "balanceOf",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [{
          "name": "",
          "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [{
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [{
          "name": "",
          "type": "bool"
        }],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [{
            "name": "owner",
            "type": "address"
          },
          {
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [{
          "name": "",
          "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{
            "name": "_name",
            "type": "string"
          },
          {
            "name": "_symbol",
            "type": "string"
          },
          {
            "name": "guy",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      }
    ];
    
    const daiAddr = "0xf494e07dfdbce883bf699cedf818fde2fa432db4";
    const paxAddr = "0x561b11000e95ac053eccec5bcefdc37e16c2491b";
    const tusdAddr = "0x25470030aa105bca679752e5c5e482c295de2b68";
    const usdcAddr = "0xbc34e50f589e389c507e0213501114bd2e70b1d7";

    let contractDAI = web3.eth.contract(erc20ABI).at(daiAddr);
    let contractPAX = web3.eth.contract(erc20ABI).at(paxAddr);
    let contractTUSD = web3.eth.contract(erc20ABI).at(tusdAddr);
    let contractUSDC = web3.eth.contract(erc20ABI).at(usdcAddr);

    let contractDF = web3.eth.contract(erc20ABI).at(DF_Addr);

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

    let amount = new BN(Number(10 ** 28).toLocaleString().replace(/,/g, ''));

    await contractDAI.approve.sendTransaction(contractPool.address, amount).then(result => {
        print("contractDAI.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractDAI.approve")
    })

    await contractPAX.approve.sendTransaction(contractPool.address, amount).then(result => {
        print("contractPAX.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractPAX.approve")
    })

    await contractTUSD.approve.sendTransaction(contractPool.address, amount).then(result => {
        print("contractTUSD.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractTUSD.approve")
    })

    await contractUSDC.approve.sendTransaction(contractPool.address, amount).then(result => {
        print("contractUSDC.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractUSDC.approve")
    })

    await contractDF.approve.sendTransaction(contarctEngine.address, amount).then(result => {
        print("contractDF.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractDF.approve")
    })

    await contractUSDx.approve.sendTransaction(contarctEngine.address, amount).then(result => {
        print("contractUSDx.approve");
        printTx(result.tx);
    }).catch(error => {
        perror("contractUSDx.approve")
    })

    let daiW = new BN(Number(0.01 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    let paxW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    let tusdW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));
    let usdcW = new BN(Number(0.03 * 10 ** 18).toLocaleString().replace(/,/g, ''));

    await contractProtocol.deposit.sendTransaction(daiAddr, new BN(0), daiW.mul(new BN(100))).then(result => {
        print("contractProtocol.deposit");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.deposit")
    })

    await contractProtocol.deposit.sendTransaction(paxAddr, new BN(0), paxW.mul(new BN(200))).then(result => {
        print("contractProtocol.deposit");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.deposit")
    })

    await contractProtocol.deposit.sendTransaction(tusdAddr, new BN(0), tusdW.mul(new BN(150))).then(result => {
        print("contractProtocol.deposit");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.deposit")
    })

    await contractProtocol.deposit.sendTransaction(usdcAddr, new BN(0), usdcW.mul(new BN(100))).then(result => {
        print("contractProtocol.deposit");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.deposit")
    })

    await contractProtocol.withdraw.sendTransaction(tusdAddr, new BN(0), tusdW.mul(new BN(100))).then(result => {
        print("contractProtocol.withdraw");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.withdraw")
    })

    await contractProtocol.claim.sendTransaction(new BN(0)).then(result => {
        print("contractProtocol.claim");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.claim")
    })

    await contractProtocol.destroy.sendTransaction(new BN(0), daiW.mul(new BN(100))).then(result => {
        print("contractProtocol.destroy");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.destroy")
    })

    await contractProtocol.oneClickMinting.sendTransaction(new BN(0), daiW.mul(new BN(10000))).then(result => {
        print("contractProtocol.oneClickMinting");
        printTx(result.tx);
    }).catch(error => {
        perror("contractProtocol.oneClickMinting")
    })
};