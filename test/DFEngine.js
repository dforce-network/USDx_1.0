/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */

const DSGuard = artifacts.require('DSGuard.sol');
// const DFToken = artifacts.require('DSToken.sol');
const DSToken = artifacts.require('DSToken.sol');
const DFStore = artifacts.require('DFStore.sol');
const DFPool = artifacts.require('DFPool.sol');
const DFCollateral = artifacts.require('DFCollateral.sol');
const DFFunds = artifacts.require('DFFunds.sol');
const PriceFeed = artifacts.require('PriceFeed.sol');
const Medianizer = artifacts.require('Medianizer.sol');

// const DFConvert = artifacts.require('DFConvert.sol');
const DFEngine = artifacts.require('DFEngine.sol');
const DFSetting = artifacts.require('DFSetting.sol');
const DFProtocol = artifacts.require('DFProtocol.sol');
const DFProtocolView = artifacts.require('DFProtocolView.sol');

const Collaterals = artifacts.require('Collaterals_t.sol');
const DSWrappedToken = artifacts.require('DSWrappedToken.sol');

const BN = require('bn.js');
const utils = require('./helpers/Utils');
const MathTool = require('./helpers/MathTool');
const DataMethod = require('./helpers/DataMethod');

// var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC', 'DAITEST', 'PAXTEST', 'TUSDTEST', 'USDCTEST');
// var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');

// var weightTest = new Array(10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
// var weightTest = new Array(4, 3, 2, 1);
// var weightTest = new Array(10, 30, 30, 30);
var gasPrice = 10 ** 10;
var runTypeArr = new Array('deposit', 'destroy', 'withdraw', 'claim', 'claimAmount', 'oneClickMinting', 'updateSection', 'changeEngine', 'setMinBurnAmount');
var runUpdateSection = 20;
var updateSectionIndex = 6;
var runDataList = [];
var runData = {};

