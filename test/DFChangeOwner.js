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
var weightTest = new Array(10, 30, 30, 30);

var runTypeArr = new Array('deposit', 'destroy', 'withdraw', 'claim', 'updateSection');
var runUpdateSection = 20;
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
    {
        // 'times':150, 
        'data':[
            {
                'type':'deposit',
                // 'times':100,
                'data':[
                    {
                        'tokenAddress':1,
                        'accountAddress':1,
                        'amount':11,
                    },
                    {
                        'tokenAddress':2,
                        'accountAddress':1,
                        'amount':31,
                    },
                    {
                        'tokenAddress':3,
                        'accountAddress':1,
                        'amount':31,
                    },
                    {
                        'tokenAddress':4,
                        'accountAddress':2,
                        'amount':31,
                    },
                    {
                        'tokenAddress':2,
                        'accountAddress':2,
                        'amount':10,
                    },
                    {
                        'tokenAddress':3,
                        'accountAddress':2,
                        'amount':10,
                    },
                    {
                        'tokenAddress':4,
                        'accountAddress':2,
                        'amount':3,
                    },
                    {
                        'tokenAddress':4,
                        'accountAddress':4,
                        'amount':28,
                    },
                ]
            },
            // {
            //     'type':'claim',
            //     'data':[
            //         // {
            //         // 'accountAddress':1
            //         // },
            //         {
            //             'accountAddress':2
            //             },
            //             {
            //                 'accountAddress':3
            //                 },
            //                 {
            //                     'accountAddress':4
            //                     },
            //     ]
            // },
            // {
            //     'type':'withdraw',
            //     'data':[
            //         {
            //             'tokenAddress':3,
            //             'accountAddress':1,
            //             'amount':13,
            //         }
            //     ]
            // }
        ],      
    },
      
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
        
            owberAddress = await dfEngine.owner.call();
            runData = {};
            runData['type'] = 'change owner';
            runData['owner address'] = owberAddress;
            runData['new owner address'] = accounts[1];
            try {
                transactionData = await dfEngine.transferOwnership(accounts[1], {from: accounts[1]});
                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;
                runData['other']['gasUsed'] = transactionData.receipt.gasUsed;
                runData['other']['result'] = 'success';
                // runDataList[runDataList.length] = runData;
                console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
            }
            catch (error) {
                runData['other']['result'] = 'fail';
                runData['other']['error'] = error.message;
                // runDataList[runDataList.length] = runData;
                console.log(error.message + '\n');
                condition++;
                continue;
            }

            try {
                transactionData = await dfEngine.transferOwnership(accounts[1], {from: owberAddress});
                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;
                runData['owner']['gasUsed'] = transactionData.receipt.gasUsed;
                runData['owner']['result'] = 'success';
                // runDataList[runDataList.length] = runData;
                console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
            }
            catch (error) {
                runData['owner']['result'] = 'fail';
                runData['owner']['error'] = error.message;
                // runDataList[runDataList.length] = runData;
                console.log(error.message + '\n');
                condition++;
                continue;
            }
            try {
                transactionData = await dfEngine.acceptOwnership({from: accounts[1]});
                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;
                runData['accept']['gasUsed'] = transactionData.receipt.gasUsed;
                runData['accept']['result'] = 'success';
                // runDataList[runDataList.length] = runData;
                console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
            }
            catch (error) {
                runData['accept']['result'] = 'fail';
                runData['accept']['error'] = error.message;
                // runDataList[runDataList.length] = runData;
                console.log(error.message + '\n');
                condition++;
                continue;
            }

            try {
                transactionData = await dfEngine.transferOwnership(accounts[1], {from: accounts[1]});
                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;
                runData['old']['gasUsed'] = transactionData.receipt.gasUsed;
                runData['old']['result'] = 'success';
                runDataList[runDataList.length] = runData;
                console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
            }
            catch (error) {
                runData['old']['result'] = 'fail';
                runData['old']['error'] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + '\n');
                condition++;
                continue;
            }
            
            console.log(JSON.stringify(runDataList));
        });
    }

});


