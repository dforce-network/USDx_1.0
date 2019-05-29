/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */

const DSGuard = artifacts.require('DSGuard.sol');
const DFToken = artifacts.require('DFToken.sol');
const USDXToken = artifacts.require('USDXToken.sol');
const DFStore = artifacts.require('DFStore.sol');
const DFPool = artifacts.require('DFPool.sol');
const DFCollateral = artifacts.require('DFCollateral.sol');
const DFFunds = artifacts.require('DFFunds.sol');
const PriceFeed = artifacts.require('PriceFeed.sol');
const Medianizer = artifacts.require('Medianizer.sol');

const DFEngine = artifacts.require('DFEngine.sol');

const Collaterals = artifacts.require('Collaterals_t.sol');

const BN = require('bn.js');
const utils = require('./helpers/Utils');
const MathTool = require('./helpers/MathTool');
const DataMethod = require('./helpers/DataMethod');

// var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC', 'DAITEST', 'PAXTEST', 'TUSDTEST', 'USDCTEST');
var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');

// var weightTest = new Array(10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
// var weightTest = new Array(4, 3, 2, 1);
var weightTest = new Array(0.1, 0.3, 0.3, 0.3);

var runTypeArr = new Array('deposit', 'destroy', 'withdraw', 'claim', 'updateSection');
var runUpdateSection = 200;
var runDataList = [];
var runData = {};

