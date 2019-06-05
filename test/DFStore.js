/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */

const DSGuard = artifacts.require('DSGuard.sol');
const DFStore = artifacts.require('DFStore.sol');

const Collaterals = artifacts.require('Collaterals_t.sol');

const BN = require('bn.js');
const MathTool = require('./helpers/MathTool');
const DataMethod = require('./helpers/DataMethod');

var runTypeArr = new Array('setSection', 'setBackupSection');
var runSetBackup = 5;
var runDataList = [];
var runData = {};

contract('DFStore', accounts => {
    
    for (let configIndex = 0; configIndex < runConfig.length; configIndex++) {
        
        {
            var dSGuard;
            var dfStore;

            var owner;

            var collateralAddress = [];
            var collateralObject = {};
            var backupAddress = [];
            var backupObject = {};
            var collateralIndex;
            var tokenAddressList = [];
            var tokenWeightList = [];

            var transactionData = 0;
            var setSectionGasUsed = 0;
            var setBackupGasUsed = 0;

            var recordMintedPosition = new BN(0);
            
            var dfStoreMintPosition = new BN(0);
            var dfStoreTokenAddress = [];
            var dfStoreTokenWeight = [];
            var dfStoreBackupData = {};
            var dfStoreSecListBackup = {};
            var dfStoreBackupIndex = new BN(0);
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
            dfStore = await DFStore.new(tokenAddressList, tokenWeightList);
            await dfStore.setAuthority(dSGuard.address);
            
            owner = accounts[0];

            setSectionGasUsed = 0;
            setBackupGasUsed = 0;
            
            console.log('DFStore init finish:' + dfStore.address);
        });
        
        it('Verify DFStore backup after construction', async () => {
        
            var runType;
            var configTimes = runConfig[configIndex].hasOwnProperty('times') ? runConfig[configIndex]['times'] : runConfig[configIndex]['data'].length;

            var dfStoreIndex = 0;
            
            dfStoreTimes = 0;
            while (dfStoreTimes < configTimes) {
                console.log('config : ' + (configIndex + 1) + ' dfStore : ' + (dfStoreTimes + 1) + '\n');

                dfStoreIndex = dfStoreTimes % runConfig[configIndex]['data'].length;
                runType = runConfig[configIndex]['data'][dfStoreIndex].hasOwnProperty('type') ? 
                    runConfig[configIndex]['data'][dfStoreIndex]['type'] : 
                    (dfStoreTimes > 0 && (dfStoreTimes % runSetBackup) == 0  ? runTypeArr[1] : runTypeArr[MathTool.randomNum(0, runTypeArr.length - 2)]);

                var runTimes = 1;
                if(runConfig[configIndex]['data'][dfStoreIndex].hasOwnProperty('data')){
                    runTimes = runConfig[configIndex]['data'][dfStoreIndex]['data'].length;
                }
                if(runConfig[configIndex]['data'][dfStoreIndex].hasOwnProperty('times')){
                    runTimes = runConfig[configIndex]['data'][dfStoreIndex]['times'];
                }

                console.log('runType : ' + runType + ' runTimes : ' + runTimes + '\n');
                var conditionIndex = 0;
                var condition = 0;
                switch (true) {
                    case runType == 'setSection':
                        while (condition < runTimes){
                            console.log('config : ' + (configIndex + 1) + ' dfStore : ' + (dfStoreTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            tokenWeightListNew = weightTest;
                            tokenAddressIndex = DataMethod.createIndex(collateralAddress, tokenWeightListNew.length - 1, tokenWeightListNew.length - 1);
                            tokenAddressIndex.push(-1);
                            var randomFlag = true;
                            
                            conditionIndex = condition % runConfig[configIndex]['data'][dfStoreIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfStoreIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex].hasOwnProperty('tokens')) {

                                    tokenAddressIndex = [];
                                    tokenAddressIndex = runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['tokens'];
                                    randomFlag = false;
                                }
                                
                                if (runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex].hasOwnProperty('weight')) {

                                    tokenWeightListNew = [];
                                    tokenWeightListNew = runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['weight'];
                                }

                                tokenAddressList = [];
                                var collateralAddressLength = collateralAddress.length;
                                for (let index = 0; index < tokenAddressIndex.length; index++) {
                                    
                                    if (tokenAddressIndex[index] <= (randomFlag ?  -1 : 0) || tokenAddressIndex[index] > collateralAddressLength) {

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

                                        tokenAddressList.push(collateralAddress[tokenAddressIndex[index] - (randomFlag ?  0 : 1)]);
                                    }
                                }
                                
                                if (tokenWeightListNew.length == 0) {

                                    tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
                                }
                            }
                            
                            console.log('tokenAddressIndex:');
                            console.log(tokenAddressIndex);
                            console.log('tokenWeight:');
                            console.log(tokenWeightListNew);
                            console.log('\n');

                            console.log('collateralAddress:');
                            console.log(collateralAddress);
                            console.log('\n');
                            console.log('tokenAddressList:');
                            console.log(tokenAddressList);
                            console.log('\n');
                            tokenWeightList = [];
                            for (let index = 0; index < tokenWeightListNew.length; index++) 
                                tokenWeightList.push(new BN((tokenWeightListNew[index] * 10 ** 18).toLocaleString().replace(/,/g, '')));
                                
                            console.log('input : tokenWeightList:');
                            console.log(tokenWeightList);
                            console.log('\n');

                            runData = {};
                            runData['dfStore'] = dfStoreTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['tokens'] = tokenAddressIndex;
                            runData['weight'] = tokenWeightListNew;
                            try {
                                transactionData = await dfStore.setSection(tokenAddressList, tokenWeightList, {from: owner});
                                setSectionGasUsed = setSectionGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : setSectionGasUsed;
                                
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfStore ' + (dfStoreTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');                            
                            }
                            catch (error) {
                                
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['error'] = error.message;
                                
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

                                assert.equal(await dfStore.getMintedToken.call(collateralAddress[index]), true);
                                if (dfStoreTokenAddress.indexOf(collateralAddress[index]) >= 0)
                                    assert.equal(await dfStore.getMintingToken.call(collateralAddress[index]), true);
                                else
                                    assert.equal(await dfStore.getMintingToken.call(collateralAddress[index]), false);
                            }
                            condition++;
                        }
                        break;
                    case runType == 'setBackupSection':
                        while (condition < runTimes){
                            console.log('config : ' + (configIndex + 1) + ' dfStore : ' + (dfStoreTimes + 1) + ' runType : ' + runType + ' runTimes ' + (condition + 1) + '\n');
                            
                            tokenWeightListNew = weightTest;
                            tokenAddressIndex = DataMethod.createIndex(collateralAddress, tokenWeightListNew.length - 1, tokenWeightListNew.length - 1);
                            tokenAddressIndex.push(-1);
                            var randomFlag = true;

                            dfStoreMintPosition = await dfStore.getMintPosition.call();
                            mintedPosition = MathTool.randomNum(0, Number(dfStoreMintPosition));
                            
                            conditionIndex = condition % runConfig[configIndex]['data'][dfStoreIndex]['data'].length;
                            if(runConfig[configIndex]['data'][dfStoreIndex].hasOwnProperty('data')){
                    
                                if (runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex].hasOwnProperty('tokens')) {

                                    tokenAddressIndex = [];
                                    tokenAddressIndex = runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['tokens'];
                                    randomFlag = false;
                                }
                                
                                if (runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex].hasOwnProperty('weight')) {

                                    tokenWeightListNew = [];
                                    tokenWeightListNew = runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['weight'];
                                }

                                if (runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex].hasOwnProperty('position')) {

                                    mintedPosition = 0;
                                    mintedPosition = runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['position'];
                                }

                                tokenAddressList = [];
                                var collateralAddressLength = collateralAddress.length;
                                for (let index = 0; index < tokenAddressIndex.length; index++) {
                                    
                                    if (tokenAddressIndex[index] <= (randomFlag ?  -1 : 0) || tokenAddressIndex[index] > collateralAddressLength) {

                                        var nameIndex = MathTool.randomNum(0, collateralNames.length - 1);
                                        var collaterals = await Collaterals.new(collateralNames[nameIndex] + collateralIndex,
                                            collateralNames[nameIndex] + collateralIndex + '1.0', accounts[accounts.length - 1]);
        
                                        var amount = await collaterals.balanceOf.call(accounts[accounts.length - 1])
                                        var accountsIndex = 1
                                        while (accountsIndex < (accounts.length - 1)) {
                                            await collaterals.transfer(accounts[accountsIndex], amount);
                                            accountsIndex++;
                                        }

                                        backupAddress.push(collaterals.address);
                                        backupObject[collaterals.address] = collaterals;
                                        tokenAddressList.push(collaterals.address);
                                        collateralIndex++;
                                        
                                    }else{

                                        tokenAddressList.push(collateralAddress[tokenAddressIndex[index] - (randomFlag ?  0 : 1)]);
                                    }
                                }
                                
                                if (tokenWeightListNew.length == 0) {

                                    tokenWeightListNew = DataMethod.createData(weightTest, tokenAddressList.length, tokenAddressList.length);
                                }
                            }

                            console.log('dfStore mint position:');
                            console.log(dfStoreMintPosition.toString());
                            console.log('set backup position:');
                            console.log(mintedPosition);
                            console.log('\n');
                            
                            console.log('tokenAddressIndex:');
                            console.log(tokenAddressIndex);
                            console.log('tokenWeight:');
                            console.log(tokenWeightListNew);
                            console.log('\n');

                            console.log('collateralAddress:');
                            console.log(collateralAddress);
                            console.log('\n');
                            console.log('tokenAddressList:');
                            console.log(tokenAddressList);
                            console.log('\n');
                            tokenWeightList = [];
                            for (let index = 0; index < tokenWeightListNew.length; index++) 
                                tokenWeightList.push(new BN((tokenWeightListNew[index] * 10 ** 18).toLocaleString().replace(/,/g, '')));
                                
                            console.log('input : tokenWeightList:');
                            console.log(tokenWeightList);
                            console.log('\n');

                            runData = {};
                            runData['dfStore'] = dfStoreTimes + 1;
                            runData['runTimes'] = condition + 1;
                            runData['type'] = runType;
                            runData['set position'] = mintedPosition;
                            runData['dfStore mint position'] = dfStoreMintPosition.toString();
                            runData['tokens'] = tokenAddressIndex;
                            runData['weight'] = tokenWeightListNew;
                            try {
                                transactionData = await dfStore.setBackupSection(new BN(mintedPosition.toString()), tokenAddressList, tokenWeightList, {from: owner});
                                setBackupGasUsed = setBackupGasUsed < transactionData.receipt.gasUsed ? transactionData.receipt.gasUsed : setBackupGasUsed;
                                
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['gasUsed'] = transactionData.receipt.gasUsed;
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['result'] = 'success';
                                runData['gasUsed'] = transactionData.receipt.gasUsed;
                                runData['result'] = 'success';
                                runDataList[runDataList.length] = runData;
                                console.log('dfStore ' + (dfStoreTimes + 1) + ' ' + runType + ' runTimes ' + (condition + 1) + ' gasUsed:' + transactionData.receipt.gasUsed + '\n');                            
                            }
                            catch (error) {
                                
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['result'] = 'fail';
                                runConfig[configIndex]['data'][dfStoreIndex]['data'][conditionIndex]['error'] = error.message;
                                
                                runData['result'] = 'fail';
                                runData['error'] = error.message;
                                runDataList[runDataList.length] = runData;
                                console.log(error.message + '\n');
                                condition++;
                                continue;
                            }
                            
                            dfStoreBackupData = await dfStore.getBackupSectionData.call(new BN(mintedPosition.toString()));
                            dfStoreBackupIndex = await dfStore.getBackupSectionIndex.call(dfStoreBackupData[0]);
                            dfStoreSecListBackup = await dfStore.secListBackup.call(dfStoreBackupIndex);

                            console.log('dfStore backup data :');
                            console.log(dfStoreBackupData);
                            console.log(dfStoreBackupData[0]);
                            console.log(dfStoreBackupData[1]);
                            console.log(dfStoreBackupData[2]);
                            console.log('\n');
                            console.log('dfStore backup index :');
                            console.log(dfStoreBackupIndex.toString());
                            console.log('dfStore secListBackup :');
                            console.log(dfStoreSecListBackup);
                            console.log('\n');

                            assert.equal(dfStoreBackupData[0].toString(), mintedPosition.toString());
                            assert.equal(dfStoreBackupData[0].toString(), dfStoreSecListBackup['backupIdx'].toString());

                            for (let index = 0; index < dfStoreBackupData[1].length; index++) {

                                assert.equal(dfStoreBackupData[1][index], tokenAddressList[index]);
                                assert.equal(dfStoreBackupData[2][index].toString(), tokenWeightList[index].toString());
                            }
                            
                            condition++;
                        }
                        break;
                }

                dfStoreTimes++;            
            }

            console.log('setSection max gasUsed:' + setSectionGasUsed);
            console.log('setBackup max gasUsed:' + setBackupGasUsed);

            if (configIndex == runConfig.length - 1) {

                console.log(JSON.stringify(runConfig));
                console.log(JSON.stringify(runDataList));
                
            }

            
        });
    }

});