contract('DFEngine', accounts => {

    console.log('filename : ' + __filename);
    if (typeof(runConfig) == "undefined")
        return;
    
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
            // var dfConvert;
            var dfEngine;
            var dfSetting;
            var dfProtocol;
            var dfProtocolView;
            var owner;

            var xCollateralAddress = [];
            var xCollateralObject = {};
            var xCollateralIndex;
            var xTokenAddressList = [];
            var xTokenDecimalsList = [];

            var collateralAddress = [];
            var collateralDecimals = [];
            var collateralObject = {};
            var collateralIndex;
            var tokenAddressList = [];
            var tokenWeightList = [];

            var transactionData = 0;
            var depositGasUsed = 0;
            var destroyGasUsed = 0;
            var withdrawGasUsed = 0;
            var claimGasUsed = 0;
            var claimAmountGasUsed = 0;
            var oneClickMintingGasUsed = 0;
            var updateGasUsed = 0;

            var depositGasData = [];
            var destroyGasData = [];
            var withdrawGasData = [];
            var claimGasData = [];
            var claimAmountGasData = [];
            var oneClickMintingGasData = [];
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

            var dfStoreTotalCol = new BN(0);
            var dfStoreTotalColOrigin = new BN(0);
            var dfStoreTotalColCurrent = new BN(0);

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

            var dfPoolSrcTokenTotal = new BN(0);
            var dfPoolSrcTokenBalance = {};

            var dfPoolTokenBalanceOrigin = new BN(0);
            var dfPoolTokenBalanceCurrent = new BN(0);
            
            var dfPoolTokenTotalOrigin = new BN(0);
            var dfPoolTokenTotalCurrent = new BN(0);

            var dfPoolSrcTokenTotalOrigin = new BN(0);
            var dfPoolSrcTokenTotalCurrent = new BN(0);

            var dfCollateralTokenTotal = new BN(0);
            var dfCollateralToken = new BN(0);
            var dfCollateralTokenBalance = {};
            
            // var dfCollateralTokenBalanceOrigin = new BN(0);
            var dfCollateralTokenTotalOrigin = new BN(0);
            // var dfCollateralTokenBalanceCurrent = new BN(0);
            var dfCollateralTokenTotalCurrent = new BN(0);

            var dfProtocolMintingSection = {};

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

            var accountTokenBalanceMapOrigin = {};
            var accountTokenBalanceMapCurrent = {};

            var accountTokenTotalOrigin = new BN(0);
            var accountTokenTotalCurrent = new BN(0);

            var burnedTotalOrigin = new BN(0);
            var burnedOrigin = new BN(0);
            var burnedTotalCurrent = new BN(0);
            var burnedCurrent = new BN(0);

            var minBurnAmount = new BN(0);

            var balanceOfTokens = new BN(0);
            var balanceOfSrcTokens = new BN(0);

            var dfColMaxClaim = {};
            var dfWithdrawBalances = {};
            var dfTokenBalance = new BN(0);
            var dfAccountToken = new BN(0);
        }

        it('Init the deploy contract', async () => {

            xCollateralAddress = [];
            xCollateralObject = {};
            xCollateralIndex = 0;

            collateralAddress = [];
            collateralObject = {};
            collateralIndex = 0;
            collateralDecimals = [];

            var decimals = 0;
            for (let index = 0; index < collateralNames.length; index++) {
                decimals = MathTool.randomNum(6, 22);
                var collaterals = await Collaterals.new(
                    collateralNames[index],
                    collateralNames[index] + '1.0', 
                    accounts[accounts.length - 1],
                    decimals
                    );

                var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                var accountsIndex = 1
                while (accountsIndex < (accounts.length - 1)) {
                    await collaterals.transfer(accounts[accountsIndex], amount);
                    accountsIndex++;
                }

                collateralAddress.push(collaterals.address);
                collateralObject[collaterals.address] = collaterals;
                collateralDecimals.push(decimals);

                var wrappedToken = await DSWrappedToken.new(
                    collaterals.address,
                    decimals,
                    'x' + collateralNames[index]
                    );

                xCollateralAddress.push(wrappedToken.address);
                xCollateralObject[wrappedToken.address] = wrappedToken;
                xTokenDecimalsList.push(decimals);
            }
            
            // tokenAddressList = DataMethod.createData(collateralAddress, 4, 4);
            // tokenWeightList = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
            xTokenAddressList = xCollateralAddress;
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
            usdxToken = await DSToken.new('0x555344780000000000000000000000');
            dfToken = await DSToken.new('0x444600000000000000000000000000');
            // dfStore = await DFStore.new(tokenAddressList, xTokenAddressList, tokenWeightList);
            dfStore = await DFStore.new(xTokenAddressList, tokenWeightList);
            dfCollateral = await DFCollateral.new();
            dfPool = await DFPool.new(dfCollateral.address);
            dfFunds = await DFFunds.new();
            priceFeed = await PriceFeed.new();
            medianizer = await Medianizer.new();
            
            // dfConvert = await DFConvert.new(
            //     usdxToken.address,
            //     dfStore.address,
            //     dfPool.address,
            //     dfCollateral.address,
            //     );
                
            dfEngine = await DFEngine.new(
                usdxToken.address,
                dfStore.address,
                dfPool.address,
                dfCollateral.address,
                dfFunds.address,
                // dfConvert.address
                );
            dfSetting = await DFSetting.new(dfStore.address);

            dfProtocol = await DFProtocol.new();
            dfProtocolView = await DFProtocolView.new(dfStore.address, dfCollateral.address);

            for (let index = 0; index < xCollateralAddress.length; index++){

                await xCollateralObject[xCollateralAddress[index]].setAuthority(dfEngine.address);
                await dfPool.approveToEngine(xCollateralAddress[index], dfEngine.address);
                await dfCollateral.approveToEngine(xCollateralAddress[index], dfEngine.address);

            }
                
            await usdxToken.setAuthority(dfEngine.address);
            await dfToken.setAuthority(dfEngine.address);
            await dfStore.setAuthority(dSGuard.address);
            await dfCollateral.setAuthority(dSGuard.address);
            await dfPool.setAuthority(dSGuard.address);
            await dfFunds.setAuthority(dSGuard.address);
            // await dfConvert.setAuthority(dSGuard.address);
            await dfEngine.setAuthority(dSGuard.address);
            await dfSetting.setAuthority(dSGuard.address);
            
            // await dSGuard.permitx(dfConvert.address, dfStore.address);
            // await dSGuard.permitx(dfConvert.address, dfCollateral.address);
            // await dSGuard.permitx(dfConvert.address, dfPool.address);

            await dSGuard.permitx(dfEngine.address, dfStore.address);
            await dSGuard.permitx(dfEngine.address, dfCollateral.address);
            await dSGuard.permitx(dfEngine.address, dfPool.address);
            await dSGuard.permitx(dfEngine.address, dfFunds.address);
            // await dSGuard.permitx(dfEngine.address, dfConvert.address);

            await dSGuard.permitx(dfSetting.address, dfStore.address);
            await dSGuard.permitx(dfProtocol.address, dfEngine.address);

            await dfSetting.setCommissionToken(0, dfToken.address);
            await dfSetting.setCommissionMedian(dfToken.address, medianizer.address);
            await dfSetting.setCommissionRate(0, 0);
            await dfSetting.setCommissionRate(1, 50);
            await medianizer.set(priceFeed.address);
            await priceFeed.post(new BN(Number(2 * 10 ** 18).toLocaleString().replace(/,/g, '')), 2058870102, medianizer.address);

            await dfProtocol.requestImplChange(dfEngine.address);
            await dfProtocol.confirmImplChange();

            amount = Number(1000000 * 10 ** 18).toLocaleString().replace(/,/g,'');
            await dfToken.mint(accounts[0], amount);

            amount = Number(10000 * 10 ** 18).toLocaleString().replace(/,/g,'');
            for (let index = 1; index < accounts.length; index++) {
                await dfToken.transfer(accounts[index], amount);
                // balance = await dfToken.balanceOf.call(accounts[index]);
                // await dSGuard.permitx(accounts[index], dfEngine.address);
            }

            owner = accounts[0];

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

            // depositGasUsed = 0;
            // destroyGasUsed = 0;
            // withdrawGasUsed = 0;
            // claimGasUsed = 0;
            // claimAmountGasUsed = 0;
            // oneClickMintingGasUsed = 0;
            // updateGasUsed = 0;

            // depositGasData = [];
            // destroyGasData = [];
            // withdrawGasData = [];
            // claimGasData = [];
            // claimAmountGasData = [];
            // oneClickMintingGasData = [];
            // updateGasData = [];
            
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
                    (dfEngineTimes > 0 && (dfEngineTimes % runUpdateSection) == 0  ? runTypeArr[updateSectionIndex] : runTypeArr[MathTool.randomNum(0, updateSectionIndex - 1)]);

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
                            accountAddress = accounts[MathTool.randomNum(1, accounts.length - 1)];
                            amount = MathTool.randomNum(10, 500);

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokenAddress')) {
            
                                    tokenAddress = collateralAddress[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokenAddress'] - 1];                        
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress']];
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                }
                            }
                            var tokenDecimals = collateralDecimals[collateralAddress.indexOf(tokenAddress)];
                            var xTokenAddress = await dfStore.getWrappedToken.call(tokenAddress); 
                            assert.equal(xTokenAddress, xCollateralAddress[collateralAddress.indexOf(tokenAddress)]);
                            assert.equal(tokenDecimals.toString(), (await xCollateralObject[xTokenAddress].srcDecimals.call()).toString());
                            assert.equal(tokenAddress, await xCollateralObject[xTokenAddress].getSrcERC20.call());

                            var amountNB = new BN(Number(amount * 10 ** tokenDecimals.toString()).toLocaleString().replace(/,/g,''));
                            var amountReal = await xCollateralObject[xTokenAddress].reverseByMultiple.call(
                                await xCollateralObject[xTokenAddress].changeByMultiple.call(amountNB));
                            console.log('deposit token index : ' + (collateralAddress.indexOf(tokenAddress) + 1));
                            console.log('deposit token name : ' + await collateralObject[tokenAddress].name.call());
                            console.log('deposit token address : ' + tokenAddress);
                            console.log('deposit token decimals : ' + tokenDecimals.toString());
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
                            var tokenName = await collateralObject[tokenAddress].name.call();
                            
                            await collateralObject[tokenAddress].approve(dfPool.address, new BN(0), {from: accountAddress});
                            await collateralObject[tokenAddress].approve(dfPool.address, amountNB, {from: accountAddress});
                            console.log(tokenName + ' belance:');
                            console.log(accountTokenBalanceOrigin);
                            console.log(accountTokenBalanceOrigin.toString());
                            console.log('\n');

                            // await collateralObject[tokenAddress].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            calcDepositorMintTotal = new BN(0);
                            if (tokenAddressList.indexOf(tokenAddress) >= 0) {
                                calcDepositorMintTotal = await dfProtocolView.getUSDXForDeposit.call(tokenAddress, amountNB, {from: accountAddress});
                            }
                            console.log('usdx total supply origin:');
                            console.log(usdxTotalSupplyOrigin);
                            console.log(usdxTotalSupplyOrigin.toString());
                            console.log('usdx account origin:');
                            console.log(usdxBalanceOrigin);
                            console.log(usdxBalanceOrigin.toString());
                            console.log('get USDx deposit amount:');
                            console.log(calcDepositorMintTotal);
                            console.log(calcDepositorMintTotal.toString());
                            console.log('\n');

                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress);
                            
                            runData['tokenAddress'] = collateralAddress.indexOf(tokenAddress) + 1;
                            runData[tokenName + ' balance'] = accountTokenBalanceOrigin.toString() / (10 ** tokenDecimals.toString());
                            runData[tokenName + ' balance BN'] = accountTokenBalanceOrigin.toString();
                            
                            runData['USDx balance'] = usdxBalanceOrigin.toString() / 10 ** 18;
                            runData['USDx balance BN'] = usdxBalanceOrigin.toString();
                            
                            runData['decimals'] = tokenDecimals.toString();
                            runData['amount'] = amount;
                            runData['amountNB'] = amountNB.toString();
                            runData['amount real'] = amountReal.toString();
                            try {
                                transactionData = await dfProtocol.deposit(tokenAddress, new BN(0), amountNB, {from: accountAddress});
                                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
                                runData['result'] = 'success';
                                // runDataList[runDataList.length] = runData;
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

                            // await collateralObject[tokenAddress].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            // recordToken[tokenAddress] = recordToken.hasOwnProperty(tokenAddress) ? recordToken[tokenAddress].add(amountNB) : amountNB;
                            // recordTokenTotal = recordTokenTotal.add(amountNB);

                            // if(recordAccountMap[tokenAddress] == undefined)
                            //     recordAccountMap[tokenAddress] = {};

                            // recordAccountMap[tokenAddress][accountAddress] = recordAccountMap[tokenAddress].hasOwnProperty(accountAddress) ? recordAccountMap[tokenAddress][accountAddress].add(amountNB) : amountNB;
                            // recordAccountTotalMap[accountAddress] = recordAccountTotalMap.hasOwnProperty(accountAddress) ? recordAccountTotalMap[accountAddress].add(amountNB) : amountNB;

                            // console.log('record: token belance:');
                            // console.log(recordToken[tokenAddress]);
                            // console.log(recordToken[tokenAddress].toString());
                            // console.log('record: token total:');
                            // console.log(recordTokenTotal);
                            // console.log(recordTokenTotal.toString());
                            // console.log('\n');
                            // console.log('record: account tokens balance:');
                            // console.log(recordAccountMap[tokenAddress][accountAddress]);
                            // console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                            // console.log('record: account total tokens :');
                            // console.log(recordAccountTotalMap[accountAddress]);
                            // console.log(recordAccountTotalMap[accountAddress].toString());
                            // console.log('\n');

                            // var times = new BN(-1);
                            // var cw = new BN(0);
                            // for (let index = 0; index < tokenWeightList.length; index++) {

                            //     // cw = new BN(Number(tokenWeightList[index] * 10 ** 18).toLocaleString().replace(/,/g,''));
                            //     cw = tokenWeightList[index];
                            //     if (!recordToken.hasOwnProperty(tokenAddressList[index])){
                            //         times = new BN(0);
                            //         continue;
                            //     }

                            //     times = times.eq(new BN(-1)) ? recordToken[tokenAddressList[index]].div(cw) : 
                            //         (times.gt(recordToken[tokenAddressList[index]].div(cw)) ? recordToken[tokenAddressList[index]].div(cw) : times);
                            // }
                            // console.log('minted times');
                            // console.log(times);
                            // console.log('\n');

                            // if (times.gt(new BN(0))){

                            //     console.log('--------------------record minted--------------------');
                            //     console.log('--------------------minting start--------------------\n');
                            //     var amountLock = new BN(0);
                            //     for (let index = 0; index < tokenWeightList.length; index++) {

                            //         // amountLock = times.mul(new BN(Number(tokenWeightList[index] * 10 ** 18).toLocaleString().replace(/,/g,'')));
                            //         amountLock = times.mul(tokenWeightList[index]);
                            //         recordToken[tokenAddressList[index]] = recordToken[tokenAddressList[index]].sub(amountLock);
                            //         recordLockToken[tokenAddressList[index]] = recordLockToken.hasOwnProperty(tokenAddressList[index]) ? 
                            //             recordLockToken[tokenAddressList[index]].add(amountLock) : amountLock;

                            //         recordDfCollateralToken[tokenAddressList[index]] = recordDfCollateralToken.hasOwnProperty([tokenAddressList[index]]) ?
                            //             recordDfCollateralToken[tokenAddressList[index]].add(amountLock) : amountLock;

                            //         recordMintedTotal = recordMintedTotal.add(amountLock);
                            //         recordMinted[recordMintedPosition] = recordMinted.hasOwnProperty(recordMintedPosition) ? 
                            //             recordMinted[recordMintedPosition].add(amountLock) : amountLock;

                            //         console.log('--------------- token index : ' + index);
                            //         console.log('token address : ' + tokenAddressList[index]);
                            //         console.log('token weight : ' + tokenWeightList[index]);
                            //         console.log('token weight : ' + tokenWeightList[index].toString());
                            //         console.log('times' + times);
                            //         console.log('minted amount ' + amountLock);
                            //         console.log('\n');
                            //         console.log('record: token belance:');
                            //         console.log(recordToken[tokenAddressList[index]]);
                            //         console.log(recordToken[tokenAddressList[index]].toString());
                            //         console.log('record: lock token belance:');
                            //         console.log(recordLockToken[tokenAddressList[index]]);
                            //         console.log(recordLockToken[tokenAddressList[index]].toString());
                            //         console.log('\n');
                            //         console.log('record: token belance:');
                            //         console.log(recordToken[tokenAddressList[index]]);
                            //         console.log(recordToken[tokenAddressList[index]].toString());
                            //         console.log('record: DfCollateral token belance:');
                            //         console.log(recordDfCollateralToken[tokenAddressList[index]]);
                            //         console.log(recordDfCollateralToken[tokenAddressList[index]].toString());
                            //         console.log('\n');
                            //         console.log('record: minting token total:');
                            //         console.log(recordMintedTotal);
                            //         console.log(recordMintedTotal.toString());
                            //         console.log('record: minting position:');
                            //         console.log(recordMintedPosition);
                            //         console.log(recordMintedPosition.toString());
                            //         console.log('record: minting token belance:');
                            //         console.log(recordMinted[recordMintedPosition]);
                            //         console.log(recordMinted[recordMintedPosition].toString());
                            //         console.log('\n');
                            //     }
                            //     console.log('--------------------minting end--------------------\n');
                            // }

                            // console.log('record: minted token total:');
                            // console.log(recordMintedTotal);
                            // console.log(recordMintedTotal.toString());
                            // console.log('record: minted position:');
                            // console.log(recordMintedPosition);
                            // console.log(recordMintedPosition.toString());
                            // console.log('record: minted token belance:');
                            // if (recordMinted.hasOwnProperty(recordMintedPosition)) {
                            //     console.log(recordMinted[recordMintedPosition]);
                            //     console.log(recordMinted[recordMintedPosition].toString());
                            // }else
                            //     console.log('0');
                            
                            // console.log('\n');
                            // console.log('record: burned token total:');
                            // console.log(recordBurnedTotal);
                            // console.log(recordBurnedTotal.toString());
                            // console.log('record: burned position:');
                            // console.log(recordBurnedPosition);
                            // console.log(recordBurnedPosition.toString());
                            // console.log('record: burned token belance:');
                            // if (recordBurned.hasOwnProperty(recordBurnedPosition)) {
                            //     console.log(recordBurned[recordBurnedPosition]);
                            //     console.log(recordBurned[recordBurnedPosition].toString());
                            // }else
                            //     console.log('0');
                            
                            // console.log('\n');

                            // var amountMint = new BN(0);
                            // console.log('--------------------record deposit claim--------------------');
                            // console.log('--------------------claim start--------------------\n');
                            // for (let index = 0; index < tokenAddressList.length; index++) {
                                
                            //     if (recordAccountMap.hasOwnProperty(tokenAddressList[index]) 
                            //         && recordAccountMap[tokenAddressList[index]].hasOwnProperty(accountAddress)
                            //         && recordLockToken.hasOwnProperty(tokenAddressList[index])
                            //     ) {
                            //         amountMint = recordAccountMap[tokenAddressList[index]][accountAddress].lte(recordLockToken[tokenAddressList[index]]) ? 
                            //             recordAccountMap[tokenAddressList[index]][accountAddress] : recordLockToken[tokenAddressList[index]];

                            //         recordAccountMap[tokenAddressList[index]][accountAddress] = recordAccountMap[tokenAddressList[index]][accountAddress].sub(amountMint);
                            //         recordLockToken[tokenAddressList[index]] = recordLockToken[tokenAddressList[index]].sub(amountMint);

                            //         console.log('--------------- token index : ' + index);
                            //         console.log('token address : ' + tokenAddressList[index]);
                            //         console.log('[deposit claim] amount ' + amountMint);
                            //         console.log('record: [deposit claim] lock token belance:');
                            //         console.log(recordLockToken[tokenAddressList[index]]);
                            //         console.log(recordLockToken[tokenAddressList[index]].toString());
                            //         console.log('record: [deposit claim] account tokens balance:');
                            //         console.log(recordAccountMap[tokenAddressList[index]][accountAddress]);
                            //         console.log(recordAccountMap[tokenAddressList[index]][accountAddress].toString());
                            //         console.log('\n');
                            //     }
                            // }
                            // console.log('--------------------claim end--------------------\n');

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

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);

                                dfStoreTokenBalance[xTokenAddress] = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[xTokenAddress]);

                                dfStoreLockTokenBalance[xTokenAddress] = await dfStore.getResUSDXBalance.call(xTokenAddress);
                                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(dfStoreLockTokenBalance[xTokenAddress]);

                                dfStoreAccountToken[xTokenAddress] = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(dfStoreAccountToken[xTokenAddress]);

                                dfPoolTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotal = dfPoolTokenTotal.add(dfPoolTokenBalance[xTokenAddress]);

                                dfCollateralTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotal = dfCollateralTokenTotal.add(dfCollateralTokenBalance[xTokenAddress]);
                            }

                            dfStoreTotalCol = await dfStore.getTotalCol.call();

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
                            console.log(dfStoreTotalCol);
                            console.log(dfStoreTotalCol.toString());
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
                            // assert.equal(usdxTotalSupply.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());
                            // assert.equal(usdxBalance.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotal.toString());
                            // assert.equal(dfStoreTokenTotal.add(dfStoreLockTokenTotal).toString(), dfPoolTokenTotal.toString());
                            assert.equal(dfStoreTokenTotal.toString(), dfPoolTokenTotal.toString());
                            assert.equal(usdxTotalSupply.toString(), dfCollateralTokenTotal.toString());
                            assert.equal(usdxTotalSupply.toString(), dfStoreTotalCol.toString());
                            // assert.equal(recordTokenTotal.toString(), dfStoreTotalCol.add(dfPoolTokenTotal).toString());

                            // assert.equal(usdxTotalSupply.sub(usdxTotalSupplyOrigin).toString(), calcDepositorMintTotal.toString());
                            assert.equal(usdxBalance.sub(usdxBalanceOrigin).toString(), calcDepositorMintTotal.toString());
                            
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            
                            dfPoolSrcTokenBalance = {};
                            dfPoolSrcTokenTotal = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), dfStoreLockTokenBalance[xTokenAddress].toString());

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);
                                withdrawAmount = dfStoreTokenBalance[xTokenAddress].lt(dfStoreAccountToken[xTokenAddress]) ? 
                                    dfStoreTokenBalance[xTokenAddress] : dfStoreAccountToken[xTokenAddress];
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());
                                
                                assert.equal(
                                    dfStoreTokenBalance[xTokenAddress].toString(), 
                                    dfPoolTokenBalance[xTokenAddress].toString()
                                    );

                                dfPoolSrcTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                balanceOfSrcTokens = await xCollateralObject[xTokenAddress].changeByMultiple.call(dfPoolSrcTokenBalance[collateralAddress[index]]);
                                dfPoolSrcTokenTotal = dfPoolSrcTokenTotal.add(balanceOfSrcTokens);

                                dfPoolSrcTokenBalance[collateralAddress[index]] = dfPoolSrcTokenBalance[collateralAddress[index]].toString();

                                assert.equal(
                                    balanceOfSrcTokens.toString(), 
                                    dfPoolTokenBalance[xTokenAddress].add(dfCollateralTokenBalance[xTokenAddress]).toString()
                                    );

                                // if (recordLockToken.hasOwnProperty(collateralAddress[index])) {

                                //     assert.equal(
                                //         dfStoreLockTokenBalance[collateralAddress[index]].toString(), 
                                //         recordLockToken[collateralAddress[index]].toString()
                                //         );
                                // }

                                // if (recordToken.hasOwnProperty(collateralAddress[index])) {
                                //     assert.equal(
                                //         dfStoreTokenBalance[collateralAddress[index]].toString(), 
                                //         recordToken[collateralAddress[index]].toString()
                                //         );
                                // }

                                // if (recordAccountMap.hasOwnProperty(collateralAddress[index])
                                //     && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)
                                // ) {
                                //     recordAccountMap[collateralAddress[index]][accountAddress]
                                //     assert.equal(
                                //         recordAccountMap[collateralAddress[index]][accountAddress].toString(), 
                                //         dfStoreAccountToken[collateralAddress[index]].toString()
                                //         );
                                // }

                                // if (recordDfCollateralToken.hasOwnProperty(collateralAddress[index])) {
                                //     assert.equal(
                                //         dfCollateralTokenBalance[collateralAddress[index]].toString(), 
                                //         recordDfCollateralToken[collateralAddress[index]].toString()
                                //         );
                                // }
                                
                            }

                            assert.equal(dfPoolSrcTokenTotal.toString(), dfPoolTokenTotal.add(dfCollateralTokenTotal).toString());
                            assert.equal(dfPoolSrcTokenTotal.toString(), usdxTotalSupply.add(dfStoreTokenTotal).toString());
                            assert.equal(dfPoolSrcTokenTotal.toString(), usdxTotalSupply.add(dfPoolTokenTotal).toString());

                            // dfStoreMintPosition = await dfStore.getMintPosition.call();
                            // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

                            dfStoreMintedTotal = await dfStore.getTotalMinted.call();
                            // assert.equal(dfStoreMintedTotal.toString(), recordMintedTotal.toString());
                            assert.equal((dfStoreMintedTotal.sub(await dfStore.getTotalBurned.call())).toString(), usdxTotalSupply.toString());

                            // dfStoreMinted = await dfStore.getSectionMinted.call(dfStoreMintPosition);
                            // assert.equal(
                            //     dfStoreMinted.toString(), 
                            //     recordMinted.hasOwnProperty(recordMintedPosition) ? recordMinted[recordMintedPosition].toString() : '0');

                            accountTokenBalanceCurrent = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            assert.equal(accountTokenBalanceOrigin.sub(amountReal).toString(), accountTokenBalanceCurrent.toString());

                            runData[tokenName + ' balance current'] = accountTokenBalanceCurrent.toString() / (10 ** tokenDecimals.toString());
                            runData[tokenName + ' balance current BN'] = accountTokenBalanceCurrent.toString();
                            
                            runData['USDx balance current'] = usdxBalance.toString() / 10 ** 18;
                            runData['USDx balance current BN'] = usdxBalance.toString();

                            runData['pool src token balance'] = dfPoolSrcTokenBalance;
                            
                            runDataList[runDataList.length] = runData;
                            condition++;
                        }
                        break;
                    case runType == 'destroy':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            accountAddress = accounts[MathTool.randomNum(1, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress']];
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
                            
                            // amount = MathTool.randomNum(0, Number(usdxBalanceOrigin.mul(new BN(11)).div(new BN(10)).div(new BN(Number(10 ** 10).toLocaleString().replace(/,/g,'')))));
                            minBurnAmount = await dfProtocolView.getDestroyThreshold.call();
                            amount = MathTool.randomNum(0, Number(usdxBalanceOrigin.mul(new BN(11)).div(new BN(10)).div(minBurnAmount)));
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                    amount = amount * 10 ** (18 - (minBurnAmount.toString().length - 1));
                                }
        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('total')
                                    && runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['total']
                                ) {
                                    amount = usdxBalanceOrigin;
                                }
                            }
                            // var amountNB = typeof(amount) == 'number' ? new BN((amount * 10 ** 10).toLocaleString().replace(/,/g,'')) : amount;
                            var amountNB = typeof(amount) == 'number' ? (new BN(amount.toLocaleString().replace(/,/g,''))).mul(minBurnAmount) : amount;
                            console.log('destroy account index : ' + accounts.indexOf(accountAddress));
                            console.log('destroy account address : ' + accountAddress);
                            console.log('create destroy random the amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');
                            console.log('min burn amount');
                            console.log(minBurnAmount);
                            console.log(minBurnAmount.toString());
                            console.log('\n');
                            
                            burnedTotalOrigin = await dfStore.getTotalBurned.call();
                            burnedOrigin = await dfStore.getSectionBurned.call(await dfStore.getBurnPosition.call());

                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            
                            dfStoreTokenTotal = new BN(0);
                            dfPoolTokenTotal = new BN(0);
                            dfCollateralTokenTotalOrigin = new BN(0);
                            dfCollateralTokenBalance = {};
                            dfPoolSrcTokenBalance = {};
                            dfPoolSrcTokenTotalOrigin = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);

                                balanceOfTokens = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(balanceOfTokens);

                                balanceOfTokens = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotal = dfPoolTokenTotal.add(balanceOfTokens);

                                dfCollateralTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(dfCollateralTokenBalance[xTokenAddress]);

                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString());

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);

                                dfTokenBalance = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfAccountToken = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                
                                withdrawAmount = dfTokenBalance.lt(dfAccountToken) ? dfTokenBalance : dfAccountToken;
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());

                                // if (recordDfCollateralToken.hasOwnProperty(xTokenAddress)) 
                                //     assert.equal(recordDfCollateralToken[xTokenAddress].toString(), dfCollateralTokenBalance[xTokenAddress].toString());

                                dfPoolSrcTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                balanceOfSrcTokens = await xCollateralObject[xTokenAddress].changeByMultiple.call(dfPoolSrcTokenBalance[collateralAddress[index]]);
                                dfPoolSrcTokenTotalOrigin = dfPoolSrcTokenTotalOrigin.add(balanceOfSrcTokens);

                                dfPoolSrcTokenBalance[collateralAddress[index]] = dfPoolSrcTokenBalance[collateralAddress[index]].toString();
                            }

                            dfStoreTotalColOrigin = await dfStore.getTotalCol.call();

                            assert.equal(dfPoolSrcTokenTotalOrigin.toString(), dfPoolTokenTotal.add(dfStoreTotalColOrigin).toString());
                            assert.equal(dfPoolSrcTokenTotalOrigin.toString(), usdxTotalSupplyOrigin.add(dfStoreTokenTotal).toString());
                            assert.equal(dfPoolSrcTokenTotalOrigin.toString(), usdxTotalSupplyOrigin.add(dfPoolTokenTotal).toString());
                            
                            console.log('burned origin token total :');
                            console.log(burnedTotalOrigin);
                            console.log(burnedTotalOrigin.toString());
                            console.log('burned origin token:');
                            console.log(burnedOrigin);
                            console.log(burnedOrigin.toString());
                            console.log('DFCollateral origin token total:');
                            console.log(dfCollateralTokenBalance);
                            console.log(dfStoreTotalColOrigin);
                            console.log(dfStoreTotalColOrigin.toString());
                            console.log('\n');

                            // assert.equal(recordBurnedTotal.toString(), burnedTotalOrigin.toString());
                            // assert.equal(recordBurnedPosition.toString(), (await dfStore.getBurnPosition.call()).toString());
                            // if (recordBurned.hasOwnProperty(recordBurnedPosition))
                            //     assert.equal(recordBurned[recordBurnedPosition].toString(), burnedOrigin.toString());

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

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress);
                            // runData['amount'] = amount / 10 ** 8;
                            runData['amount'] = amount / 10 ** (18 - (minBurnAmount.toString().length - 1));
                            runData['amountNB'] = amountNB.toString();
                            runData['min amount'] = minBurnAmount.toString() / 10 ** 18;
                            runData['min amount BN'] = minBurnAmount.toString();
                            runData['usdx balance'] = usdxBalanceOrigin.toString() / 10 ** 18;
                            runData['usdx balance BN'] = usdxBalanceOrigin.toString();
                            runData['pool src token balance'] = dfPoolSrcTokenBalance;
                            try {
                                transactionData = await dfProtocol.destroy(new BN(0), amountNB, {from: accountAddress});
                                destroyGasUsed = destroyGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : destroyGasUsed;
                                destroyGasData[destroyGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
                                runData['result'] = 'success';
                                // runDataList[runDataList.length] = runData;
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

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));
                            
                            assert.equal((await usdxToken.allowance.call(accountAddress, dfEngine.address)).toString(), '0');
                            assert.equal((await dfToken.allowance.call(accountAddress, dfEngine.address)).toString(), '0');

                            var burnedTokens = [];
                            var burnedWeight = [];
                            var sumWeight = new BN(0);
                            var amountBurned = new BN(0);
                            var amountTemp = amountNB;
                            console.log('--------------------record destroy burned--------------------');
                            console.log('--------------------burned start--------------------\n');
                            // while (amountTemp.gt(new BN(0))) {

                            //     burnedTokens = [];
                            //     burnedWeight = [];
                            //     burnedTokens = await dfStore.getSectionToken.call(recordBurnedPosition);
                            //     burnedWeight = await dfStore.getSectionWeight.call(recordBurnedPosition);

                            //     if (!recordBurned.hasOwnProperty(recordBurnedPosition))
                            //         recordBurned[recordBurnedPosition] = new BN(0);

                            //     if (!recordMinted.hasOwnProperty(recordBurnedPosition))
                            //         recordMinted[recordBurnedPosition] = new BN(0);
                                
                            //     if ((amountTemp.add(recordBurned[recordBurnedPosition])).lte(recordMinted[recordBurnedPosition])) {
                                    
                            //         amountBurned = amountTemp;
                            //         recordBurned[recordBurnedPosition] = recordBurned.hasOwnProperty(recordBurnedPosition) ? 
                            //         recordBurned[recordBurnedPosition].add(amountBurned) : amountBurned;
                            //         amountTemp = new BN(0);
                            //     }else{

                            //         amountBurned = recordMinted[recordBurnedPosition].sub(recordBurned[recordBurnedPosition]);
                            //         recordBurned[recordBurnedPosition] = recordBurned.hasOwnProperty(recordBurnedPosition) ? 
                            //         recordBurned[recordBurnedPosition].add(amountBurned) : amountBurned;
                            //         amountTemp = amountTemp.sub(amountBurned);
                            //         recordBurnedPosition = recordBurnedPosition.add(new BN(1));
                            //     }

                            //     if (!recordBurned.hasOwnProperty(recordBurnedPosition))
                            //         recordBurned[recordBurnedPosition] = new BN(0);

                            //     if (!recordMinted.hasOwnProperty(recordBurnedPosition))
                            //         recordMinted[recordBurnedPosition] = new BN(0);

                            //     console.log('--------------- burned position : ' + recordBurnedPosition.toString());
                            //     console.log('burned amountNB : ' + amountNB.toString());
                            //     console.log('burned amountTemp : ' + amountTemp.toString());
                            //     console.log('burned amountBurned : ' + amountBurned.toString());
                            //     console.log('record: bured position:');
                            //     console.log(recordBurnedPosition);
                            //     console.log(recordBurnedPosition.toString());
                            //     console.log('record: bured position amount:');
                            //     console.log(recordBurned[recordBurnedPosition]);
                            //     console.log(recordBurned[recordBurnedPosition].toString());
                            //     console.log('\n');
                                
                            //     sumWeight = new BN(0);
                            //     for (let index = 0; index < burnedWeight.length; index++)
                            //         sumWeight = sumWeight.add(burnedWeight[index]);

                            //     for (let index = 0; index < burnedTokens.length; index++){

                            //         // assert.equal(
                            //         //     (await collateralObject[burnedTokens[index]].balanceOf.call(dfCollateral.address)).toString(),
                            //         //     dfCollateralTokenBalance[burnedTokens[index]].sub(amountBurned.mul(burnedWeight[index]).div(sumWeight)).toString()
                            //         // );
                                    
                            //         if (recordDfCollateralToken.hasOwnProperty(burnedTokens[index])) {
                            //             recordDfCollateralToken[burnedTokens[index]] = recordDfCollateralToken[burnedTokens[index]].sub(
                            //                 amountBurned.mul(burnedWeight[index]).div(sumWeight)
                            //             );
                            //         }else
                            //             recordDfCollateralToken[burnedTokens[index]] = new BN(0);

                            //         console.log('---------- token index : ' + index);
                            //         console.log('token address : ' + burnedTokens[index]);
                            //         console.log('record: DfCollateral token belance:');
                            //         console.log(recordDfCollateralToken[burnedTokens[index]]);
                            //         console.log(recordDfCollateralToken[burnedTokens[index]].toString());
                            //         console.log('\n');
                            //     }
                            // }
                            console.log('--------------------burned end--------------------\n');
                            // recordBurnedTotal = recordBurnedTotal.add(amountNB);
                            // console.log('record: bured total amount:');
                            // console.log(recordBurnedTotal);
                            // console.log(recordBurnedTotal.toString());

                            burnedTotalCurrent = await dfStore.getTotalBurned.call();
                            burnedCurrent = await dfStore.getSectionBurned.call(await dfStore.getBurnPosition.call());

                            dfCollateralTokenTotalCurrent = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);

                                balanceOfTokens = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(balanceOfTokens);

                                // if (recordDfCollateralToken.hasOwnProperty(collateralAddress[index])) 
                                //     assert.equal(recordDfCollateralToken[collateralAddress[index]].toString(), balanceOfTokens.toString());
                            }
                            dfStoreTotalColCurrent = await dfStore.getTotalCol.call();
                            console.log('current burned token total :');
                            console.log(burnedTotalCurrent);
                            console.log(burnedTotalCurrent.toString());
                            console.log('current burned token:');
                            console.log(burnedCurrent);
                            console.log(burnedCurrent.toString());
                            console.log('current DFCollateral token total:');
                            console.log(dfStoreTotalColCurrent);
                            console.log(dfStoreTotalColCurrent.toString());
                            console.log('\n');

                            // assert.equal(recordBurnedTotal.toString(), burnedTotalCurrent.toString());
                            assert.equal(burnedTotalOrigin.toString(), (burnedTotalCurrent.sub(amountNB)).toString());
                            // assert.equal(recordBurnedPosition.toString(), (await dfStore.getBurnPosition.call()).toString());
                            // if (recordBurned.hasOwnProperty(recordBurnedPosition))
                            //     assert.equal(recordBurned[recordBurnedPosition].toString(), burnedCurrent.toString());
                                                    
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            
                            dfStoreTokenTotal = new BN(0);
                            dfPoolTokenTotal = new BN(0);
                            dfStoreLockTokenTotal = new BN(0);
                            dfStoreAccountTokenTotal = new BN(0);
                            dfPoolSrcTokenBalance = {};
                            dfPoolSrcTokenTotal = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);

                                balanceOfTokens = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(balanceOfTokens);

                                balanceOfTokens = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotal = dfPoolTokenTotal.add(balanceOfTokens);

                                dfAccountToken = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(dfAccountToken);

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);


                                withdrawAmount = balanceOfTokens.lt(dfAccountToken) ? balanceOfTokens : dfAccountToken;
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());

                                balanceOfTokens = await dfStore.getResUSDXBalance.call(xTokenAddress);
                                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(balanceOfTokens);

                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), balanceOfTokens.toString());  
                                
                                dfPoolSrcTokenBalance[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(dfPool.address);
                                balanceOfSrcTokens = await xCollateralObject[xTokenAddress].changeByMultiple.call(dfPoolSrcTokenBalance[collateralAddress[index]]);
                                dfPoolSrcTokenTotal = dfPoolSrcTokenTotal.add(balanceOfSrcTokens);

                                dfPoolSrcTokenBalance[collateralAddress[index]] = dfPoolSrcTokenBalance[collateralAddress[index]].toString();
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
                            
                            assert.equal(usdxTotalSupplyOrigin.toString(), dfStoreTotalColOrigin.toString());
                            assert.equal(usdxTotalSupplyCurrent.toString(), dfStoreTotalColCurrent.toString());

                            assert.equal(burnedTotalCurrent.sub(burnedTotalOrigin).toString(), amountNB.toString());
                            // assert.equal(burnedCurrent.sub(burnedOrigin).toString(), amountNB.toString());
                            assert.equal(dfStoreTotalColOrigin.sub(dfStoreTotalColCurrent).toString(), amountNB.toString());
                            assert.equal(usdxTotalSupplyOrigin.sub(usdxTotalSupplyCurrent).toString(), amountNB.toString());
                            assert.equal(usdxBalanceOrigin.sub(usdxBalanceCurrent).toString(), amountNB.toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotal.toString());

                            assert.equal(dfPoolSrcTokenTotal.toString(), dfPoolTokenTotal.add(dfStoreTotalColCurrent).toString());
                            assert.equal(dfPoolSrcTokenTotal.toString(), usdxTotalSupplyCurrent.add(dfStoreTokenTotal).toString());
                            assert.equal(dfPoolSrcTokenTotal.toString(), usdxTotalSupplyCurrent.add(dfPoolTokenTotal).toString());

                            // if((recordTokenTotal.sub(amountNB)).gte(new BN(0))){
                                
                            //     console.log('record origin token total:');
                            //     console.log(recordTokenTotal);
                            //     console.log(recordTokenTotal.toString());
                                
                            //     recordTokenTotal = recordTokenTotal.sub(amountNB);
                            //     console.log('record current token total:');
                            //     console.log(recordTokenTotal);
                            //     console.log(recordTokenTotal.toString());
                            //     console.log('\n');
                                
                            //     assert.equal(usdxTotalSupplyCurrent.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());

                            // }else{

                            //     console.log('error record token total:');
                            //     console.log(recordTokenTotal);
                            //     console.log(recordTokenTotal.toString());
                            //     console.log('amountNB value:');
                            //     console.log(amountNB);
                            //     console.log(amountNB.toString());
                            //     console.log('recordTokenTotal not enough calculations !!!\n');

                            // }

                            // if((recordAccountTotalMap[accountAddress].sub(amountNB)).gte(new BN(0))){
                                
                            //     console.log('record origin account total token:');
                            //     console.log(recordAccountTotalMap[accountAddress]);
                            //     console.log(recordAccountTotalMap[accountAddress].toString());
                                
                            //     recordAccountTotalMap[accountAddress] = recordAccountTotalMap[accountAddress].sub(amountNB);
                            //     console.log('record current account total token:');
                            //     console.log(recordAccountTotalMap[accountAddress]);
                            //     console.log(recordAccountTotalMap[accountAddress].toString());
                            //     console.log('\n');

                            //     assert.equal(usdxBalanceCurrent.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());

                            // }else{

                            //     console.log('error record account total token:');
                            //     console.log(recordAccountTotalMap[accountAddress]);
                            //     console.log(recordAccountTotalMap[accountAddress].toString());
                            //     console.log('amountNB value:');
                            //     console.log(amountNB);
                            //     console.log(amountNB.toString());
                            //     console.log('recordAccountTotalMap[' + accountAddress + '] not enough calculations !!!\n');

                            // }
                            runData['usdx balance current'] = usdxBalanceCurrent.toString() / 10 ** 18;
                            runData['usdx balance current BN'] = usdxBalanceCurrent.toString();
                            runData['pool src token balance current'] = dfPoolSrcTokenBalance;
                            runDataList[runDataList.length] = runData;
                            condition++;
                        }
                        break;
                    case runType == 'withdraw':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            tokenAddress = collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)];
                            accountAddress = accounts[MathTool.randomNum(1, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokenAddress')) {
            
                                    tokenAddress = collateralAddress[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokenAddress'] - 1];                        
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress']];
                                }
                            }

                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            amountTotal = dfWithdrawBalances[1][dfWithdrawBalances[0].indexOf(tokenAddress)];
                            amount = MathTool.randomNum(0, Number(amountTotal.mul(new BN(11)).div(new BN(10))));
                            // amount = MathTool.randomNum(0, 50);
                            var tokenDecimals = collateralDecimals[collateralAddress.indexOf(tokenAddress)];
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                    amount = amount * 10 ** tokenDecimals.toString();
                                }
        
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('total')
                                    && runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['total']
                                ) {
                                    amount = amountTotal;
                                }
                            }
                            // var tokenDecimals = collateralDecimals[collateralAddress.indexOf(tokenAddress)];
                            // var amountNB = typeof(amount) == 'number' ? new BN(Number(amount * 10 ** tokenDecimals.toString()).toLocaleString().replace(/,/g,'')) : amount;
                            var amountNB = typeof(amount) == 'number' ? new BN(amount.toLocaleString().replace(/,/g,'')) : amount;
                            var tokenName = await collateralObject[tokenAddress].name.call();
                            console.log('withdraw token name : ' + tokenName);
                            console.log('withdraw token address : ' + tokenAddress);
                            console.log('withdraw token decimals : ' + tokenDecimals.toString());
                            console.log('withdraw account index : ' + accounts.indexOf(accountAddress));
                            console.log('withdraw account address : ' + accountAddress);
                            console.log('\n');
                            console.log('create withdraw random the amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            xTokenAddress = await dfStore.getWrappedToken.call(tokenAddress);
                            var amountReal = await xCollateralObject[xTokenAddress].reverseByMultiple.call(
                                await xCollateralObject[xTokenAddress].changeByMultiple.call(amountNB));
                            dfStoreTokenBalanceOrigin = await dfStore.getTokenBalance.call(xTokenAddress);
                            dfStoreLockTokenBalanceOrigin = await dfStore.getResUSDXBalance.call(xTokenAddress);
                            dfStoreAccountTokenOrigin = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
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
                            // if (recordToken.hasOwnProperty(tokenAddress))
                            //     assert.equal(dfStoreTokenBalanceOrigin.toString(), recordToken[tokenAddress].toString());
                                
                            // if (recordLockToken.hasOwnProperty(tokenAddress))
                            //     assert.equal(dfStoreLockTokenBalanceOrigin.toString(), recordLockToken[tokenAddress].toString());
                            
                            // if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
                            //     assert.equal(dfStoreAccountTokenOrigin.toString(), recordAccountMap[tokenAddress][accountAddress].toString());
                            
                            dfPoolTokenBalanceOrigin = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                            accountTokenBalanceOrigin = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            console.log('dfPool origin token balance:');
                            console.log(dfPoolTokenBalanceOrigin);
                            console.log(dfPoolTokenBalanceOrigin.toString());
                            console.log('account origin token balance:');
                            console.log(accountTokenBalanceOrigin);
                            console.log(accountTokenBalanceOrigin.toString());
                            console.log('\n');
                            
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString());
                                
                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);
                                
                                dfTokenBalance = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfAccountToken = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);

                                withdrawAmount = dfTokenBalance.lt(dfAccountToken) ? dfTokenBalance : dfAccountToken;
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());
                            }

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress);
                            
                            runData['tokenAddress'] = collateralAddress.indexOf(tokenAddress) + 1;
                            runData[tokenName + ' balance'] = accountTokenBalanceOrigin.toString() / (10 ** tokenDecimals.toString());
                            runData[tokenName + ' balance BN'] = accountTokenBalanceOrigin.toString();
                            
                            runData['decimals'] = tokenDecimals.toString();
                            runData['amount'] = amount / 10 ** tokenDecimals.toString();
                            runData['amountNB'] = amountNB.toString();
                            runData['amount real'] = amountReal.toString();
                            runData['depositor balance'] = dfStoreAccountTokenOrigin.toString();
                            try {
                                transactionData = await dfProtocol.withdraw(tokenAddress, new BN(0), amountNB, {from: accountAddress});
                                withdrawGasUsed = withdrawGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : withdrawGasUsed;
                                withdrawGasData[withdrawGasData.length] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
                                runData['result'] = 'success';
                                // runDataList[runDataList.length] = runData;
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

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString());
                                
                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);
                                
                                dfTokenBalance = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfAccountToken = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);

                                withdrawAmount = dfTokenBalance.lt(dfAccountToken) ? dfTokenBalance : dfAccountToken;
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());
                            }

                            amountMin = new BN(0);
                            amountMin = amountTotal.lt(amountReal) ? amountTotal : amountReal;
                            // if (recordAccountMap.hasOwnProperty(tokenAddress) 
                            //         && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress)
                            //         && recordToken.hasOwnProperty(tokenAddress)
                            //     )
                            // {
                            //     amountMin = recordAccountMap[tokenAddress][accountAddress].lt(recordToken[tokenAddress]) ?
                            //         recordAccountMap[tokenAddress][accountAddress] : recordToken[tokenAddress];
                            // }
                            
                            // // amountNB = amountMin.lt(amountNB) ? amountMin : amountNB;
                            // amountMin = amountMin.lt(amountNB) ? amountMin : amountNB;

                            // console.log('withdraw Real the amount');
                            // console.log(amountNB);
                            // console.log(amountNB.toString());
                            // console.log('\n');

                            console.log('withdraw Real the amount Min');
                            console.log(amountMin);
                            console.log(amountMin.toString());
                            console.log('\n');

                            // console.log('record origin token :');
                            // if (recordToken.hasOwnProperty(tokenAddress)){
                            //     console.log(recordToken[tokenAddress]);
                            //     console.log(recordToken[tokenAddress].toString());
                            //     recordToken[tokenAddress] = recordToken[tokenAddress].sub(amountMin);
                            //     console.log('record current token :');
                            //     console.log(recordToken[tokenAddress]);
                            //     console.log(recordToken[tokenAddress].toString());
                            // }else{
                            //     console.log(new BN(0));
                            //     console.log('record current token :');
                            //     console.log(new BN(0));
                            // }
                            // console.log('\n');

                            // console.log('record origin token total:');
                            // console.log(recordTokenTotal);
                            // console.log(recordTokenTotal.toString());
                            // recordTokenTotal = recordTokenTotal.sub(amountMin);
                            // console.log('record current token total:');
                            // console.log(recordTokenTotal);
                            // console.log(recordTokenTotal.toString());
                            // console.log('\n');

                            // console.log('record origin account token:');
                            // if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress)){
                            //     console.log(recordAccountMap[tokenAddress][accountAddress]);
                            //     console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                            //     recordAccountMap[tokenAddress][accountAddress] = recordAccountMap[tokenAddress][accountAddress].sub(amountMin);
                            //     console.log('record current account token:');
                            //     console.log(recordAccountMap[tokenAddress][accountAddress]);
                            //     console.log(recordAccountMap[tokenAddress][accountAddress].toString());
                            // }else{
                            //     console.log(new BN(0));
                            //     console.log('record current account token:');
                            //     console.log(new BN(0));
                            // }
                            // console.log('\n');

                            // console.log('record origin account total token:');
                            // if (recordAccountTotalMap.hasOwnProperty(accountAddress)){
                            //     console.log(recordAccountTotalMap[accountAddress]);
                            //     console.log(recordAccountTotalMap[accountAddress].toString());
                            //     recordAccountTotalMap[accountAddress] = recordAccountTotalMap[accountAddress].sub(amountMin);
                            //     console.log('record current account total token:');
                            //     console.log(recordAccountTotalMap[accountAddress]);
                            //     console.log(recordAccountTotalMap[accountAddress].toString());
                            // }else{
                            //     console.log(new BN(0));
                            //     console.log('record current account total token:');
                            //     console.log(new BN(0));
                            // }
                            // console.log('\n');

                            xTokenAddress = await dfStore.getWrappedToken.call(tokenAddress);
                            dfStoreTokenBalanceCurrent = await dfStore.getTokenBalance.call(xTokenAddress);
                            dfStoreLockTokenBalanceCurrent = await dfStore.getResUSDXBalance.call(xTokenAddress);
                            dfStoreAccountTokenCurrent = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                            dfPoolTokenBalanceCurrent = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                            accountTokenBalanceCurrent = await collateralObject[tokenAddress].balanceOf.call(accountAddress);
                            // dfCollateralToken = await collateralObject[tokenAddress].balanceOf.call(dfCollateral.address);
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
                            // console.log('dfCollateral current token balance:');
                            // console.log(dfCollateralToken);
                            // console.log(dfCollateralToken.toString());
                            console.log('usdx current token balance:');
                            console.log(usdxBalance);
                            console.log(usdxBalance.toString());
                            console.log('\n');

                            // if (!recordToken.hasOwnProperty(tokenAddress))
                            //     recordToken[tokenAddress] = new BN(0);
                            // assert.equal(dfStoreTokenBalanceCurrent.toString(), recordToken[tokenAddress].toString());

                            // if (!recordLockToken.hasOwnProperty(tokenAddress))
                            //     recordLockToken[tokenAddress] = new BN(0);
                            // assert.equal(dfStoreLockTokenBalanceCurrent.toString(), recordLockToken[tokenAddress].toString());

                            // if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
                            //     assert.equal(dfStoreAccountTokenCurrent.toString(), recordAccountMap[tokenAddress][accountAddress].toString());
                            
                            xAmount = await xCollateralObject[xTokenAddress].changeByMultiple.call(amountMin);
                            assert.equal(dfStoreTokenBalanceOrigin.toString(), dfPoolTokenBalanceOrigin.toString());
                            assert.equal(dfStoreTokenBalanceCurrent.toString(), dfPoolTokenBalanceCurrent.toString());
                            assert.equal(dfStoreTokenBalanceCurrent.toString(), dfStoreTokenBalanceOrigin.sub(xAmount).toString());
                            assert.equal(dfPoolTokenBalanceCurrent.toString(), dfPoolTokenBalanceOrigin.sub(xAmount).toString());

                            assert.equal(dfStoreAccountTokenOrigin.toString(), dfStoreAccountTokenCurrent.add(xAmount).toString());
                            assert.equal(accountTokenBalanceCurrent.toString(), accountTokenBalanceOrigin.add(amountMin).toString());

                            runData['withdraw amount'] = amountMin.toString() / (10 ** tokenDecimals.toString());
                            runData['withdraw amount BN'] = amountMin.toString();
                            runData[tokenName + ' balance current'] = accountTokenBalanceCurrent.toString() / (10 ** tokenDecimals.toString());
                            runData[tokenName + ' balance current BN'] = accountTokenBalanceCurrent.toString();
                            runDataList[runDataList.length] = runData;
                            condition++;
                        }
                        break;
                    case runType == 'claim':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            accountAddress = accounts[MathTool.randomNum(1, accounts.length - 1)];

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress']];
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
                            tokenClaimAmount = {};
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                // dfStoreTokenBalance[xTokenAddress] = await dfStore.getTokenBalance.call(xTokenAddress);
                                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[xTokenAddress]);

                                dfStoreLockTokenBalance[xTokenAddress] = await dfStore.getResUSDXBalance.call(xTokenAddress);
                                // if (recordLockToken.hasOwnProperty(xTokenAddress))
                                //     assert.equal(dfStoreLockTokenBalance[xTokenAddress].toString(), recordLockToken[xTokenAddress].toString());
                                dfStoreLockTokenTotalOrigin = dfStoreLockTokenTotalOrigin.add(dfStoreLockTokenBalance[xTokenAddress]);

                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), dfStoreLockTokenBalance[xTokenAddress].toString());

                                dfStoreAccountToken[xTokenAddress] = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                // if (recordAccountMap.hasOwnProperty(xTokenAddress) && recordAccountMap[xTokenAddress].hasOwnProperty(accountAddress))
                                //     assert.equal(dfStoreAccountToken[xTokenAddress].toString(), recordAccountMap[xTokenAddress][accountAddress].toString());
                                dfStoreAccountTokenTotalOrigin = dfStoreAccountTokenTotalOrigin.add(dfStoreAccountToken[xTokenAddress]);

                                tokenClaimAmount[collateralAddress[index]] = 
                                    dfStoreLockTokenBalance[xTokenAddress].lt(dfStoreAccountToken[xTokenAddress]) ? 
                                        dfStoreLockTokenBalance[xTokenAddress] : dfStoreAccountToken[xTokenAddress];

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);
                                
                                dfTokenBalance = await dfStore.getTokenBalance.call(xTokenAddress);

                                withdrawAmount = dfTokenBalance.lt(dfStoreAccountToken[xTokenAddress]) ? 
                                dfTokenBalance : dfStoreAccountToken[xTokenAddress];
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());

                                dfPoolTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotalOrigin = dfPoolTokenTotalOrigin.add(dfPoolTokenBalance[xTokenAddress]);

                                dfCollateralTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(dfCollateralTokenBalance[xTokenAddress]);
                            }

                            dfStoreTotalColOrigin = await dfStore.getTotalCol.call();

                            usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            usdxBalanceOfDfPool = await usdxToken.balanceOf.call(dfPool.address);
                            calcMaxClaimAmount = await dfProtocolView.getUserMaxToClaim.call({from: accountAddress});
                            
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
                            // console.log(dfCollateralTokenBalance);
                            console.log(dfStoreTotalColOrigin);
                            console.log(dfStoreTotalColOrigin.toString());
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
                            
                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress);
                            runData['getMaxToClaim'] = calcMaxClaimAmount.toString();
                            runData['usdx_balance origin'] = usdxBalanceOrigin.toString();
                            try {
                                // transactionData = await dfEngine.withdraw(accountAddress, usdxToken.address, amountNB, {from: accountAddress});
                                transactionData = await dfProtocol.claim(new BN(0), {from: accountAddress});
                                claimGasUsed = claimGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : claimGasUsed;
                                claimGasData[claimGasData.length] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['usdx_balance current'] = (await usdxToken.balanceOf.call(accountAddress)).toString();
                                runData['claim amount'] = runData['usdx_balance current'] - runData['usdx_balance origin'];
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfEngine ' + (dfEngineTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');
                            }
                            catch (error) {
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['error'] = error.message;
                                runData['usdx_balance current'] = (await usdxToken.balanceOf.call(accountAddress)).toString();
                                runData['claim amount'] = runData['usdx_balance current'] - runData['usdx_balance origin'];
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));
    
                            var amountNB = dfStoreAccountTokenTotalOrigin.lt(dfStoreLockTokenTotalOrigin) ? dfStoreAccountTokenTotalOrigin : dfStoreLockTokenTotalOrigin;
                            console.log('claim account index : ' + accounts.indexOf(accountAddress));
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
                                amountMin = tokenClaimAmount[collateralAddress[index]];
                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                // if (recordAccountMap.hasOwnProperty(collateralAddress[index]) 
                                //     && recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)
                                //     && recordLockToken.hasOwnProperty(collateralAddress[index])
                                // )
                                // {
                                //     amountMin = recordAccountMap[collateralAddress[index]][accountAddress].lt(recordLockToken[collateralAddress[index]]) ?
                                //         recordAccountMap[collateralAddress[index]][accountAddress] : recordLockToken[collateralAddress[index]];

                                //     recordLockToken[collateralAddress[index]] = recordLockToken[collateralAddress[index]].sub(amountMin);
                                //     recordAccountMap[collateralAddress[index]][accountAddress] = recordAccountMap[collateralAddress[index]][accountAddress].sub(amountMin);
                                // }else{

                                //     if (!recordLockToken.hasOwnProperty(collateralAddress[index]))
                                //         recordLockToken[collateralAddress[index]] = new BN(0);

                                //     if (!recordAccountMap.hasOwnProperty(collateralAddress[index])){
                                //         recordAccountMap[collateralAddress[index]] = {};
                                //         recordAccountMap[collateralAddress[index]][accountAddress] = new BN(0);
                                //     }else if (!recordAccountMap[collateralAddress[index]].hasOwnProperty(accountAddress)) {
                                //         recordAccountMap[collateralAddress[index]][accountAddress] = new BN(0);
                                //     }    
                                // }

                                assert.equal(
                                    dfStoreLockTokenBalance[xTokenAddress].sub(amountMin).toString(),
                                    (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString()
                                );

                                assert.equal(
                                    dfStoreAccountToken[xTokenAddress].sub(amountMin).toString(),
                                    (await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress)).toString()
                                );

                                amountMinTotal = amountMinTotal.add(amountMin);

                                console.log('--------------- token index : ' + index);
                                console.log('token address : ' + collateralAddress[index]);
                                console.log('[claim claim] amount ' + amountMin);
                                // console.log('record: [claim claim] lock token belance:');
                                // console.log(recordLockToken[collateralAddress[index]]);
                                // console.log(recordLockToken[collateralAddress[index]].toString());
                                // console.log('record: [claim claim] account tokens balance:');
                                // console.log(recordAccountMap[collateralAddress[index]][accountAddress]);
                                // console.log(recordAccountMap[collateralAddress[index]][accountAddress].toString());
                                console.log('\n');
                            }
                            console.log('--------------------record [claim] claim end--------------------\n');

                            amountNB = amountMinTotal.lt(amountNB) ? amountMinTotal : amountNB;
                            console.log('claim Real the amount');
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            // assert.equal(recordMintedTotal.toString(), (await dfStore.getTotalMinted.call()).toString());
                            // if (recordMinted.hasOwnProperty(recordMintedPosition))
                            //     assert.equal(recordMinted[recordMintedPosition].toString(), (await dfStore.getSectionMinted.call(await dfStore.getMintPosition.call())).toString());
                            // else
                            //     assert.equal('0', (await dfStore.getSectionMinted.call(await dfStore.getMintPosition.call())).toString());
                            // dfStoreTokenBalance = {};
                            dfStoreLockTokenBalance = {};
                            // dfStoreTokenTotal = new BN(0);
                            dfStoreLockTokenTotalCurrent = new BN(0);
                            dfStoreAccountToken = {};
                            dfStoreAccountTokenTotalCurrent = new BN(0);
                            dfPoolTokenTotalCurrent = new BN(0);
                            dfCollateralTokenBalance = {};
                            dfCollateralTokenTotalCurrent = new BN(0);
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                // dfStoreTokenBalance[collateralAddress[index]] = await dfStore.getTokenBalance.call(collateralAddress[index]);
                                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[collateralAddress[index]]);

                                dfStoreLockTokenBalance[xTokenAddress] = await dfStore.getResUSDXBalance.call(xTokenAddress);
                                // if (recordLockToken.hasOwnProperty(xTokenAddress))
                                //     assert.equal(dfStoreLockTokenBalance[xTokenAddress].toString(), recordLockToken[xTokenAddress].toString());
                                dfStoreLockTokenTotalCurrent = dfStoreLockTokenTotalCurrent.add(dfStoreLockTokenBalance[xTokenAddress]);

                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), dfStoreLockTokenBalance[xTokenAddress].toString());

                                dfStoreAccountToken[xTokenAddress] = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                // if (recordAccountMap.hasOwnProperty(xTokenAddress) && recordAccountMap[xTokenAddress].hasOwnProperty(accountAddress))
                                //     assert.equal(dfStoreAccountToken[xTokenAddress].toString(), recordAccountMap[xTokenAddress][accountAddress].toString());
                                dfStoreAccountTokenTotalCurrent = dfStoreAccountTokenTotalCurrent.add(dfStoreAccountToken[xTokenAddress]);

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);
                                
                                dfTokenBalance = await dfStore.getTokenBalance.call(xTokenAddress);

                                withdrawAmount = dfTokenBalance.lt(dfStoreAccountToken[xTokenAddress]) ? 
                                dfTokenBalance : dfStoreAccountToken[xTokenAddress];
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());

                                dfPoolTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotalCurrent = dfPoolTokenTotalCurrent.add(dfPoolTokenBalance[xTokenAddress]);

                                dfCollateralTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(dfCollateralTokenBalance[xTokenAddress]);
                            }

                            dfStoreTotalColCurrent = await dfStore.getTotalCol.call();

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
                            console.log(dfStoreTotalColCurrent);
                            console.log(dfStoreTotalColCurrent.toString());
                            console.log('\n');

                            assert.equal(dfStoreLockTokenTotalCurrent.toString(), dfStoreLockTokenTotalOrigin.sub(amountNB).toString());
                            assert.equal(dfStoreAccountTokenTotalCurrent.toString(), dfStoreAccountTokenTotalOrigin.sub(amountNB).toString());
                            assert.equal(dfPoolTokenTotalCurrent.toString(), dfPoolTokenTotalOrigin.toString());
                            assert.equal(dfStoreTotalColCurrent.toString(), dfStoreTotalColOrigin.toString());

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
                    case runType == 'oneClickMinting':
                        while (condition < runTimes) {
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');

                            accountAddress = accounts[MathTool.randomNum(1, accounts.length - 1)];
                            amount = MathTool.randomNum(1, 100);
                            amount = amount / 2;

                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){

                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('accountAddress')) {
                                    
                                    accountAddress = accounts[runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['accountAddress']];
                                }
            
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                }
                            }
                            var amountNB = new BN(Number(amount * 10 ** 18).toLocaleString().replace(/,/g,''));
                            console.log('minting account index : ' + accounts.indexOf(accountAddress));
                            console.log('minting account address : ' + accountAddress);
                            console.log('\n');
                            console.log('minting amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
                            usdxBalanceOrigin = await usdxToken.balanceOf.call(accountAddress);
                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            runData['amount'] = amount;
                            runData['amountNB'] = amountNB.toString();
                            runData['usdxTotalSupplyOrigin'] = usdxTotalSupplyOrigin.toString() / 10 ** 18;
                            runData['usdxTotalSupplyOrigin BN'] = usdxTotalSupplyOrigin.toString();
                            runData['usdxBalanceOrigin'] = usdxBalanceOrigin.toString() / 10 ** 18;
                            runData['usdxBalanceOrigin BN'] = usdxBalanceOrigin.toString();

                            dfProtocolMintingSection = await dfProtocolView.getMintingSection.call();
                            var cwSum = new BN(0);
                            runData['weight'] = {};
                            for (let index = 0; index < dfProtocolMintingSection[0].length; index++) {

                                assert.equal(dfProtocolMintingSection[0][index], tokenAddressList[index]);
                                assert.equal(dfProtocolMintingSection[1][index].toString(), tokenWeightList[index].toString());
                                runData['weight'][index] = dfProtocolMintingSection[1][index].toString() / 10 ** 18;

                                cwSum = cwSum.add(dfProtocolMintingSection[1][index]);
                            }
                            var times = amountNB.div(cwSum);
                            var tokenAmount = {};
                            var srcTokenAmount = new BN(0);
                            accountTokenBalanceMapOrigin = {};
                            accountTokenTotalOrigin = new BN(0);
                            runData['token amount'] = {};
                            runData['token amount BN'] = {};
                            for (let index = 0; index < tokenAddressList.length; index++) {
                                xTokenAddress = await dfStore.getWrappedToken.call(tokenAddressList[index]);

                                accountTokenBalanceMapOrigin[tokenAddressList[index]] = await collateralObject[tokenAddressList[index]].balanceOf.call(accountAddress);
                                balanceOfSrcTokens = await xCollateralObject[xTokenAddress].changeByMultiple.call(accountTokenBalanceMapOrigin[tokenAddressList[index]]);
                                accountTokenTotalOrigin = accountTokenTotalOrigin.add(balanceOfSrcTokens);

                                await collateralObject[tokenAddressList[index]].approve(dfPool.address, new BN(0), {from: accountAddress});
                                tokenAmount[tokenAddressList[index]] = amountNB.mul(dfProtocolMintingSection[1][index]).div(cwSum);
                                
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(tokenAmount[tokenAddressList[index]]);
                                console.log('-------------------------');
                                console.log('tokenAddress : ' + index);
                                console.log('srcTokenAmount : ' + srcTokenAmount.toString());
                                console.log('decimal : ' + (await xCollateralObject[xTokenAddress].srcDecimals.call()).toString());
                                console.log('-------------------------\n');
                                await collateralObject[tokenAddressList[index]].approve(dfPool.address, srcTokenAmount, {from: accountAddress});
                                // await collateralObject[tokenAddressList[index]].approvex(dfPool.address, {from: accountAddress});

                                tokenAmount[tokenAddressList[index]] = srcTokenAmount;
                                runData['token amount'][collateralAddress.indexOf(tokenAddressList[index])] = srcTokenAmount / 10 ** (await xCollateralObject[xTokenAddress].srcDecimals.call()).toString();
                                runData['token amount BN'][collateralAddress.indexOf(tokenAddressList[index])] = srcTokenAmount.toString();
                            }

                            try {
                                transactionData = await dfProtocol.oneClickMinting(new BN(0), amountNB, {from: accountAddress});
                                oneClickMintingGasUsed = oneClickMintingGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : oneClickMintingGasUsed;
                                oneClickMintingGasData[oneClickMintingGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
                                usdxBalanceCurrent = await usdxToken.balanceOf.call(accountAddress);
                                runData['usdxTotalSupplyCurrent'] = usdxTotalSupplyCurrent.toString() / 10 ** 18;
                                runData['usdxTotalSupplyCurrent BN'] = usdxTotalSupplyCurrent.toString();
                                runData['usdxBalanceCurrent'] = usdxBalanceCurrent.toString() / 10 ** 18;
                                runData['usdxBalanceCurrent BN'] = usdxBalanceCurrent.toString();
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
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

                            // await collateralObject[collateralAddress[MathTool.randomNum(0, collateralAddress.length - 1)]].transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));

                            // recordTokenTotal = recordTokenTotal.add(amountNB);
                            // recordAccountTotalMap[accountAddress] = recordAccountTotalMap.hasOwnProperty(accountAddress) ? recordAccountTotalMap[accountAddress].add(amountNB) : amountNB;

                            // console.log('record: token total:');
                            // console.log(recordTokenTotal);
                            // console.log(recordTokenTotal.toString());
                            // console.log('\n');
                            // console.log('record: account total tokens :');
                            // console.log(recordAccountTotalMap[accountAddress]);
                            // console.log(recordAccountTotalMap[accountAddress].toString());
                            // console.log('\n');
                            // console.log('minted times');
                            // console.log(times);
                            // console.log('\n');

                            // if (times.gt(new BN(0))){

                            //     console.log('--------------------record minted--------------------');
                            //     console.log('--------------------minting start--------------------\n');
                            //     var amountLock = new BN(0);
                            //     for (let index = 0; index < tokenWeightList.length; index++) {

                            //         amountLock = times.mul(tokenWeightList[index]);
                            //         recordDfCollateralToken[tokenAddressList[index]] = recordDfCollateralToken.hasOwnProperty([tokenAddressList[index]]) ?
                            //             recordDfCollateralToken[tokenAddressList[index]].add(amountLock) : amountLock;

                            //         console.log('--------------- token index : ' + index);
                            //         console.log('token address : ' + tokenAddressList[index]);
                            //         console.log('token weight : ' + tokenWeightList[index]);
                            //         console.log('token weight : ' + tokenWeightList[index].toString());
                            //         console.log('times' + times);
                            //         console.log('minted amount ' + amountLock);
                            //         console.log('\n');
                            //         console.log('record: DfCollateral token belance:');
                            //         console.log(recordDfCollateralToken[tokenAddressList[index]]);
                            //         console.log(recordDfCollateralToken[tokenAddressList[index]].toString());
                            //         console.log('\n');
                            //     }
                            //     console.log('--------------------minting end--------------------\n');
                            // }

                            // recordMintedTotal = recordMintedTotal.add(amountNB);
                            // recordMinted[recordMintedPosition] = recordMinted.hasOwnProperty(recordMintedPosition) ? 
                            //     recordMinted[recordMintedPosition].add(amountNB) : amountNB;
                            // console.log('record: minted token total:');
                            // console.log(recordMintedTotal);
                            // console.log(recordMintedTotal.toString());
                            // console.log('record: minted position:');
                            // console.log(recordMintedPosition);
                            // console.log(recordMintedPosition.toString());
                            // console.log('record: minted token belance:');
                            // if (recordMinted.hasOwnProperty(recordMintedPosition)) {
                            //     console.log(recordMinted[recordMintedPosition]);
                            //     console.log(recordMinted[recordMintedPosition].toString());
                            // }else
                            //     console.log('0');
                            
                            // console.log('\n');
                            // console.log('record: burned token total:');
                            // console.log(recordBurnedTotal);
                            // console.log(recordBurnedTotal.toString());
                            // console.log('record: burned position:');
                            // console.log(recordBurnedPosition);
                            // console.log(recordBurnedPosition.toString());
                            // console.log('record: burned token belance:');
                            // if (recordBurned.hasOwnProperty(recordBurnedPosition)) {
                            //     console.log(recordBurned[recordBurnedPosition]);
                            //     console.log(recordBurned[recordBurnedPosition].toString());
                            // }else
                            //     console.log('0');
                            
                            // console.log('\n');

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

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);

                                dfStoreTokenBalance[xTokenAddress] = await dfStore.getTokenBalance.call(xTokenAddress);
                                dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[xTokenAddress]);

                                dfStoreLockTokenBalance[xTokenAddress] = await dfStore.getResUSDXBalance.call(xTokenAddress);
                                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(dfStoreLockTokenBalance[xTokenAddress]);

                                dfStoreAccountToken[xTokenAddress] = await dfStore.getDepositorBalance.call(accountAddress, xTokenAddress);
                                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(dfStoreAccountToken[xTokenAddress]);

                                dfPoolTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address);
                                dfPoolTokenTotal = dfPoolTokenTotal.add(dfPoolTokenBalance[xTokenAddress]);

                                dfCollateralTokenBalance[xTokenAddress] = await xCollateralObject[xTokenAddress].balanceOf.call(dfCollateral.address);
                                dfCollateralTokenTotal = dfCollateralTokenTotal.add(dfCollateralTokenBalance[xTokenAddress]);
                            }

                            dfStoreTotalCol = await dfStore.getTotalCol.call();

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
                            console.log(dfStoreTotalCol);
                            console.log(dfStoreTotalCol.toString());
                            console.log('\n');
                            
                            usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
                            usdxBalanceCurrent = await usdxToken.balanceOf.call(accountAddress);
                            usdxBalanceOfDfPool = await usdxToken.balanceOf.call(dfPool.address);

                            console.log('usdx current total supply:');
                            console.log(usdxTotalSupplyCurrent);
                            console.log(usdxTotalSupplyCurrent.toString());
                            console.log('usdx current account:');
                            console.log(usdxBalanceCurrent);
                            console.log(usdxBalanceCurrent.toString());
                            console.log('usdx dfPool:');
                            console.log(usdxBalanceOfDfPool);
                            console.log(usdxBalanceOfDfPool.toString());
                            console.log('\n');
                            
                            // assert.equal(usdxTotalSupplyCurrent.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());
                            assert.equal(usdxTotalSupplyCurrent.toString(), usdxTotalSupplyOrigin.add(amountNB).toString());
                            // assert.equal(usdxBalanceCurrent.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());
                            assert.equal(usdxBalanceOfDfPool.toString(), dfStoreLockTokenTotal.toString());
                            assert.equal(dfStoreTokenTotal.toString(), dfPoolTokenTotal.toString());
                            assert.equal(usdxTotalSupplyCurrent.toString(), dfStoreTotalCol.toString());
                            // assert.equal(recordTokenTotal.toString(), dfStoreTotalCol.add(dfPoolTokenTotal).toString());

                            assert.equal(usdxBalanceCurrent.sub(usdxBalanceOrigin).toString(), amountNB.toString());
                            
                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();
                            dfWithdrawBalances = {};
                            dfWithdrawBalances = await dfProtocolView.getUserWithdrawBalance.call({from: accountAddress});

                            accountTokenBalanceMapCurrent = {};
                            accountTokenTotalCurrent = new BN(0);
                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), dfStoreLockTokenBalance[xTokenAddress].toString());

                                assert.equal(dfWithdrawBalances[0][index], collateralAddress[index]);

                                withdrawAmount = dfStoreTokenBalance[xTokenAddress].lt(dfStoreAccountToken[xTokenAddress]) ? 
                                    dfStoreTokenBalance[xTokenAddress] : dfStoreAccountToken[xTokenAddress];
                                srcTokenAmount = await xCollateralObject[xTokenAddress].reverseByMultiple.call(withdrawAmount);
                                assert.equal(dfWithdrawBalances[1][index].toString(), srcTokenAmount.toString());

                                assert.equal(
                                    dfStoreTokenBalance[xTokenAddress].toString(), 
                                    dfPoolTokenBalance[xTokenAddress].toString()
                                    );

                                if (accountTokenBalanceMapOrigin.hasOwnProperty(collateralAddress[index])) {
                                    accountTokenBalanceMapCurrent[collateralAddress[index]] = await collateralObject[collateralAddress[index]].balanceOf.call(accountAddress);
                                    balanceOfSrcTokens = await xCollateralObject[xTokenAddress].changeByMultiple.call(accountTokenBalanceMapCurrent[collateralAddress[index]]);
                                    accountTokenTotalCurrent = accountTokenTotalCurrent.add(balanceOfSrcTokens);
                                    assert.equal(
                                        accountTokenBalanceMapOrigin[collateralAddress[index]].sub(tokenAmount[collateralAddress[index]]).toString(), 
                                        accountTokenBalanceMapCurrent[collateralAddress[index]].toString()
                                        );
                                }
                            }
                            assert.equal(accountTokenTotalOrigin.toString(), accountTokenTotalCurrent.add(amountNB).toString());

                            // dfStoreMintPosition = await dfStore.getMintPosition.call();
                            // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

                            dfStoreMintedTotal = await dfStore.getTotalMinted.call();
                            // assert.equal(dfStoreMintedTotal.toString(), recordMintedTotal.toString());
                            assert.equal((dfStoreMintedTotal.sub(await dfStore.getTotalBurned.call())).toString(), usdxTotalSupplyCurrent.toString());

                            // dfStoreMinted = await dfStore.getSectionMinted.call(dfStoreMintPosition);
                            // assert.equal(
                            //     dfStoreMinted.toString(), 
                            //     recordMinted.hasOwnProperty(recordMintedPosition) ? recordMinted[recordMintedPosition].toString() : '0');

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

                            tokenWeightListNew = DataMethod.createMixIndexData(weightTest, weightTest.length, weightTest.length);
                            tokenAddressIndex = DataMethod.createIndex(collateralAddress, tokenWeightListNew.length - 1, tokenWeightListNew.length - 1);
                            tokenAddressIndex.push(-1);
                            var randomFlag = true;
                            
                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('tokens')) {

                                    tokenAddressIndex = [];
                                    tokenAddressIndex = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['tokens'];
                                    randomFlag = false;
                                }
                                
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('weight')) {

                                    tokenWeightListNew = [];
                                    tokenWeightListNew = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['weight'];
                                }

                                tokenAddressListNew = [];
                                var collateralAddressLength = collateralAddress.length;
                                for (let index = 0; index < tokenAddressIndex.length; index++) {
                                    
                                    if (tokenAddressIndex[index] <= (randomFlag ?  -1 : 0) || tokenAddressIndex[index] > collateralAddressLength) {

                                        var nameIndex = MathTool.randomNum(0, collateralNames.length - 1);
                                        decimals = MathTool.randomNum(6, 22);
                                        var collaterals = await Collaterals.new(
                                            collateralNames[nameIndex] + collateralIndex,
                                            collateralNames[nameIndex] + collateralIndex + '1.0', 
                                            accounts[accounts.length - 1],
                                            decimals
                                            );
                                        // var collaterals = await Collaterals.new(collateralNames[nameIndex] + collateralIndex,
                                            // collateralNames[nameIndex] + collateralIndex + '1.0', accounts[accounts.length - 1]);
        
                                        var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                                        var accountsIndex = 1
                                        while (accountsIndex < (accounts.length - 1)) {
                                            await collaterals.transfer(accounts[accountsIndex], amount);
                                            accountsIndex++;
                                        }

                                        // await collaterals.transfer(dfCollateral.address, new BN(MathTool.randomNum(1000, 2000).toString()));
        
                                        collateralAddress.push(collaterals.address);
                                        collateralObject[collaterals.address] = collaterals;
                                        collateralDecimals.push(decimals);
                                        tokenAddressListNew.push(collaterals.address);
                        
                                        var wrappedToken = await DSWrappedToken.new(
                                            collaterals.address,
                                            decimals,
                                            'x' + collateralNames[nameIndex] + collateralIndex,
                                            );
                        
                                            
                                        await wrappedToken.setAuthority(dfEngine.address);
                                        xCollateralAddress.push(wrappedToken.address);
                                        xCollateralObject[wrappedToken.address] = wrappedToken;
                                        xTokenDecimalsList.push(decimals);

                                        await dfPool.approveToEngine(wrappedToken.address, dfEngine.address);
                                        await dfCollateral.approveToEngine(wrappedToken.address, dfEngine.address);

                                        collateralIndex++;
                                        
                                    }else{

                                        tokenAddressListNew.push(collateralAddress[tokenAddressIndex[index] - (randomFlag ?  0 : 1)]);
                                    }
                                }
                                
                                if (tokenWeightListNew.length == 0) {

                                    tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressListNew.length, tokenAddressListNew.length);
                                }
                                
                            }
                            // else{

                            //     tokenAddressListNew = [];
                            //     tokenAddressListNew = DataMethod.createData(collateralAddress, 3, 3);
                            //     collateralIndex++;

                            //     var nameIndex = MathTool.randomNum(0, collateralNames.length - 1)

                            //     var collaterals = await Collaterals.new(collateralNames[nameIndex] + collateralIndex,
                            //         collateralNames[nameIndex] + collateralIndex + '1.0', accounts[accounts.length - 1]);

                            //     var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                            //     var accountsIndex = 1
                            //     while (accountsIndex < (accounts.length - 1)) {
                            //         await collaterals.transfer(accounts[accountsIndex], amount);
                            //         accountsIndex++;
                            //     }

                            //     collateralAddress.push(collaterals.address);
                            //     collateralObject[collaterals.address] = collaterals;
                            //     tokenAddressListNew.push(collaterals.address);

                            //     for (let index = 0; index < tokenAddressListNew.length; index++) {
                                    
                            //         tokenAddressIndex.push(collateralAddress.indexOf(tokenAddressListNew[index]));
                            //     }

                            //     // tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressListNew.length, tokenAddressListNew.length);
                            //     tokenWeightListNew = weightTest;

                            // }

                            console.log('tokenAddressIndex : ');
                            console.log(tokenAddressIndex);
                            console.log('\n');
                            console.log('tokenWeightListNew : ');
                            console.log(tokenWeightListNew);
                            console.log('\n');

                            console.log('collateralAddress:');
                            console.log(collateralAddress);
                            console.log('\n');
                            console.log('tokenAddressListNew:');
                            console.log(tokenAddressListNew);
                            console.log('\n');
                            
                            xTokenAddressList = [];
                            tokenDecimalsList = [];
                            for (let index = 0; index < tokenWeightListNew.length; index++) {
                                tokenWeightListNew[index] = new BN((tokenWeightListNew[index] * 10 ** 18).toLocaleString().replace(/,/g, ''));
                                xTokenAddressList.push(xCollateralAddress[collateralAddress.indexOf(tokenAddressListNew[index])]);
                                tokenDecimalsList.push(xTokenDecimalsList[collateralAddress.indexOf(tokenAddressListNew[index])]);
                            }

                            console.log('xCollateralAddress:');
                            console.log(xCollateralAddress);
                            console.log('\n');
                            console.log('xTokenAddressList:');
                            console.log(xTokenAddressList);
                            console.log('\n');
                            console.log('xTokenDecimalsList:');
                            console.log(xTokenDecimalsList);
                            console.log('\n');
                            console.log('tokenDecimalsList:');
                            console.log(tokenDecimalsList);
                            console.log('\n');
                            console.log('input : tokenWeightListNew:');
                            console.log(tokenWeightListNew);
                            console.log('\n');

                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['tokens'] = tokenAddressIndex;
                            runData['weight'] = tokenWeightListNew;
                            try {
                                transactionData = await dfSetting.updateMintSection(xTokenAddressList, tokenWeightListNew, {from: owner});
                                updateGasUsed = updateGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : updateGasUsed;
                                
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
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
                            
                            // recordMintedPosition = recordMintedPosition.add(new BN(1));
                            dfStoreMintPosition = await dfStore.getMintPosition.call();
                            // console.log('record Minted Position :');
                            // console.log(recordMintedPosition);
                            // console.log(recordMintedPosition.toString());
                            console.log('dfStore mintPosition :');
                            console.log(dfStoreMintPosition);
                            console.log(dfStoreMintPosition.toString());
                            console.log('\n');
                            // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());
                            
                            dfStoreTokenAddress = await dfStore.getSectionToken.call(dfStoreMintPosition);
                            console.log('dfStore collateral address :');
                            console.log(dfStoreTokenAddress);
                            console.log('\n');

                            dfStoreTokenWeight = await dfStore.getSectionWeight.call(dfStoreMintPosition);
                            console.log('dfStore tokens weight :');
                            console.log(dfStoreTokenWeight);
                            console.log('\n');
                            
                            tokenAddressList = [];
                            tokenAddressList = tokenAddressListNew;
                            tokenWeightList = [];
                            tokenWeightList = tokenWeightListNew;
                            console.log('tokenAddressList:');
                            console.log(tokenAddressList);
                            console.log('\n');
                            console.log('tokenWeightList:');
                            console.log(tokenWeightList);
                            console.log('\n');
                            for (let index = 0; index < dfStoreTokenAddress.length; index++) {
                                assert.equal(dfStoreTokenAddress[index], xTokenAddressList[index]);
                                assert.equal(dfStoreTokenAddress[index], await dfStore.getWrappedToken.call(tokenAddressList[index]));
                                assert.equal(dfStoreTokenWeight[index].toString(), tokenWeightList[index].toString());
                            }

                            dfColMaxClaim = {};
                            dfColMaxClaim = await dfProtocolView.getColMaxClaim.call();

                            for (let index = 0; index < collateralAddress.length; index++) {

                                xTokenAddress = await dfStore.getWrappedToken.call(collateralAddress[index]);
                                assert.equal(dfColMaxClaim[0][index], collateralAddress[index]);
                                assert.equal(dfColMaxClaim[1][index].toString(), (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString());
                                assert.equal(
                                    (await xCollateralObject[xTokenAddress].balanceOf.call(dfPool.address)).toString(),
                                    (await dfStore.getTokenBalance.call(xTokenAddress)).toString()
                                );
                                // if(recordToken.hasOwnProperty(xTokenAddress))
                                //     assert.equal(recordToken[xTokenAddress].toString(), (await dfStore.getTokenBalance.call(xTokenAddress)).toString());

                                // if(recordLockToken.hasOwnProperty(xTokenAddress))
                                //     assert.equal(recordLockToken[xTokenAddress].toString(), (await dfStore.getResUSDXBalance.call(xTokenAddress)).toString());

                                assert.equal(await dfStore.getMintedToken.call(xTokenAddress), true);
                                if (dfStoreTokenAddress.indexOf(xTokenAddress) >= 0)
                                    assert.equal(await dfStore.getMintingToken.call(xTokenAddress), true);
                                else
                                    assert.equal(await dfStore.getMintingToken.call(xTokenAddress), false);
                            }
                            condition++;
                        }
                        break;
                    case runType == 'changeEngine':
                        while (condition < runTimes){
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            console.log('dfEngine address : ' + dfEngine.address);
                            console.log('\n');

                            dfEngineNew = await DFEngine.new(
                                usdxToken.address,
                                // dfToken.address,
                                dfStore.address,
                                dfPool.address,
                                dfCollateral.address,
                                dfFunds.address,
                                // medianizer.address
                                );

                            await usdxToken.setAuthority(dfEngineNew.address);
                            await dfToken.setAuthority(dfEngineNew.address);
                            await dfStore.setAuthority(dSGuard.address);
                            await dfCollateral.setAuthority(dSGuard.address);
                            await dfPool.setAuthority(dSGuard.address);
                            await dfFunds.setAuthority(dSGuard.address);
                            await dfEngineNew.setAuthority(dSGuard.address);
                            
                            await dSGuard.permitx(dfEngineNew.address, dfStore.address);
                            await dSGuard.permitx(dfEngineNew.address, dfCollateral.address);
                            await dSGuard.permitx(dfEngineNew.address, dfPool.address);
                            await dSGuard.permitx(dfEngineNew.address, dfFunds.address);
                
                            // await dfEngineNew.setCommissionToken(0, dfToken.address);
                            // await dfEngineNew.setCommissionMedian(dfToken.address, medianizer.address);
                            // await dfEngineNew.setCommissionRate(0, 0);
                            // await dfEngineNew.setCommissionRate(1, 50);

                            await dSGuard.forbidx(dfEngine.address, dfStore.address);
                            await dSGuard.forbidx(dfEngine.address, dfCollateral.address);
                            await dSGuard.forbidx(dfEngine.address, dfPool.address);
                            await dSGuard.forbidx(dfEngine.address, dfFunds.address);
                            await dSGuard.forbidx(dfProtocol.address, dfEngine.address);

                            tokenAddress = tokenAddressList[MathTool.randomNum(0, tokenAddressList.length - 1)];
                            accountAddress = accounts[MathTool.randomNum(0, accounts.length - 1)];
                            amount = MathTool.randomNum(1, 5);
                            var amountNB = new BN(Number(amount * 10 ** 18).toLocaleString().replace(/,/g,''));
                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['testType'] = 'deposit';
                            runData['tokenAddress'] = collateralAddress.indexOf(tokenAddress) + 1;
                            runData['accountAddress'] = accounts.indexOf(accountAddress) + 1;
                            runData['amount'] = amount;
                            runData['amountNB'] = amountNB.toString();
                            runData[await collateralObject[tokenAddress].name.call() + ' balance'] = accountTokenBalanceOrigin.toString();
                            try {
                                transactionData = await dfProtocol.deposit(tokenAddress, new BN(0), amountNB, {from: accountAddress});
                                depositGasUsed = depositGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : depositGasUsed;
                                depositGasData[depositGasData.length] = transactionData.receipt.gasUsed;

                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
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
                            }

                            dfEngine = dfEngineNew;
                            await dSGuard.permitx(dfProtocol.address, dfEngine.address);
                            await dfProtocol.requestImplChange(dfEngine.address);
                            await dfProtocol.confirmImplChange();
                            console.log('dfEngine new address : ' + dfEngine.address);
                            console.log('\n');
                            condition++;
                        }
                        break;
                    case runType == 'setMinBurnAmount':
                        while (condition < runTimes){
                            console.log('config : ' + (configIndex + 1) + ' dfEngine : ' + (dfEngineTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            amount = MathTool.randomNum(1, 10) / 10;
                            conditionIndex = condition % runConfig[configIndex]['data'][dfEngineIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('amount')) {
                                    
                                    amount = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['amount'];
                                }
                            }
                            var amountNB = new BN(Number(amount * 10 ** 18).toLocaleString().replace(/,/g,''));
                            console.log('min burn amount');
                            console.log(amount);
                            console.log(amount.toLocaleString().replace(/,/g,''));
                            console.log(amountNB);
                            console.log(amountNB.toString());
                            console.log('\n');
                            runData = {};
                            runData['dfEngine'] = dfEngineTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['amount'] = amount;
                            runData['amountNB'] = amountNB.toString();
                            try {
                                transactionData = await dfSetting.setDestroyThreshold(amountNB, {from: owner});
                                
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['gasUsed ETH'] = transactionData.receipt.gasUsed * gasPrice / 10 ** 18;
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
                            assert.equal((await dfProtocol.getDestroyThreshold.call()).toString(), amountNB.toString());
                            condition++;
                        }
                        break;
                }

                dfEngineTimes++;            
            }

            console.log('deposit max gasUsed:' + depositGasUsed + ':[' + depositGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('destroy max gasUsed:' + destroyGasUsed + ':[' + destroyGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('withdraw max gasUsed:' + withdrawGasUsed + ':[' + withdrawGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('claim max gasUsed:' + claimGasUsed + ':[' + claimGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('claimAmount max gasUsed:' + claimAmountGasUsed + ':[' + claimAmountGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('update max gasUsed:' + updateGasUsed + ':[' + updateGasUsed * gasPrice / 10 ** 18 + ']');
            console.log('oneClickMinting max gasUsed:' + oneClickMintingGasUsed + ':[' + oneClickMintingGasUsed * gasPrice / 10 ** 18 + ']');
            
            console.log('\ndeposit gas data:');
            console.log(depositGasData);
            console.log('\ndestroy gas data:');
            console.log(destroyGasData);
            console.log('\nwithdraw gas data:');
            console.log(withdrawGasData);
            console.log('\nclaim gas data:');
            console.log(claimGasData);
            console.log('\nclaimAmount gas data:');
            console.log(claimAmountGasData);
            console.log('\noneClickMinting gas data:');
            console.log(oneClickMintingGasData);
            
            if (configIndex == runConfig.length - 1) {

                console.log(JSON.stringify(runConfig));
                console.log(JSON.stringify(runDataList));
                
            }

            console.log('collateralAddress : ');
            console.log(collateralAddress);

            console.log('xCollateralAddress : ');
            console.log(xCollateralAddress);

            console.log('dSGuard : ');
            console.log(dSGuard.address);

            console.log('usdxToken : ');
            console.log(usdxToken.address);

            console.log('dfToken : ');
            console.log(dfToken.address);

            console.log('dfStore : ');
            console.log(dfStore.address);

            console.log('dfCollateral : ');
            console.log(dfCollateral.address);

            console.log('dfPool : ');
            console.log(dfPool.address);

            console.log('dfFunds : ');
            console.log(dfFunds.address);

            console.log('priceFeed : ');
            console.log(priceFeed.address);

            console.log('medianizer : ');
            console.log(medianizer.address);

            console.log('dfEngine : ');
            console.log(dfEngine.address);

            console.log('dfSetting : ');
            console.log(dfSetting.address);

            console.log('dfProtocol : ');
            console.log(dfProtocol.address);

            console.log('dfProtocolView : ');
            console.log(dfProtocolView.address);
        });
    }

});


