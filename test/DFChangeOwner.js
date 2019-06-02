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
        var tokenAddressList = [];
        var tokenWeightList = [];

        var transactionData = 0;
        var transferOwnerGasUsed = 0;
        var acceptGasUsed = 0;
        var gasData = [];
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
        
        tokenAddressList = collateralAddress;

        tokenWeightList = [];
        for (let index = 0; index < weightTest.length; index++)
            tokenWeightList[tokenWeightList.length] = new BN((weightTest[index] * 10 ** 18).toLocaleString().replace(/,/g, ''));
            
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
            dfStore.address,
            dfPool.address,
            dfCollateral.address,
            dfFunds.address,
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

        transferOwnerGasUsed = 0;
        acceptGasUsed = 0;
        gasData = [];
        
        console.log('DFEngine init finish:' + dfEngine.address);
    });
        
    it('Verify DFEngine change owner after construction', async () => {
    
        owberAddress = await dfEngine.owner.call();
        runData = {};
        runData['type'] = 'change owner';
        runData['owner address'] = owberAddress;
        runData['new owner address'] = accounts[1];
        runData['other'] = {};
        try {
            transactionData = await dfEngine.transferOwnership(accounts[1], {from: accounts[1]});
            transferOwnerGasUsed = transferOwnerGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : transferOwnerGasUsed;
            gasData[gasData.length] = transactionData.receipt.gasUsed;
            runData['other']['gasUsed'] = transactionData.receipt.gasUsed;
            runData['other']['result'] = 'success';
            console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
        }
        catch (error) {
            runData['other']['result'] = 'fail';
            runData['other']['error'] = error.message;
            console.log(error.message + '\n');
        }

        runData['owner'] = {};
        try {
            transactionData = await dfEngine.transferOwnership(accounts[1], {from: owberAddress});
            transferOwnerGasUsed = transferOwnerGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : transferOwnerGasUsed;
            gasData[gasData.length] = transactionData.receipt.gasUsed;
            runData['owner']['gasUsed'] = transactionData.receipt.gasUsed;
            runData['owner']['result'] = 'success';
            console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
        }
        catch (error) {
            runData['owner']['result'] = 'fail';
            runData['owner']['error'] = error.message;
            console.log(error.message + '\n');
        }
        runData['accept_owner'] = {};
        try {
            transactionData = await dfEngine.acceptOwnership({from: owberAddress});
            acceptGasUsed = acceptGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : acceptGasUsed;
            gasData[gasData.length] = transactionData.receipt.gasUsed;
            runData['accept_owner']['gasUsed'] = transactionData.receipt.gasUsed;
            runData['accept_owner']['result'] = 'success';
            console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
        }
        catch (error) {
            runData['accept_owner']['result'] = 'fail';
            runData['accept_owner']['error'] = error.message;
            console.log(error.message + '\n');
        }
        runData['accept'] = {};
        try {
            transactionData = await dfEngine.acceptOwnership({from: accounts[1]});
            acceptGasUsed = acceptGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : acceptGasUsed;
            gasData[gasData.length] = transactionData.receipt.gasUsed;
            runData['accept']['gasUsed'] = transactionData.receipt.gasUsed;
            runData['accept']['result'] = 'success';
            console.log('gasUsed:' + transactionData.receipt.gasUsed + '\n');
        }
        catch (error) {
            runData['accept']['result'] = 'fail';
            runData['accept']['error'] = error.message;
            console.log(error.message + '\n');
        }

        runData['old'] = {};
        try {
            transactionData = await dfEngine.transferOwnership(accounts[1], {from: accounts[1]});
            transferOwnerGasUsed = transferOwnerGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : transferOwnerGasUsed;
            gasData[gasData.length] = transactionData.receipt.gasUsed;
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
        }
        
        console.log(JSON.stringify(runDataList));
    });

});