contract('DFEngine', accounts => {
// type:'deposit', 'destroy', 'withdraw', 'updateSection', 'claim'
// tokenAddress 1~4
// accountAddress 1~20
// total true: 全部 false:参数无效
// times 执行次数，如果无此参数则按照data配置种类各执行一次。
// data 具体执行方式，如需插入随机模式可以，添加{}
// 各项配置如不填写，测采用随机模式执行
var runConfig = [ 
    //deposit-convert-section[1]-deposit-withdraw3-destroy2-claim-deposit-claim-withdraw6-destroy3
    // X£¨USDx:0.8£©
    // Y£¨USDx:4.2£©
    // Z£¨USDx:2.4£©
    // Q£¨USDx:2.4£©
    // W£¨USDx:0.6£©  
    {     
        'data':     
                [
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1.2,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':2.4,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':3.6,
                            },
                            {
                                'tokenAddress':4,
                                'accountAddress':4,
                                'amount':4.8,
                            },
                        ]
                    },
                //section[1]                
                    {
                        'type':'updateSection',
                        // 'times':100,
                        'data':[
                            {
                                'tokens':[1, 2],
                                'weight':[0.1, 0.3],
                            },
                        ]
                    },                
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':5,
                                'amount':0.6,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':1.3,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':0.01,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':1.19,
                            }
                        ]
                    }, 
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1   //ÌáÈ¡0.2 USDx
                            },
                            {
                            'accountAddress':2   //ÌáÈ¡2.4 USDx
                            },
                            {
                            'accountAddress':3   //ÌáÈ¡2.4 USDx
                            },
                            {
                            'accountAddress':4   //return ¿Õ»ò0
                            },
                            {
                            'accountAddress':5   //return ¿Õ»ò0
                            },
                        ]
                    },
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':1.9,
                            }
                        ]
                    },               
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1   //ÌáÈ¡0.6 USDx
                            },
                            {
                            'accountAddress':2   //return ¿Õ»ò0
                            },
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':0.5,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':0.1,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':0.4,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':0.11,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':0.01,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':0.09,
                            }
                        ]
                    }, 
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.81,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.79,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':4.3,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':4.19,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':2.41,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':2.39,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':2.41,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':2.39,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.61,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.59,
                            }
                        ]
                    },
                ],          
            },
    //deposit-convert-section[1]-deposit-withdraw3-destroy2-claim-deposit-claim-withdraw6-destroy3
    // X£¨USDx:1.8£©
    // Y£¨USDx:6.7£©
    // Z£¨USDx:2.4£©
    // Q£¨USDx:2.4£©
    // W£¨USDx:0.6£© 
    {
        'data':           
                [
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1.2,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':2.4,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':3.6,
                            },
                            {
                                'tokenAddress':4,
                                'accountAddress':4,
                                'amount':4.8,
                            },
                        ]
                    },
                //section[1]                
                    {
                        'type':'updateSection',
                        // 'times':100,
                        'data':[
                            {
                                'tokens':[1, 2],
                                'weight':[0.1, 0.3],
                            },
                        ]
                    },                
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':5,
                                'amount':0.6,
                            }
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':1.3,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':0.01,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':1.19,
                            }
                        ]
                    }, 
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':0.1,
                            }
                        ]
                    },
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1   //ÌáÈ¡0.2 USDx
                            },
                            {
                            'accountAddress':2   //ÌáÈ¡2.4 USDx
                            },
                            {
                            'accountAddress':3   //ÌáÈ¡2.4 USDx
                            },
                            {
                            'accountAddress':4   //return ¿Õ»ò0
                            },
                            {
                            'accountAddress':5   //return ¿Õ»ò0
                            },
                        ]
                    },
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':1.9,
                            }
                        ]
                    },               
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1   //ÌáÈ¡0.6 USDx
                            },
                            {
                            'accountAddress':2   //return ¿Õ»ò0
                            },
                        ]
                    },
                    //section[2]                
                    {
                        'type':'updateSection',
                        // 'times':100,
                        'data':[
                            {
                                'tokens':[1, 2, 3],
                                'weight':[0.1, 0.3, 0.3],
                            },
                        ]
                    }, 
                    {
                        'type':'deposit',
                        // 'times':100,
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':1.2,
                            },
                            {
                                'tokenAddress':2,
                                'accountAddress':2,
                                'amount':2.4,
                            },
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':3.6,
                            },
                        ]
                    },
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':0.1,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':1,
                                'accountAddress':1,
                                'amount':0.7,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':0.01,
                            }
                        ]
                    }, 
                    {
                        'type':'withdraw',
                        'data':[
                            {
                                'tokenAddress':3,
                                'accountAddress':3,
                                'amount':0.19,
                            }
                        ]
                    }, 
                    {
                        'type':'claim',
                        'data':[
                            {
                            'accountAddress':1   //ÌáÈ¡0.8 USDx
                            },
                            {
                            'accountAddress':2   //ÌáÈ¡2.5 USDx
                            },
                        ]
                    },               
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1.81,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':1,
                                'amount':1.79,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':6.8,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':2,
                                'amount':6.69,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':4.81,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':3,
                                'amount':4.79,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':2.41,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':4,
                                'amount':2.39,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.61,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.01,
                            }
                        ]
                    },
                    {
                        'type':'destroy',
                        'data':[
                            {
                                'accountAddress':5,
                                'amount':0.59,
                            }
                        ]
                    },
                ]
    }        
    ];
    
    
    
    for (let configIndex = 0; configIndex < runConfig.length; configIndex++) {
        
        {
            var dSGuard;
            var usdxToken;
            var dfToken;
            var dfStore;
            var dfCollateral;
            var dfPool;
            var dfFunds;
            var priceFeed;
            var medianizer;
            var dfEngine;

            var collateralAddress = [];
            var collateralObject = {};
            var collateralIndex;
            var tokenAddressList = [];
            var tokenWeightList = [];

            var transactionData = 0;
            var depositGasUsed = 0;
            var destroyGasUsed = 0;
            var withdrawGasUsed = 0;
            var claimGasUsed = 0;
            var updateGasUsed = 0;

            var depositGasData = [];
            var destroyGasData = [];
            var withdrawGasData = [];
            var claimGasData = [];
            var updateGasData = [];

            var recordToken = {};
            var recordLockToken = {};
            var recordAccountMap = {};
            var recordTokenTotal = new BN(0);
            var recordAccountTotalMap = {};

            var recordMintedPosition = new BN(0);
            var recordBurnedPosition = new BN(0);
            var recordMinted = {};
            var recordMintedTotal = new BN(0);
            var recordBurned = {};
            var recordBurnedTotal = new BN(0);

            var recordDfCollateralToken = {};

            var dfStoreTokenTotal = new BN(0);
            var dfStoreTokenBalance = {};
            var dfStoreLockTokenTotal = new BN(0);
            var dfStoreLockTokenBalance = {};
            var dfStoreAccountToken = {};
            var dfStoreAccountTokenTotal = new BN(0);

            var dfStoreAccountTokenOrigin = new BN(0);
            var dfStoreAccountTokenCurrent = new BN(0);

            var dfStoreAccountTokenTotalOrigin = new BN(0);
            var dfStoreAccountTokenTotalCurrent = new BN(0);

            var dfStoreTokenBalanceOrigin = new BN(0);
            var dfStoreTokenBalanceCurrent = new BN(0);

            var dfStoreLockTokenBalanceOrigin = new BN(0);
            var dfStoreLockTokenBalanceCurrent = new BN(0);

            var dfStoreLockTokenTotalOrigin = new BN(0);
            var dfStoreLockTokenTotalCurrent = new BN(0);

            var dfStoreMintPosition = new BN(0);
            var dfStoreMinted = new BN(0);
            var dfStoreMintedTotal = new BN(0);
            var dfStoreBurnPosition = new BN(0);
            var dfStoreBurn = new BN(0);
            var dfStoreBurnTotal = new BN(0);

            var dfStoreTokenAddress = [];
            var dfStoreTokenWeight = [];

            var dfPoolTokenTotal = new BN(0);
            var dfPoolTokenBalance = {};

            var dfPoolTokenBalanceOrigin = new BN(0);
            var dfPoolTokenBalanceCurrent = new BN(0);

            var dfPoolTokenTotalOrigin = new BN(0);
            var dfPoolTokenTotalCurrent = new BN(0);

            var dfCollateralTokenTotal = new BN(0);
            var dfCollateralToken = new BN(0);
            var dfCollateralTokenBalance = {};
            
            // var dfCollateralTokenBalanceOrigin = new BN(0);
            var dfCollateralTokenTotalOrigin = new BN(0);
            // var dfCollateralTokenBalanceCurrent = new BN(0);
            var dfCollateralTokenTotalCurrent = new BN(0);

            var usdxTotalSupply = new BN(0);
            var usdxBalance = new BN(0);
            var usdxBalanceOfDfPool = new BN(0);
            var usdxTotalSupplyOrigin = new BN(0);
            var usdxTotalSupplyCurrent = new BN(0);
            var usdxBalanceOrigin = new BN(0);
            var usdxBalanceCurrent = new BN(0);

            var dfnBalance = new BN(0);
            var dfnFee = new BN(Number(5 * 10 ** 18).toLocaleString().replace(/,/g,''));
            
            var accountTokenBalanceOrigin = new BN(0);
            var accountTokenBalanceCurrent = new BN(0);

            var burnedTotalOrigin = new BN(0);
            var burnedOrigin = new BN(0);
            var burnedTotalCurrent = new BN(0);
            var burnedCurrent = new BN(0);

            var balanceOfTokens = new BN(0);
        }

        it('Init the deploy contract', async () => {

            collateralAddress = [];
            collateralObject = {};
            collateralIndex = 0;

            for (let index = 0; index < collateralNames.length; index++) {
                var collaterals = await Collaterals.new(collateralNames[index],
                    collateralNames[index] + '1.0', accounts[accounts.length - 1]);

                var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                var accountsIndex = 1
                while (accountsIndex < (accounts.length - 1)) {
                    await collaterals.transfer(accounts[accountsIndex], amount);
                    accountsIndex++;
                }

                collateralAddress.push(collaterals.address);
                collateralObject[collaterals.address] = collaterals;
            }
            
            // tokenAddressList = DataMethod.createData(collateralAddress, 4, 4);
            // tokenWeightList = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
            tokenAddressList = collateralAddress;

            tokenWeightList = [];
            for (let index = 0; index < weightTest.length; index++)
                tokenWeightList[tokenWeightList.length] = new BN((weightTest[index] * 10 ** 18).toLocaleString().replace(/,/g, ''));
                
            // tokenWeightList = weightTest;

            console.log('\ntokenAddressList');
            console.log(tokenAddressList);

            console.log('\nweightTest');
            console.log(weightTest);
            console.log('\ntokenWeightList');
            console.log(tokenWeightList);
            dSGuard = await DSGuard.new();
            usdxToken = await USDXToken.new(accounts[0]);
            dfToken = await DFToken.new(accounts[0]);
            dfStore = await DFStore.new(tokenAddressList, tokenWeightList);
            dfCollateral = await DFCollateral.new();
            dfPool = await DFPool.new(dfCollateral.address);
            dfFunds = await DFFunds.new(dfToken.address);
            priceFeed = await PriceFeed.new();
            medianizer = await Medianizer.new();

            dfEngine = await DFEngine.new(
                usdxToken.address,
                // dfToken.address,
                dfStore.address,
                dfPool.address,
                dfCollateral.address,
                dfFunds.address,
                // medianizer.address
                );

            await usdxToken.setAuthority(dfEngine.address);
            await dfToken.setAuthority(dfEngine.address);
            await dfStore.setAuthority(dSGuard.address);
            await dfCollateral.setAuthority(dSGuard.address);
            await dfPool.setAuthority(dSGuard.address);
            await dfFunds.setAuthority(dSGuard.address);
            await dfEngine.setAuthority(dSGuard.address);
            
            await dSGuard.permitx(dfEngine.address, dfStore.address);
            await dSGuard.permitx(dfEngine.address, dfCollateral.address);
            await dSGuard.permitx(dfEngine.address, dfPool.address);
            await dSGuard.permitx(dfEngine.address, dfFunds.address);

            await dfEngine.setCommissionToken(0, dfToken.address);
            await dfEngine.setCommissionMedian(dfToken.address, medianizer.address);
            await dfEngine.setCommissionRate(0, 0);
            await dfEngine.setCommissionRate(1, 50);
            await medianizer.set(priceFeed.address);
            await priceFeed.post(new BN(Number(2 * 10 ** 18).toLocaleString().replace(/,/g, '')), 2058870102, medianizer.address);

            amount = Number(1000000 * 10 ** 18).toLocaleString().replace(/,/g,'');
            await dfToken.mint(accounts[0], amount);

            amount = Number(10000 * 10 ** 18).toLocaleString().replace(/,/g,'');
            for (let index = 1; index < accounts.length; index++) {
                await dfToken.transfer(accounts[index], amount);
                balance = await collaterals.balanceOf.call(accounts[index]);
                await dSGuard.permitx(accounts[index], dfEngine.address);
            }

            recordToken = {};
            recordLockToken = {};
            recordAccountMap = {};
            recordAccountTotalMap = {};
            recordTokenTotal = new BN(0);

            recordMintedPosition = new BN(0);
            recordBurnedPosition = new BN(0);
            recordMinted = {};
            recordMintedTotal = new BN(0);
            recordBurned = {};
            recordBurnedTotal = new BN(0);

            recordDfCollateralToken = {};

            depositGasUsed = 0;
            destroyGasUsed = 0;
            withdrawGasUsed = 0;
            updateGasUsed = 0;

            depositGasData = [];
            destroyGasData = [];
            withdrawGasData = [];
            updateGasData = [];
            
            console.log('DFEngine init finish:' + dfEngine.address);
        });
        
        it('Verify DFEngine Complex after construction', async () => {
        
            var runType;
            var configTimes = runConfig[configIndex].hasOwnProperty('times') ? runConfig[configIndex]['times'] : runConfig[configIndex]['data'].length;

            var dfEngineIndex = 0;
            
            dfEngineTimes = 0;
            while (dfEngineTimes < configTimes) {
                console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + '\n');

                // runType = MathTool.randomNum(0, runTypeMax);
                // if (runConfig[configIndex]['data'].hasOwnProperty('times')) {
                //     runConfig[configIndex][dfEngineTimes] = {};
                // }
               
                dfEngineIndex = dfEngineTimes % runConfig[configIndex]['data'].length;
                runType = runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('type') ? 
                    runConfig[configIndex]['data'][dfEngineIndex]['type'] : 
                    (dfEngineTimes > 0 && (dfEngineTimes % runUpdateSection) == 0  ? runTypeArr[runTypeArr.length - 1] : runTypeArr[MathTool.randomNum(0, runTypeArr.length - 2)]);

                var runTimes = 1;
                if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    runTimes = runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                }
                if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('times')){
                    runTimes = runConfig[configIndex]['data'][dfEngineIndex]['times'];
                }

                console.log('runType : ' + runType + ' runTimes : ' + runTimes + '\n');
                var conditionIndex = 0;
                var condition = 0;
                switch (true) {
                    case runType == 'deposit':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            tokenAddress = tokenAddressList[MathTool.randomNum(0, tokenAddressList.length - 1)];
                            accountAddress = accounts[MathTool.randomNum(0, accounts.length - 1)];
                            amount = MathTool.randomNum(10, 500);

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokenAddress')) {
            
                                    tokenAddress = collateralAddress[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokenAddress'] - 1];                        
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress'] - 1];
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                }
                            }
                            var amountNB = new BN(Number(amount * 10 ** 18).toLocaleString().replace(/,/g,''));
                            console.log('deposit token index : ' + (collateralAddress.indexOf(tokenAddress) + 1));
                            console.log('deposit token name : ' + await collateralObject[tokenAddress].name.call());
                            console.log('deposit token address : ' + tokenAddress);
                            console.log('deposit account index : ' + (accounts.indexOf(accountAddress) + 1));
                            console.log('deposit account address : ' + accountAddress);
                            console.log('\n');
                            console.log('deposit amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            accountTokenBalanceOrigin = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            await collateralObject[tokenAddress].approve(dfPool.address, amountNB, {from: accountAddress});
                            console.log(await collateralObject[tokenAddress].name.call() + ' belance:');
                            console.log(accountTokenBalanceOrigin);
                            console.log(accountTokenBalanceOrigin.toString());
                            console.log('\n');

                            // transactionData = await dfEngine.deposit(accountAddress, tokenAddress, amountNB, {from: accountAddress});
                            // depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                            // depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;
                            // console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');

                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            calcDepositorMintTotal = await dfEngine.calcDepositorMintTotal.call(accountAddress, tokenAddress, amountNB, {from: accountAddress});
                            runData = {};
                            runData['type'] = runType;
                            runData['tokenAddress'] = collateralAddress.indexOf(tokenAddress) + 1;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            runData['amount'] = amountNB.div(new BN(Number(10 ** 18).toLocaleString().replace(/,/g,''))).toString();
                            try {
                                transactionData = await dfEngine.deposit(accountAddress, tokenAddress, new BN(0), amountNB, {from: accountAddress});
                                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');
                            }
                            catch (error) {
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }

                            recordToken[tokenAddress] = recordToken.hasOwnProperty(tokenAddress) ? recordToken[tokenAddress].add(amountNB) : amountNB;
                            recordTokenTotal = recordTokenTotal.add(amountNB);

                            if(recordAccountMap[tokenAddress] == undefined)
                                recordAccountMap[tokenAddress] = {};

                            recordAccountMap[tokenAddress][accountAddress] = recordAccountMap[tokenAddress].hasOwnProperty(accountAddress) ? recordAccountMap[tokenAddress][accountAddress].add(amountNB) : amountNB;
                            recordAccountTotalMap[accountAddress] = recordAccountTotalMap.hasOwnProperty(accountAddress) ? recordAccountTotalMap[accountAddress].add(amountNB) : amountNB;

                            console.log('record: token belance:');
                            console.log(recordToken[tokenAddress]);
                            console.log(recordToken[tokenAddress].toString());
                            console.log('record: token total:');
                            console.log(recordTokenTotal);
                            console.log(recordTokenTotal.toString());
                            console.log('\n');
                            console.log('record: account tokens balance:');
                            console.log(recordAccountMap[tokenAddress][accountAddress]);
                            console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                            console.log('record: account total tokens :');
                            console.log(recordAccountTotalMap[accountAddress]);
                            console.log(recordAccountTotalMap[accountAddress].toString());
                            console.log('\n');

                            var times = new BN(-1);
                            var cw = new BN(0);
                            for (let index = 0; index < tokenWeightList.length; index++) {

                                // cw = new BN(Number(tokenWeightList[index] * 10 ** 18).toLocaleString().replace(/,/g,''));
                                cw = tokenWeightList[index];
                                if (!recordToken.hasOwnProperty(tokenAddressList[index])){
                                    times = new BN(0);
                                    continue;
                                }

                                times = times.eq(new BN(-1)) ? recordToken[tokenAddressList[index]].div(cw) : 
                                    (times.gt(recordToken[tokenAddressList[index]].div(cw)) ? recordToken[tokenAddressList[index]].div(cw) : times);
                            }
                            console.log('minted times');
                            console.log(times);
                            console.log('\n');

                            if (times.gt(new BN(0))){

                                console.log('--------------------record minted--------------------');
                                console.log('--------------------minting start--------------------\n');
                                var amountLock = new BN(0);
                                for (let index = 0; index < tokenWeightList.length; index++) {

                                    // amountLock = times.mul(new BN(Number(tokenWeightList[index] * 10 ** 18).toLocaleString().replace(/,/g,'')));
                                    amountLock = times.mul(tokenWeightList[index]);
                                    recordToken[tokenAddressList[index]] = recordToken[tokenAddressList[index]].sub(amountLock);
                                    recordLockToken[tokenAddressList[index]] = recordLockToken.hasOwnProperty(tokenAddressList[index]) ? 
                                        recordLockToken[tokenAddressList[index]].add(amountLock) : amountLock;

                                    recordDfCollateralToken[tokenAddressList[index]] = recordDfCollateralToken.hasOwnProperty([tokenAddressList[index]]) ?
                                        recordDfCollateralToken[tokenAddressList[index]].add(amountLock) : amountLock;

                                    recordMintedTotal = recordMintedTotal.add(amountLock);
                                    recordMinted[recordMintedPosition] = recordMinted.hasOwnProperty(recordMintedPosition) ? 
                                        recordMinted[recordMintedPosition].add(amountLock) : amountLock;

                                    console.log('--------------- token index : ' + index);
                                    console.log('token address : ' + tokenAddressList[index]);
                                    console.log('token weight : ' + tokenWeightList[index]);
                                    console.log('token weight : ' + tokenWeightList[index].toString());
                                    console.log('times' + times);
                                    console.log('minted amount ' + amountLock);
                                    console.log('\n');
                                    console.log('record: token belance:');
                                    console.log(recordToken[tokenAddressList[index]]);
                                    console.log(recordToken[tokenAddressList[index]].toString());
                                    console.log('record: lock token belance:');
                                    console.log(recordLockToken[tokenAddressList[index]]);
                                    console.log(recordLockToken[tokenAddressList[index]].toString());
                                    console.log('\n');
                                    console.log('record: token belance:');
                                    console.log(recordToken[tokenAddressList[index]]);
                                    console.log(recordToken[tokenAddressList[index]].toString());
                                    console.log('record: DfCollateral token belance:');
                                    console.log(recordDfCollateralToken[tokenAddressList[index]]);
                                    console.log(recordDfCollateralToken[tokenAddressList[index]].toString());
                                    console.log('\n');
                                    console.log('record: minting token total:');
                                    console.log(recordMintedTotal);
                                    console.log(recordMintedTotal.toString());
                                    console.log('record: minting position:');
                                    console.log(recordMintedPosition);
                                    console.log(recordMintedPosition.toString());
                                    console.log('record: minting token belance:');
                                    console.log(recordMinted[recordMintedPosition]);
                                    console.log(recordMinted[recordMintedPosition].toString());
                                    console.log('\n');
                                }
                                console.log('--------------------minting end--------------------\n');
                            }

                            console.log('record: minted token total:');
                            console.log(recordMintedTotal);
                            console.log(recordMintedTotal.toString());
                            console.log('record: minted position:');
                            console.log(recordMintedPosition);
                            console.log(recordMintedPosition.toString());
                            console.log('record: minted token belance:');
                            if (recordMinted.hasOwnProperty(recordMintedPosition)) {
                                console.log(recordMinted[recordMintedPosition]);
                                console.log(recordMinted[recordMintedPosition].toString());
                            }else
                                console.log('0');
                            
                            console.log('\n');
                            console.log('record: burned token total:');
                            console.log(recordBurnedTotal);
                            console.log(recordBurnedTotal.toString());
                            console.log('record: burned position:');
                            console.log(recordBurnedPosition);
                            console.log(recordBurnedPosition.toString());
                            console.log('record: burned token belance:');
                            if (recordBurned.hasOwnProperty(recordBurnedPosition)) {
                                console.log(recordBurned[recordBurnedPosition]);
                                console.log(recordBurned[recordBurnedPosition].toString());
                            }else
                                console.log('0');
                            
                            console.log('\n');

                            var amountMint = new BN(0);
                            console.log('--------------------record deposit claim--------------------');
                            console.log('--------------------claim start--------------------\n');
                            for (let index = 0; index < tokenAddressList.length; index++) {
                                
                                if (recordAccountMap.hasOwnProperty(tokenAddressList[index]) 
                                    && recordAccountMap[tokenAddressList[index]].hasOwnProperty(accountAddress)
                                    && recordLockToken.hasOwnProperty(tokenAddressList[index])
                                ) {
                                    amountMint = recordAccountMap[tokenAddressList[index]][accountAddress].lte(recordLockToken[tokenAddressList[index]]) ? 
                                        recordAccountMap[tokenAddressList[index]][accountAddress] : recordLockToken[tokenAddressList[index]];

                                    recordAccountMap[tokenAddressList[index]][accountAddress] = recordAccountMap[tokenAddressList[index]][accountAddress].sub(amountMint);
                                    recordLockToken[tokenAddressList[index]] = recordLockToken[tokenAddressList[index]].sub(amountMint);

                                    console.log('--------------- token index : ' + index);
                                    console.log('token address : ' + tokenAddressList[index]);
                                    console.log('[deposit claim] amount ' + amountMint);
                                    console.log('record: [deposit claim] lock token belance:');
                                    console.log(recordLockToken[tokenAddressList[index]]);
                                    console.log(recordLockToken[tokenAddressList[index]].toString());
                                    console.log('record: [deposit claim] account tokens balance:');
                                    console.log(recordAccountMap[tokenAddressList[index]][accountAddress]);
                                    console.log(recordAccountMap[tokenAddressList[index]][accountAddress].toString());
                                    console.log('\n');
                                }
                            }
                            console.log('--------------------claim end--------------------\n');

                            dfStoreTokenBalance = {};
                            dfStoreLockTokenBalance = {};
                            dfStoreTokenTotal = new BN(0);
                            dfStoreLockTokenTotal = new BN(0);
                            dfStoreAccountToken = {};
                            dfStoreAccountTokenTotal = new BN(0);
                            dfPoolTokenTotal = new BN(0);
                            dfCollateralTokenBalance = {};
                            dfCollateralTokenTotal = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                dfStoreTokenBalance[collateralAddress[index]] = await dfStore.getTokenBalance.call(collateralAddress[index]);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[collateralAddress[index]]);

                                dfStoreLockTokenBalance[collateralAddress[index]] = await dfStore.getResUSDXBalance.call(collateralAddress[index]);
                                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(dfStoreLockTokenBalance[collateralAddress[index]]);

                                dfStoreAccountToken[collateralAddress[index]] = await dfStore.getDepositorBalance.call(accountAddress, collateralAddress[index]);
                                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(dfStoreAccountToken[collateralAddress[index]]);

                                dfPoolTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                dfPoolTokenTotal = dfPoolTokenTotal.add(dfPoolTokenBalance[collateralAddress[index]]);

                                dfCollateralTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotal = dfCollateralTokenTotal.add(dfCollateralTokenBalance[collateralAddress[index]]);
                            }

                            console.log('dfStore token total:');
                            console.log(dfStoreTokenBalance);
                            console.log(dfStoreTokenTotal);
                            console.log(dfStoreTokenTotal.toString());
                            console.log('dfStore lock token total:');
                            console.log(dfStoreLockTokenBalance);
                            console.log(dfStoreLockTokenTotal);
                            console.log(dfStoreLockTokenTotal.toString());
                            console.log('dfStore account token total:');
                            console.log(dfStoreAccountToken);
                            console.log(dfStoreAccountTokenTotal);
                            console.log(dfStoreAccountTokenTotal.toString());
                            console.log('\n');
                            
                            console.log('dfPool token total:');
                            console.log(dfPoolTokenBalance);
                            console.log(dfPoolTokenTotal);
                            console.log(dfPoolTokenTotal.toString());
                            console.log('\n');
                            
                            console.log('dfCollateral token total:');
                            console.log(dfCollateralTokenBalance);
                            console.log(dfCollateralTokenTotal);
                            console.log(dfCollateralTokenTotal.toString());
                            console.log('\n');
                            
                            usdxTotalSupply = await usdxToken.totalSupply.call();
                            usdxBalance = await usdxToken.balanceOf.call(accountAddress);
                            usdxBalanceOfDfPool = await usdxToken.balanceOf.call(dfPool.address);

                            console.log('usdx total supply:');
                            console.log(usdxTotalSupply);
                            console.log(usdxTotalSupply.toString());
                            console.log('usdx account:');
                            console.log(usdxBalance);
                            console.log(usdxBalance.toString());
                            console.log('usdx dfPool:');
                            console.log(usdxBalanceOfDfPool);
                            console.log(usdxBalanceOfDfPool.toString());
                            console.log('\n');
                            
                            // assert.equal(usdxTotalSupply.toString(), recordTokenTotal.sub(dfStoreTokenTotal.add(dfStoreLockTokenTotal)).toString());
                            assert.equal(usdxTotalSupply.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());
                            assert.equal(usdxBalance.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotal.toString());
                            // assert.equal(dfStoreTokenTotal.add(dfStoreLockTokenTotal).toString(), dfPoolTokenTotal.toString());
                            assert.equal(dfStoreTokenTotal.toString(), dfPoolTokenTotal.toString());
                            assert.equal(usdxTotalSupply.toString(), dfCollateralTokenTotal.toString());
                            assert.equal(recordTokenTotal.toString(), dfCollateralTokenTotal.add(dfPoolTokenTotal).toString());

                            assert.equal(usdxBalance.sub(usdxBalanceOrigin).toString(), calcDepositorMintTotal.toString());
                            
                            for (let index = 0; index < collateralAddress.length; index++) {

                                assert.equal(
                                    dfStoreTokenBalance[collateralAddress[index]].toString(), 
                                    dfPoolTokenBalance[collateralAddress[index]].toString()
                                    );

                                if (recordLockToken.hasOwnProperty(collateralAddress[index])) {

                                    assert.equal(
                                        dfStoreLockTokenBalance[collateralAddress[index]].toString(), 
                                        recordLockToken[collateralAddress[index]].toString()
                                        );
                                }

                                if (recordToken.hasOwnProperty(collateralAddress[index])) {
                                    assert.equal(
                                        dfStoreTokenBalance[collateralAddress[index]].toString(), 
                                        recordToken[collateralAddress[index]].toString()
                                        );
                                }

                                if (recordAccountMap.hasOwnProperty(collateralAddress[index])
                                    && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)
                                ) {
                                    recordAccountMap[collateralAddress[index]][accountAddress]
                                    assert.equal(
                                        recordAccountMap[collateralAddress[index]][accountAddress].toString(), 
                                        dfStoreAccountToken[collateralAddress[index]].toString()
                                        );
                                }

                                if (recordDfCollateralToken.hasOwnProperty(collateralAddress[index])) {
                                    assert.equal(
                                        dfCollateralTokenBalance[collateralAddress[index]].toString(), 
                                        recordDfCollateralToken[collateralAddress[index]].toString()
                                        );
                                }
                                
                            }

                            dfStoreMintPosition = await dfStore.getMintPosition.call();
                            assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

                            dfStoreMintedTotal = await dfStore.getTotalMinted.call();
                            assert.equal(dfStoreMintedTotal.toString(), recordMintedTotal.toString());
                            assert.equal((dfStoreMintedTotal.sub(await dfStore.getTotalBurned.call())).toString(), usdxTotalSupply.toString());

                            dfStoreMinted = await dfStore.getSectionMinted.call(dfStoreMintPosition);
                            assert.equal(
                                dfStoreMinted.toString(), 
                                recordMinted.hasOwnProperty(recordMintedPosition) ? recordMinted[recordMintedPosition].toString() : '0');

                            assert.equal(
                                accountTokenBalanceOrigin.sub(amountNB).toString(),
                                (await collateralObject[tokenAddress].balanceOf.call(accountAddress)).toString());

                            condition++;
                        }
                        break;
                    case runType == 'destroy':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            accountAddress = accounts[MathTool.randomNum(0, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress'] - 1];
                                }
                            }

                            dfnBalance = await dfToken.balanceOf.call(accountAddress);
                            usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            console.log('dfn token balance:');
                            console.log(dfnBalance);
                            console.log(dfnBalance.toString());
                            console.log('usdx origin total supply:');
                            console.log(usdxTotalSupplyOrigin);
                            console.log(usdxTotalSupplyOrigin.toString());
                            console.log('usdx origin balance:');
                            console.log(usdxBalanceOrigin);
                            console.log(usdxBalanceOrigin.toString());
                            console.log('\n');
                            
                            amount = MathTool.randomNum(0, Number(usdxBalanceOrigin.mul(new BN(11)).div(new BN(10)).div(new BN(Number(10 ** 10).toLocaleString().replace(/,/g,'')))));
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                    amount = amount * 10 ** 8;
                                }
        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('total')
                                    && runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['total']
                                ) {
                                    amount = usdxBalanceOrigin;
                                }
                            }
                            var amountNB = typeof(amount) == 'number' ? new BN((amount * 10 ** 10).toLocaleString().replace(/,/g,'')) : amount;
                            console.log('destroy account index : ' + (accounts.indexOf(accountAddress) + 1));
                            console.log('destroy account address : ' + accountAddress);
                            console.log('create destroy random the amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');
                            
                            burnedTotalOrigin = await dfStore.getTotalBurned.call();
                            burnedOrigin = await dfStore.getSectionBurned.call(await dfStore.getBurnPosition.call());

                            dfCollateralTokenTotalOrigin = new BN(0);
                            dfCollateralTokenBalance = {};
                            for (let index = 0; index < collateralAddress.length; index++) {

                                dfCollateralTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(dfCollateralTokenBalance[collateralAddress[index]]);

                                if (recordDfCollateralToken.hasOwnProperty(collateralAddress[index])) 
                                    assert.equal(recordDfCollateralToken[collateralAddress[index]].toString(), dfCollateralTokenBalance[collateralAddress[index]].toString());
                            }
                            console.log('burned origin token total :');
                            console.log(burnedTotalOrigin);
                            console.log(burnedTotalOrigin.toString());
                            console.log('burned origin token:');
                            console.log(burnedOrigin);
                            console.log(burnedOrigin.toString());
                            console.log('DFCollateral origin token total:');
                            console.log(dfCollateralTokenBalance);
                            console.log(dfCollateralTokenTotalOrigin);
                            console.log(dfCollateralTokenTotalOrigin.toString());
                            console.log('\n');

                            assert.equal(recordBurnedTotal.toString(), burnedTotalOrigin.toString());
                            assert.equal(recordBurnedPosition.toString(), (await dfStore.getBurnPosition.call()).toString());
                            if (recordBurned.hasOwnProperty(recordBurnedPosition))
                                assert.equal(recordBurned[recordBurnedPosition].toString(), burnedOrigin.toString());

                            // await dfToken.approvex(dfEngine.address, {from: accountAddress});
                            await dfToken.approve(dfEngine.address, new BN(0), {from: accountAddress});
                            await dfToken.approve(dfEngine.address, amountNB.mul(new BN(5)).div(new BN(2000)), {from: accountAddress});
                            await usdxToken.approve(dfEngine.address, new BN(0), {from: accountAddress});
                            await usdxToken.approve(dfEngine.address, amountNB, {from: accountAddress});
                            // await usdxToken.approvex(dfEngine.address, {from: accountAddress});
                            var approvals = await usdxToken.allowance.call(accountAddress, dfEngine.address);
                            console.log('usdx approvals token :');
                            console.log(approvals);
                            console.log(approvals.toString());
                            console.log('\n');
                            var approvals = await dfToken.allowance.call(accountAddress, dfEngine.address);
                            console.log('dfn approvals token :');
                            console.log(approvals);
                            console.log(approvals.toString());
                            console.log('\n');

                            runData = {};
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            runData['amount'] = amountNB.div(new BN(Number(10 ** 18).toLocaleString().replace(/,/g,''))).toString();
                            try {
                                transactionData = await dfEngine.destroy(accountAddress, new BN(0), amountNB, {from: accountAddress});
                                destroyGasUsed = destroyGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : destroyGasUsed;
                                destroyGasData[destroyGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');
                            }
                            catch (error) {
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }
                            
                            assert.equal((await usdxToken.allowance.call(accountAddress, dfEngine.address)).toString(), '0');
                            assert.equal((await dfToken.allowance.call(accountAddress, dfEngine.address)).toString(), '0');

                            var burnedTokens = [];
                            var burnedWeight = [];
                            var sumWeight = new BN(0);
                            var amountBurned = new BN(0);
                            var amountTemp = amountNB;
                            console.log('--------------------record destroy burned--------------------');
                            console.log('--------------------burned start--------------------\n');
                            while (amountTemp.gt(new BN(0))) {

                                burnedTokens = [];
                                burnedWeight = [];
                                burnedTokens = await dfStore.getSectionToken.call(recordBurnedPosition);
                                burnedWeight = await dfStore.getSectionWeight.call(recordBurnedPosition);

                                if (!recordBurned.hasOwnProperty(recordBurnedPosition))
                                    recordBurned[recordBurnedPosition] = new BN(0);

                                if (!recordMinted.hasOwnProperty(recordBurnedPosition))
                                    recordMinted[recordBurnedPosition] = new BN(0);
                                
                                if ((amountTemp.add(recordBurned[recordBurnedPosition])).lte(recordMinted[recordBurnedPosition])) {
                                    
                                    amountBurned = amountTemp;
                                    recordBurned[recordBurnedPosition] = recordBurned.hasOwnProperty(recordBurnedPosition) ? 
                                    recordBurned[recordBurnedPosition].add(amountBurned) : amountBurned;
                                    amountTemp = new BN(0);
                                }else{

                                    amountBurned = recordMinted[recordBurnedPosition].sub(recordBurned[recordBurnedPosition]);
                                    recordBurned[recordBurnedPosition] = recordBurned.hasOwnProperty(recordBurnedPosition) ? 
                                    recordBurned[recordBurnedPosition].add(amountBurned) : amountBurned;
                                    amountTemp = amountTemp.sub(amountBurned);
                                    recordBurnedPosition = recordBurnedPosition.add(new BN(1));
                                }

                                if (!recordBurned.hasOwnProperty(recordBurnedPosition))
                                    recordBurned[recordBurnedPosition] = new BN(0);

                                if (!recordMinted.hasOwnProperty(recordBurnedPosition))
                                    recordMinted[recordBurnedPosition] = new BN(0);

                                console.log('--------------- burned position : ' + recordBurnedPosition.toString());
                                console.log('burned amountNB : ' + amountNB.toString());
                                console.log('burned amountTemp : ' + amountTemp.toString());
                                console.log('burned amountBurned : ' + amountBurned.toString());
                                console.log('record: bured position:');
                                console.log(recordBurnedPosition);
                                console.log(recordBurnedPosition.toString());
                                console.log('record: bured position amount:');
                                console.log(recordBurned[recordBurnedPosition]);
                                console.log(recordBurned[recordBurnedPosition].toString());
                                console.log('\n');
                                
                                sumWeight = new BN(0);
                                for (let index = 0; index < burnedWeight.length; index++)
                                    sumWeight = sumWeight.add(burnedWeight[index]);

                                for (let index = 0; index < burnedTokens.length; index++){

                                    // assert.equal(
                                    //     (await collateralObject[burnedTokens[index]].balanceOf.call(dfCollateral.address)).toString(),
                                    //     dfCollateralTokenBalance[burnedTokens[index]].sub(amountBurned.mul(burnedWeight[index]).div(sumWeight)).toString()
                                    // );
                                    
                                    if (recordDfCollateralToken.hasOwnProperty(burnedTokens[index])) {
                                        recordDfCollateralToken[burnedTokens[index]] = recordDfCollateralToken[burnedTokens[index]].sub(
                                            amountBurned.mul(burnedWeight[index]).div(sumWeight)
                                        );
                                    }else
                                        recordDfCollateralToken[burnedTokens[index]] = new BN(0);

                                    console.log('---------- token index : ' + index);
                                    console.log('token address : ' + burnedTokens[index]);
                                    console.log('record: DfCollateral token belance:');
                                    console.log(recordDfCollateralToken[burnedTokens[index]]);
                                    console.log(recordDfCollateralToken[burnedTokens[index]].toString());
                                    console.log('\n');
                                }
                            }
                            console.log('--------------------burned end--------------------\n');
                            recordBurnedTotal = recordBurnedTotal.add(amountNB);
                            console.log('record: bured total amount:');
                            console.log(recordBurnedTotal);
                            console.log(recordBurnedTotal.toString());

                            burnedTotalCurrent = await dfStore.getTotalBurned.call();
                            burnedCurrent = await dfStore.getSectionBurned.call(await dfStore.getBurnPosition.call());

                            dfCollateralTokenTotalCurrent = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                balanceOfTokens = await collateralObject[collateralAddress[index]].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(balanceOfTokens);

                                if (recordDfCollateralToken.hasOwnProperty(collateralAddress[index])) 
                                    assert.equal(recordDfCollateralToken[collateralAddress[index]].toString(), balanceOfTokens.toString());
                            }
                            console.log('current burned token total :');
                            console.log(burnedTotalCurrent);
                            console.log(burnedTotalCurrent.toString());
                            console.log('current burned token:');
                            console.log(burnedCurrent);
                            console.log(burnedCurrent.toString());
                            console.log('current DFCollateral token total:');
                            console.log(dfCollateralTokenTotalCurrent);
                            console.log(dfCollateralTokenTotalCurrent.toString());
                            console.log('\n');

                            assert.equal(recordBurnedTotal.toString(), burnedTotalCurrent.toString());
                            assert.equal(burnedTotalOrigin.toString(), (burnedTotalCurrent.sub(amountNB)).toString());
                            assert.equal(recordBurnedPosition.toString(), (await dfStore.getBurnPosition.call()).toString());
                            if (recordBurned.hasOwnProperty(recordBurnedPosition))
                                assert.equal(recordBurned[recordBurnedPosition].toString(), burnedCurrent.toString());
                                                    
                            dfStoreTokenTotal = new BN(0);
                            dfStoreLockTokenTotal = new BN(0);
                            dfStoreAccountTokenTotal = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                balanceOfTokens = await dfStore.getTokenBalance.call(collateralAddress[index]);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(balanceOfTokens);

                                balanceOfTokens = await dfStore.getResUSDXBalance.call(collateralAddress[index]);
                                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(balanceOfTokens);

                                balanceOfTokens = await dfStore.getDepositorBalance.call(accountAddress, collateralAddress[index]);
                                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(balanceOfTokens);                
                            }

                            console.log('dfStore token total:');
                            console.log(dfStoreTokenTotal);
                            console.log(dfStoreTokenTotal.toString());
                            console.log('dfStore lock token total:');
                            console.log(dfStoreLockTokenTotal);
                            console.log(dfStoreLockTokenTotal.toString());
                            console.log('dfStore account token total:');
                            console.log(dfStoreAccountTokenTotal);
                            console.log(dfStoreAccountTokenTotal.toString());
                            console.log('\n');
                            
                            usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
                            usdxBalanceCurrent = await usdxToken.balanceOf.call(accountAddress);
                            usdxBalanceOfDfPool = await usdxToken.balanceOf.call(dfPool.address);

                            console.log('usdx current total supply:');
                            console.log(usdxTotalSupplyCurrent);
                            console.log(usdxTotalSupplyCurrent.toString());
                            console.log('usdx current balance:');
                            console.log(usdxBalanceCurrent);
                            console.log(usdxBalanceCurrent.toString());
                            console.log('usdx dfPool:');
                            console.log(usdxBalanceOfDfPool);
                            console.log(usdxBalanceOfDfPool.toString());
                            console.log('\n');
                            
                            assert.equal(usdxTotalSupplyOrigin.toString(), dfCollateralTokenTotalOrigin.toString());
                            assert.equal(usdxTotalSupplyCurrent.toString(), dfCollateralTokenTotalCurrent.toString());

                            assert.equal(burnedTotalCurrent.sub(burnedTotalOrigin).toString(), amountNB.toString());
                            // assert.equal(burnedCurrent.sub(burnedOrigin).toString(), amountNB.toString());
                            assert.equal(dfCollateralTokenTotalOrigin.sub(dfCollateralTokenTotalCurrent).toString(), amountNB.toString());
                            assert.equal(usdxTotalSupplyOrigin.sub(usdxTotalSupplyCurrent).toString(), amountNB.toString());
                            assert.equal(usdxBalanceOrigin.sub(usdxBalanceCurrent).toString(), amountNB.toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotal.toString());

                            if((recordTokenTotal.sub(amountNB)).gte(new BN(0))){
                                
                                console.log('record origin token total:');
                                console.log(recordTokenTotal);
                                console.log(recordTokenTotal.toString());
                                
                                recordTokenTotal = recordTokenTotal.sub(amountNB);
                                console.log('record current token total:');
                                console.log(recordTokenTotal);
                                console.log(recordTokenTotal.toString());
                                console.log('\n');
                                
                                assert.equal(usdxTotalSupplyCurrent.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());

                            }else{

                                console.log('error record token total:');
                                console.log(recordTokenTotal);
                                console.log(recordTokenTotal.toString());
                                console.log('amountNB value:');
                                console.log(amountNB);
                                console.log(amountNB.toString());
                                console.log('recordTokenTotal not enough calculations !!!\n');

                            }

                            if((recordAccountTotalMap[accountAddress].sub(amountNB)).gte(new BN(0))){
                                
                                console.log('record origin account total token:');
                                console.log(recordAccountTotalMap[accountAddress]);
                                console.log(recordAccountTotalMap[accountAddress].toString());
                                
                                recordAccountTotalMap[accountAddress] = recordAccountTotalMap[accountAddress].sub(amountNB);
                                console.log('record current account total token:');
                                console.log(recordAccountTotalMap[accountAddress]);
                                console.log(recordAccountTotalMap[accountAddress].toString());
                                console.log('\n');

                                assert.equal(usdxBalanceCurrent.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());

                            }else{

                                console.log('error record account total token:');
                                console.log(recordAccountTotalMap[accountAddress]);
                                console.log(recordAccountTotalMap[accountAddress].toString());
                                console.log('amountNB value:');
                                console.log(amountNB);
                                console.log(amountNB.toString());
                                console.log('recordAccountTotalMap[' + accountAddress + '] not enough calculations !!!\n');

                            }
                            condition++;
                        }
                        break;
                    case runType == 'withdraw':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            tokenAddress = collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)];
                            accountAddress = accounts[MathTool.randomNum(0, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokenAddress')) {
            
                                    tokenAddress = collateralAddress[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokenAddress'] - 1];                        
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress'] - 1];
                                }
                            }

                            amount = MathTool.randomNum(0, Number(dfStoreAccountTokenOrigin.mul(new BN(11)).div(new BN(10))));
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                    amount = amount * 10 ** 18;
                                }
        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('total')
                                    && runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['total']
                                ) {
                                    amount = dfStoreAccountTokenOrigin;
                                }
                            }
                            var amountNB = typeof(amount) == 'number' ? new BN(amount.toLocaleString().replace(/,/g,'')) : amount;
                            console.log('withdraw token name : ' + await collateralObject[tokenAddress].name.call());
                            console.log('withdraw token address : ' + tokenAddress);
                            console.log('withdraw account index : ' + (accounts.indexOf(accountAddress) + 1));
                            console.log('withdraw account address : ' + accountAddress);
                            console.log('\n');
                            console.log('create withdraw random the amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');
                            
                            dfStoreTokenBalanceOrigin = await dfStore.getTokenBalance.call(tokenAddress);
                            dfStoreLockTokenBalanceOrigin = await dfStore.getResUSDXBalance.call(tokenAddress);
                            dfStoreAccountTokenOrigin = await dfStore.getDepositorBalance.call(accountAddress, tokenAddress);
                            console.log('dfStore origin token total:');
                            console.log(dfStoreTokenBalanceOrigin);
                            console.log(dfStoreTokenBalanceOrigin.toString());
                            console.log('dfStore origin Lock token otal:');
                            console.log(dfStoreLockTokenBalanceOrigin);
                            console.log(dfStoreLockTokenBalanceOrigin.toString());
                            console.log('dfStore origin account token total:');
                            console.log(dfStoreAccountTokenOrigin);
                            console.log(dfStoreAccountTokenOrigin.toString());
                            console.log('\n');
                            if (recordToken.hasOwnProperty(tokenAddress))
                                assert.equal(dfStoreTokenBalanceOrigin.toString(), recordToken[tokenAddress].toString());
                                
                            if (recordLockToken.hasOwnProperty(tokenAddress))
                                assert.equal(dfStoreLockTokenBalanceOrigin.toString(), recordLockToken[tokenAddress].toString());
                            
                            if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
                                assert.equal(dfStoreAccountTokenOrigin.toString(), recordAccountMap[tokenAddress][accountAddress].toString());
                            
                            dfPoolTokenBalanceOrigin = await collateralObject[tokenAddress].balanceOf.call(dfPool.address);
                            accountTokenBalanceOrigin = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            console.log('dfPool origin token balance:');
                            console.log(dfPoolTokenBalanceOrigin);
                            console.log(dfPoolTokenBalanceOrigin.toString());
                            console.log('account origin token balance:');
                            console.log(accountTokenBalanceOrigin);
                            console.log(accountTokenBalanceOrigin.toString());
                            console.log('\n');
                            
                            // if(amountNB.lte(new BN(0))){
                            //     console.log('withdraw random the amount is zero !!!\n');
                            //     condition++;
                            //     continue;
                            // }

                            runData = {};
                            runData['type'] = runType;
                            runData['tokenAddress'] = collateralAddress.indexOf(tokenAddress) + 1;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            runData['amount'] = amountNB.div(new BN(Number(10 ** 18).toLocaleString().replace(/,/g,''))).toString();
                            try {
                                transactionData = await dfEngine.withdraw(accountAddress, tokenAddress, new BN(0), amountNB, {from: accountAddress});
                                withdrawGasUsed = withdrawGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : withdrawGasUsed;
                                withdrawGasData[withdrawGasData.length] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');
                            }
                            catch (error) {
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }

                            amountMin = new BN(0);
                            if (recordAccountMap.hasOwnProperty(tokenAddress) 
                                    && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress)
                                    && recordToken.hasOwnProperty(tokenAddress)
                                )
                            {
                                amountMin = recordAccountMap[tokenAddress][accountAddress].lt(recordToken[tokenAddress]) ?
                                    recordAccountMap[tokenAddress][accountAddress] : recordToken[tokenAddress];
                            }
                            
                            // amountNB = amountMin.lt(amountNB) ? amountMin : amountNB;
                            amountMin = amountMin.lt(amountNB) ? amountMin : amountNB;

                            console.log('withdraw Real the amount');
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            console.log('withdraw Real the amount Min');
                            console.log(amountMin);
                            console.log(amountMin.toString());
                            console.log('\n');

                            console.log('record origin token :');
                            if (recordToken.hasOwnProperty(tokenAddress)){
                                console.log(recordToken[tokenAddress]);
                                console.log(recordToken[tokenAddress].toString());
                                recordToken[tokenAddress] = recordToken[tokenAddress].sub(amountMin);
                                console.log('record current token :');
                                console.log(recordToken[tokenAddress]);
                                console.log(recordToken[tokenAddress].toString());
                            }else{
                                console.log(new BN(0));
                                console.log('record current token :');
                                console.log(new BN(0));
                            }
                            console.log('\n');

                            console.log('record origin token total:');
                            console.log(recordTokenTotal);
                            console.log(recordTokenTotal.toString());
                            recordTokenTotal = recordTokenTotal.sub(amountMin);
                            console.log('record current token total:');
                            console.log(recordTokenTotal);
                            console.log(recordTokenTotal.toString());
                            console.log('\n');

                            console.log('record origin account token:');
                            if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress)){
                                console.log(recordAccountMap[tokenAddress][accountAddress]);
                                console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                                recordAccountMap[tokenAddress][accountAddress] = recordAccountMap[tokenAddress][accountAddress].sub(amountMin);
                                console.log('record current account token:');
                                console.log(recordAccountMap[tokenAddress][accountAddress]);
                                console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                            }else{
                                console.log(new BN(0));
                                console.log('record current account token:');
                                console.log(new BN(0));
                            }
                            console.log('\n');

                            console.log('record origin account total token:');
                            if (recordAccountTotalMap.hasOwnProperty(accountAddress)){
                                console.log(recordAccountTotalMap[accountAddress]);
                                console.log(recordAccountTotalMap[accountAddress].toString());
                                recordAccountTotalMap[accountAddress] = recordAccountTotalMap[accountAddress].sub(amountMin);
                                console.log('record current account total token:');
                                console.log(recordAccountTotalMap[accountAddress]);
                                console.log(recordAccountTotalMap[accountAddress].toString());
                            }else{
                                console.log(new BN(0));
                                console.log('record current account total token:');
                                console.log(new BN(0));
                            }
                            console.log('\n');

                            dfStoreTokenBalanceCurrent = await dfStore.getTokenBalance.call(tokenAddress);
                            dfStoreLockTokenBalanceCurrent = await dfStore.getResUSDXBalance.call(tokenAddress);
                            dfStoreAccountTokenCurrent = await dfStore.getDepositorBalance.call(accountAddress, tokenAddress);
                            dfPoolTokenBalanceCurrent = await collateralObject[tokenAddress].balanceOf.call(dfPool.address);
                            accountTokenBalanceCurrent = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            dfCollateralToken = await collateralObject[tokenAddress].balanceOf.call(dfCollateral.address);
                            usdxBalance = await usdxToken.balanceOf.call(accountAddress);

                            console.log('dfStore current token total:');
                            console.log(dfStoreTokenBalanceCurrent);
                            console.log(dfStoreTokenBalanceCurrent.toString());
                            console.log('dfStore current token Lock total:');
                            console.log(dfStoreLockTokenBalanceCurrent);
                            console.log(dfStoreLockTokenBalanceCurrent.toString());
                            console.log('dfStore current token account total:');
                            console.log(dfStoreAccountTokenCurrent);
                            console.log(dfStoreAccountTokenCurrent.toString());
                            console.log('\n');
                            console.log('dfPool current token balance:');
                            console.log(dfPoolTokenBalanceCurrent);
                            console.log(dfPoolTokenBalanceCurrent.toString());
                            console.log('collateral current account token balance:');
                            console.log(accountTokenBalanceCurrent);
                            console.log(accountTokenBalanceCurrent.toString());
                            console.log('\n');
                            console.log('dfCollateral current token balance:');
                            console.log(dfCollateralToken);
                            console.log(dfCollateralToken.toString());
                            console.log('usdx current token balance:');
                            console.log(usdxBalance);
                            console.log(usdxBalance.toString());
                            console.log('\n');

                            assert.equal(dfStoreTokenBalanceCurrent.toString(), recordToken[tokenAddress].toString());

                            if (recordLockToken.hasOwnProperty(tokenAddress))
                                assert.equal(dfStoreLockTokenBalanceCurrent.toString(), recordLockToken[tokenAddress].toString());

                            if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
                                assert.equal(dfStoreAccountTokenCurrent.toString(), recordAccountMap[tokenAddress][accountAddress].toString());
                            
                            assert.equal(dfStoreTokenBalanceOrigin.toString(), dfPoolTokenBalanceOrigin.toString());
                            assert.equal(dfStoreTokenBalanceCurrent.toString(), dfPoolTokenBalanceCurrent.toString());
                            assert.equal(dfStoreTokenBalanceCurrent.toString(), dfStoreTokenBalanceOrigin.sub(amountMin).toString());
                            assert.equal(dfPoolTokenBalanceCurrent.toString(), dfPoolTokenBalanceOrigin.sub(amountMin).toString());

                            assert.equal(dfStoreAccountTokenOrigin.toString(), dfStoreAccountTokenCurrent.add(amountMin).toString());
                            assert.equal(accountTokenBalanceOrigin.toString(), accountTokenBalanceCurrent.sub(amountMin).toString());

                            condition++;
                        }
                        break;
                    case runType == 'claim':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            accountAddress = accounts[MathTool.randomNum(0, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress'] - 1];
                                }
                            }

                            // dfStoreTokenBalance = {};
                            dfStoreLockTokenBalance = {};
                            // dfStoreTokenTotal = new BN(0);
                            dfStoreLockTokenTotalOrigin = new BN(0);
                            dfStoreAccountToken = {};
                            dfStoreAccountTokenTotalOrigin = new BN(0);
                            dfPoolTokenBalance = {};
                            dfPoolTokenTotalOrigin = new BN(0);
                            dfCollateralTokenBalance = {};
                            dfCollateralTokenTotalOrigin = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                // dfStoreTokenBalance[collateralAddress[index]] = await dfStore.getTokenBalance.call(collateralAddress[index]);
                                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[collateralAddress[index]]);

                                dfStoreLockTokenBalance[collateralAddress[index]] = await dfStore.getResUSDXBalance.call(collateralAddress[index]);
                                if (recordLockToken.hasOwnProperty(collateralAddress[index]))
                                    assert.equal(dfStoreLockTokenBalance[collateralAddress[index]].toString(), recordLockToken[collateralAddress[index]].toString());
                                dfStoreLockTokenTotalOrigin = dfStoreLockTokenTotalOrigin.add(dfStoreLockTokenBalance[collateralAddress[index]]);

                                dfStoreAccountToken[collateralAddress[index]] = await dfStore.getDepositorBalance.call(accountAddress, collateralAddress[index]);
                                if (recordAccountMap.hasOwnProperty(collateralAddress[index]) && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress))
                                    assert.equal(dfStoreAccountToken[collateralAddress[index]].toString(), recordAccountMap[collateralAddress[index]][accountAddress].toString());
                                dfStoreAccountTokenTotalOrigin = dfStoreAccountTokenTotalOrigin.add(dfStoreAccountToken[collateralAddress[index]]);

                                dfPoolTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                dfPoolTokenTotalOrigin = dfPoolTokenTotalOrigin.add(dfPoolTokenBalance[collateralAddress[index]]);

                                dfCollateralTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(dfCollateralTokenBalance[collateralAddress[index]]);
                            }

                            usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            usdxBalanceOfDfPool = await usdxToken.balanceOf.call(dfPool.address);
                            calcMaxClaimAmount = await dfEngine.calcMaxClaimAmount.call(accountAddress);
                            
                            console.log('dfStore origin lock token total:');
                            console.log(dfStoreLockTokenBalance);
                            console.log(dfStoreLockTokenTotalOrigin);
                            console.log(dfStoreLockTokenTotalOrigin.toString());
                            console.log('dfStore origin account token total:');
                            console.log(dfStoreAccountToken);
                            console.log(dfStoreAccountTokenTotalOrigin);
                            console.log(dfStoreAccountTokenTotalOrigin.toString());
                            console.log('\n');
                            console.log('dfPool origin token total:');
                            console.log(dfPoolTokenBalance);
                            console.log(dfPoolTokenTotalOrigin);
                            console.log(dfPoolTokenTotalOrigin.toString());
                            console.log('dfCollateral origin token total:');
                            console.log(dfCollateralTokenBalance);
                            console.log(dfCollateralTokenTotalOrigin);
                            console.log(dfCollateralTokenTotalOrigin.toString());
                            console.log('\n');
                            console.log('usdx origin total supply:');
                            console.log(usdxTotalSupplyOrigin);
                            console.log(usdxTotalSupplyOrigin.toString());
                            console.log('usdx origin balance:');
                            console.log(usdxBalanceOrigin);
                            console.log(usdxBalanceOrigin.toString());
                            console.log('usdx dfPool:');
                            console.log(usdxBalanceOfDfPool);
                            console.log(usdxBalanceOfDfPool.toString());
                            console.log('\n');
                            
                            runData = {};
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            try {
                                // transactionData = await dfEngine.withdraw(accountAddress, usdxToken.address, amountNB, {from: accountAddress});
                                transactionData = await dfEngine.claim(accountAddress, new BN(0), {from: accountAddress});
                                claimGasUsed = claimGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : claimGasUsed;
                                claimGasData[claimGasData.length] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');
                            }
                            catch (error) {
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }
    
                            var amountNB = dfStoreAccountTokenTotalOrigin.lt(dfStoreLockTokenTotalOrigin) ? dfStoreAccountTokenTotalOrigin : dfStoreLockTokenTotalOrigin;
                            console.log('claim account index : ' + (accounts.indexOf(accountAddress) + 1));
                            console.log('claim account address : ' + accountAddress);
                            console.log('\n');
                            console.log('create claim the amount');
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            amountMin = new BN(0);
                            amountMinTotal = new BN(0);
                            console.log('--------------------record [claim] claim--------------------');
                            console.log('--------------------claim start--------------------\n');
                            for (let index = 0; index < collateralAddress.length; index++) {
                                amountMin = new BN(0);
                                if (recordAccountMap.hasOwnProperty(collateralAddress[index]) 
                                    && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)
                                    && recordLockToken.hasOwnProperty(collateralAddress[index])
                                )
                                {
                                    amountMin = recordAccountMap[collateralAddress[index]][accountAddress].lt(recordLockToken[collateralAddress[index]]) ?
                                        recordAccountMap[collateralAddress[index]][accountAddress] : recordLockToken[collateralAddress[index]];

                                    recordLockToken[collateralAddress[index]] = recordLockToken[collateralAddress[index]].sub(amountMin);
                                    recordAccountMap[collateralAddress[index]][accountAddress] = recordAccountMap[collateralAddress[index]][accountAddress].sub(amountMin);
                                }else{

                                    if (!recordLockToken.hasOwnProperty(collateralAddress[index]))
                                        recordLockToken[collateralAddress[index]] = new BN(0);

                                    if (!recordAccountMap.hasOwnProperty(collateralAddress[index])){
                                        recordAccountMap[collateralAddress[index]] = {};
                                        recordAccountMap[collateralAddress[index]][accountAddress] = new BN(0);
                                    }else if (!recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)) {
                                        recordAccountMap[collateralAddress[index]][accountAddress] = new BN(0);
                                    }    
                                }

                                assert.equal(
                                    dfStoreLockTokenBalance[collateralAddress[index]].sub(amountMin).toString(),
                                    (await dfStore.getResUSDXBalance.call(collateralAddress[index])).toString()
                                );

                                assert.equal(
                                    dfStoreAccountToken[collateralAddress[index]].sub(amountMin).toString(),
                                    (await dfStore.getDepositorBalance.call(accountAddress, collateralAddress[index])).toString()
                                );

                                amountMinTotal = amountMinTotal.add(amountMin);

                                console.log('--------------- token index : ' + index);
                                console.log('token address : ' + collateralAddress[index]);
                                console.log('[claim claim] amount ' + amountMin);
                                console.log('record: [claim claim] lock token belance:');
                                console.log(recordLockToken[collateralAddress[index]]);
                                console.log(recordLockToken[collateralAddress[index]].toString());
                                console.log('record: [claim claim] account tokens balance:');
                                console.log(recordAccountMap[collateralAddress[index]][accountAddress]);
                                console.log(recordAccountMap[collateralAddress[index]][accountAddress].toString());
                                console.log('\n');
                            }
                            console.log('--------------------record [claim] claim end--------------------\n');

                            amountNB = amountMinTotal.lt(amountNB) ? amountMinTotal : amountNB;
                            console.log('claim Real the amount');
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            assert.equal(recordMintedTotal.toString(), (await dfStore.getTotalMinted.call()).toString());
                            if (recordMinted.hasOwnProperty(recordMintedPosition))
                                assert.equal(recordMinted[recordMintedPosition].toString(), (await dfStore.getSectionMinted.call(await dfStore.getMintPosition.call())).toString());
                            else
                                assert.equal('0', (await dfStore.getSectionMinted.call(await dfStore.getMintPosition.call())).toString());
                            // dfStoreTokenBalance = {};
                            dfStoreLockTokenBalance = {};
                            // dfStoreTokenTotal = new BN(0);
                            dfStoreLockTokenTotalCurrent = new BN(0);
                            dfStoreAccountToken = {};
                            dfStoreAccountTokenTotalCurrent = new BN(0);
                            dfPoolTokenTotalCurrent = new BN(0);
                            dfCollateralTokenBalance = {};
                            dfCollateralTokenTotalCurrent = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                // dfStoreTokenBalance[collateralAddress[index]] = await dfStore.getTokenBalance.call(collateralAddress[index]);
                                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[collateralAddress[index]]);

                                dfStoreLockTokenBalance[collateralAddress[index]] = await dfStore.getResUSDXBalance.call(collateralAddress[index]);
                                if (recordLockToken.hasOwnProperty(collateralAddress[index]))
                                    assert.equal(dfStoreLockTokenBalance[collateralAddress[index]].toString(), recordLockToken[collateralAddress[index]].toString());
                                dfStoreLockTokenTotalCurrent = dfStoreLockTokenTotalCurrent.add(dfStoreLockTokenBalance[collateralAddress[index]]);

                                dfStoreAccountToken[collateralAddress[index]] = await dfStore.getDepositorBalance.call(accountAddress, collateralAddress[index]);
                                if (recordAccountMap.hasOwnProperty(collateralAddress[index]) && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress))
                                    assert.equal(dfStoreAccountToken[collateralAddress[index]].toString(), recordAccountMap[collateralAddress[index]][accountAddress].toString());
                                dfStoreAccountTokenTotalCurrent = dfStoreAccountTokenTotalCurrent.add(dfStoreAccountToken[collateralAddress[index]]);

                                dfPoolTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                dfPoolTokenTotalCurrent = dfPoolTokenTotalCurrent.add(dfPoolTokenBalance[collateralAddress[index]]);

                                dfCollateralTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(dfCollateralTokenBalance[collateralAddress[index]]);
                            }

                            console.log('dfStore current lock token total:');
                            console.log(dfStoreLockTokenBalance);
                            console.log(dfStoreLockTokenTotalCurrent);
                            console.log(dfStoreLockTokenTotalCurrent.toString());
                            console.log('dfStore current account token total:');
                            console.log(dfStoreAccountToken);
                            console.log(dfStoreAccountTokenTotalCurrent);
                            console.log(dfStoreAccountTokenTotalCurrent.toString());
                            console.log('\n');
                            console.log('dfPool current token total:');
                            console.log(dfPoolTokenBalance);
                            console.log(dfPoolTokenTotalCurrent);
                            console.log(dfPoolTokenTotalCurrent.toString());
                            console.log('dfCollateral current token total:');
                            console.log(dfCollateralTokenBalance);
                            console.log(dfCollateralTokenTotalCurrent);
                            console.log(dfCollateralTokenTotalCurrent.toString());
                            console.log('\n');

                            assert.equal(dfStoreLockTokenTotalCurrent.toString(), dfStoreLockTokenTotalOrigin.sub(amountNB).toString());
                            assert.equal(dfStoreAccountTokenTotalCurrent.toString(), dfStoreAccountTokenTotalOrigin.sub(amountNB).toString());
                            assert.equal(dfPoolTokenTotalCurrent.toString(), dfPoolTokenTotalOrigin.toString());
                            assert.equal(dfCollateralTokenTotalCurrent.toString(), dfCollateralTokenTotalOrigin.toString());

                            usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
                            usdxBalanceCurrent = await usdxToken.balanceOf.call(accountAddress);
                            console.log('usdx current total supply:');
                            console.log(usdxTotalSupplyCurrent);
                            console.log(usdxTotalSupplyCurrent.toString());
                            console.log('usdx current balance:');
                            console.log(usdxBalanceCurrent);
                            console.log(usdxBalanceCurrent.toString());
                            console.log('usdx dfPool:');
                            console.log(usdxBalanceOfDfPool);
                            console.log(usdxBalanceOfDfPool.toString());
                            console.log('\n');

                            assert.equal(usdxTotalSupplyCurrent.toString(), usdxTotalSupplyOrigin.toString());
                            assert.equal(usdxBalanceCurrent.toString(), usdxBalanceOrigin.add(amountNB).toString());

                            assert.equal(usdxBalanceCurrent.toString(), usdxBalanceOrigin.add(calcMaxClaimAmount).toString());
                            
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotalOrigin.toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotalCurrent.add(amountNB).toString());
                            
                            assert.equal((await usdxToken.balanceOf.call(dfPool.address)).toString(), dfStoreLockTokenTotalOrigin.sub(amountNB).toString());
                            assert.equal((await usdxToken.balanceOf.call(dfPool.address)).toString(), dfStoreLockTokenTotalCurrent.toString());

                            condition++;
                        }
                        break;
                    case runType == 'updateSection':
                        while (condition < runTimes){
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            // for (let index = 0; index < tokenAddressList.length; index++) {

                            //     if (recordToken.hasOwnProperty(tokenAddressList[index]) && recordLockToken.hasOwnProperty(tokenAddressList[index])) {

                            //         recordToken[tokenAddressList[index]] = recordToken[tokenAddressList[index]].add(recordLockToken[tokenAddressList[index]]);
                            //         recordLockToken[tokenAddressList[index]] = new BN(0);
                            //     }
                            // }

                            tokenAddressIndex = [];
                            tokenWeightListNew = [];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokens')) {

                                    tokenAddressIndex = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokens'];
                                }

                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('weight')) {

                                    tokenWeightListNew = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['weight'];
                                }

                                tokenAddressList = [];
                                var collateralAddressLength = collateralAddress.length;
                                for (let index = 0; index < tokenAddressIndex.length; index++) {
                                    
                                    if (tokenAddressIndex[index] == 0 || tokenAddressIndex[index] > collateralAddressLength) {

                                        var nameIndex = MathTool.randomNum(0, collateralNames.length - 1);
                                        var collaterals = await Collaterals.new(collateralNames[nameIndex] + collateralIndex,
                                            collateralNames[nameIndex] + collateralIndex + '1.0', accounts[accounts.length - 1]);
        
                                        var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                                        var accountsIndex = 1
                                        while (accountsIndex < (accounts.length - 1)) {
                                            await collaterals.transfer(accounts[accountsIndex], amount);
                                            accountsIndex++;
                                        }
        
                                        collateralAddress.push(collaterals.address);
                                        collateralObject[collaterals.address] = collaterals;
                                        tokenAddressList.push(collaterals.address);
                                        collateralIndex++;
                                        
                                    }else{

                                        tokenAddressList.push(collateralAddress[tokenAddressIndex[index] - 1]);
                                    }
                                }
                                
                                if (tokenWeightListNew.length == 0) {

                                    tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
                                }
                                
                            }else{

                                tokenAddressList = [];
                                tokenAddressList = DataMethod.createData(collateralAddress, 3, 3);
                                collateralIndex++;

                                var nameIndex = MathTool.randomNum(0, collateralNames.length - 1)

                                var collaterals = await Collaterals.new(collateralNames[nameIndex] + collateralIndex,
                                    collateralNames[nameIndex] + collateralIndex + '1.0', accounts[accounts.length - 1]);

                                var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                                var accountsIndex = 1
                                while (accountsIndex < (accounts.length - 1)) {
                                    await collaterals.transfer(accounts[accountsIndex], amount);
                                    accountsIndex++;
                                }

                                collateralAddress.push(collaterals.address);
                                collateralObject[collaterals.address] = collaterals;
                                tokenAddressList.push(collaterals.address);

                                // tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
                                tokenWeightListNew = weightTest;

                            }

                            console.log(tokenAddressIndex);
                            console.log(tokenWeightListNew);

                            console.log('collateralAddress:');
                            console.log(collateralAddress);
                            console.log('\n');
                            console.log('tokenAddressList:');
                            console.log(tokenAddressList);
                            console.log('\n');
                            tokenWeightList = [];
                            for (let index = 0; index < tokenWeightListNew.length; index++) {
                                tokenWeightList.push(new BN((tokenWeightListNew[index] * 10 ** 18).toLocaleString().replace(/,/g, '')));
                                
                            }
                            console.log('input : tokenWeightList:');
                            console.log(tokenWeightList);
                            console.log('\n');

                            runData = {};
                            runData['type'] = runType;
                            try {
                                transactionData = await dfEngine.updateMintSection(tokenAddressList, tokenWeightList);
                                updateGasUsed = updateGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : updateGasUsed;
                                
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');                            
                            }
                            catch (error) {
                                
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }
                            
                            recordMintedPosition = recordMintedPosition.add(new BN(1));
                            dfStoreMintPosition = await dfStore.getMintPosition.call();
                            console.log('record Minted Position :');
                            console.log(recordMintedPosition);
                            console.log(recordMintedPosition.toString());
                            console.log('dfStore mintPosition :');
                            console.log(dfStoreMintPosition);
                            console.log(dfStoreMintPosition.toString());
                            console.log('\n');
                            assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());
                            
                            dfStoreTokenAddress = await dfStore.getSectionToken.call(dfStoreMintPosition);
                            console.log('dfStore collateral address :');
                            console.log(dfStoreTokenAddress);
                            console.log('\n');

                            dfStoreTokenWeight = await dfStore.getSectionWeight.call(dfStoreMintPosition);
                            console.log('dfStore tokens weight :');
                            console.log(dfStoreTokenWeight);
                            console.log('\n');
                            
                            for (let index = 0; index < dfStoreTokenAddress.length; index++) {
                                assert.equal(dfStoreTokenAddress[index], tokenAddressList[index]);
                                assert.equal(dfStoreTokenWeight[index].toString(), tokenWeightList[index].toString());
                            }

                            for (let index = 0; index < collateralAddress.length; index++) {

                                assert.equal(
                                    (await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address)).toString(),
                                    (await dfStore.getTokenBalance.call(collateralAddress[index])).toString()
                                );
                                if(recordToken.hasOwnProperty(collateralAddress[index]))
                                    assert.equal(recordToken[collateralAddress[index]].toString(), (await dfStore.getTokenBalance.call(collateralAddress[index])).toString());

                                if(recordLockToken.hasOwnProperty(collateralAddress[index]))
                                    assert.equal(recordLockToken[collateralAddress[index]].toString(), (await dfStore.getResUSDXBalance.call(collateralAddress[index])).toString());

                                assert.equal(await dfStore.getMintedToken.call(collateralAddress[index]), true);
                                if (dfStoreTokenAddress.indexOf(collateralAddress[index]) >= 0)
                                    assert.equal(await dfStore.getMintingToken.call(collateralAddress[index]), true);
                                else
                                    assert.equal(await dfStore.getMintingToken.call(collateralAddress[index]), false);
                            }
                            condition++;
                        }
                        break;
                }

                dfEngineTimes++;            
            }

            console.log('deposit max gasUsed:' + depositGasUsed);
            console.log('destroy max gasUsed:' + destroyGasUsed);
            console.log('withdraw max gasUsed:' + withdrawGasUsed);
            console.log('claim max gasUsed:' + claimGasUsed);
            console.log('update max gasUsed:' + updateGasUsed);
            console.log('\ndeposit gas data:');
            console.log(depositGasData);
            console.log('\ndestroy gas data:');
            console.log(destroyGasData);
            console.log('\nwithdraw gas data:');
            console.log(withdrawGasData);
            console.log('\nclaim gas data:');
            console.log(claimGasData);

            if (configIndex == runConfig.length - 1) {

                console.log(JSON.stringify(runConfig));
                console.log(JSON.stringify(runDataList));
                
            }

            
        });
    }

});


