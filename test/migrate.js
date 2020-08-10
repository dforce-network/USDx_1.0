/* global artifacts, contract, it, assert */
/* eslint-disable prefer-reflect */

const DSGuard = artifacts.require("DSGuard.sol");
// const DFToken = artifacts.require('DSToken.sol');
const DSToken = artifacts.require("DSToken.sol");
const DFStore = artifacts.require("DFStore.sol");
const DFPool = artifacts.require("DFPool.sol");
const DFCollateral = artifacts.require("DFCollateral.sol");
const DFFunds = artifacts.require("DFFunds.sol");
const PriceFeed = artifacts.require("PriceFeed.sol");
const Medianizer = artifacts.require("Medianizer.sol");

// const DFConvert = artifacts.require('DFConvert.sol');
const DFEngine = artifacts.require("DFEngine.sol");
const DFSetting = artifacts.require("DFSetting.sol");
const DFProtocol = artifacts.require("DFProtocol.sol");
const DFProtocolView = artifacts.require("DFProtocolView.sol");

const Collaterals = artifacts.require("Collaterals_t.sol");
const DSWrappedToken = artifacts.require("DSWrappedToken.sol");

const DFPoolV2 = artifacts.require("DFPoolV2");
const DFEngineV2 = artifacts.require("DFEngineV2");
const DToken = artifacts.require("DToken");
const DTokenController = artifacts.require("DTokenController");
const SupportDToken = require("./supportDToken");

const BN = require("bn.js");
const utils = require("./helpers/Utils");
const MathTool = require("./helpers/MathTool");
const DataMethod = require("./helpers/DataMethod");

// var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC', 'DAITEST', 'PAXTEST', 'TUSDTEST', 'USDCTEST');
// var collateralNames = new Array('DAI', 'PAX', 'TUSD', 'USDC');

// var weightTest = new Array(10, 20, 30, 40, 50, 60, 70, 80, 90, 100);
// var weightTest = new Array(4, 3, 2, 1);
// var weightTest = new Array(10, 30, 30, 30);
var gasPrice = 10 ** 10;
var runTypeArr = new Array(
  "deposit",
  "destroy",
  "withdraw",
  "claim",
  "claimAmount",
  "oneClickMinting",
  "updateSection",
  "changeEngine",
  "setMinBurnAmount",
  "dataMigration"
);
var runUpdateSection = 20;
var updateSectionIndex = 6;
var runDataList = [];
var runData = {};

const UINT256_MAX = new BN("2").pow(new BN("256")).sub(new BN("1"));

contract("USDx", (accounts) => {
  if (typeof runConfig == "undefined") return;

  for (let configIndex = 0; configIndex < runConfig.length; configIndex++) {
    {
      var dSGuard;
      var usdxToken;
      var dfToken;
      var dfStore = [];
      var dfCollateral = [];
      var dfPool = [];
      var dfFunds;
      var priceFeed;
      var medianizer;
      var dfEngine = [];
      var dfSetting = [];
      var dfProtocol = [];
      var dfProtocolView = [];
      var owner;

      var srcTokenAddress = [];
      var srcTokenDecimals = [];
      var srcTokenContract = [];
      var srcTokenIndex;

      var wrapTokenAddress = [];
      var wrapTokenContract = [];

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
      var dfnFee = new BN(
        Number(5 * 10 ** 18)
          .toLocaleString()
          .replace(/,/g, "")
      );

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

    it("Init the deploy contract", async () => {
      var system = 0;

      wrapTokenAddress[system] = [];
      wrapTokenContract[system] = {};

      srcTokenAddress = [];
      srcTokenDecimals = [];
      srcTokenContract = [];
      srcTokenIndex = 0;

      var decimals = 0;
      for (let index = 0; index < collateralNames.length; index++) {
        decimals = MathTool.randomNum(6, 22);
        var collaterals = await Collaterals.new(
          collateralNames[index],
          collateralNames[index] + "1.0",
          accounts[accounts.length - 1],
          decimals
        );

        var amount = await collaterals.balanceOf.call(
          accounts[accounts.length - 1]
        );
        var accountsIndex = 1;
        while (accountsIndex < accounts.length - 1) {
          await collaterals.transfer(accounts[accountsIndex], amount);
          accountsIndex++;
        }
        srcTokenAddress.push(collaterals.address);
        srcTokenDecimals.push(decimals);
        srcTokenContract[collaterals.address] = collaterals;

        var wrappedToken = await DSWrappedToken.new(
          collaterals.address,
          decimals,
          "x" + collateralNames[index]
        );
        wrapTokenAddress[system].push(wrappedToken.address);
        wrapTokenContract[system][wrappedToken.address] = wrappedToken;
      }

      var xTokenWeightList = [];
      for (let index = 0; index < weightTest.length; index++)
        xTokenWeightList[xTokenWeightList.length] = new BN(
          (weightTest[index] * 10 ** 18).toLocaleString().replace(/,/g, "")
        );

      console.log("srcTokenAddress");
      console.log(srcTokenAddress);
      console.log("wrapTokenAddress");
      console.log(wrapTokenAddress[system]);
      console.log("\n");

      console.log("weightTest");
      console.log(weightTest);
      console.log("\n");
      console.log("xTokenWeightList");
      console.log(xTokenWeightList);
      console.log("\n");

      dSGuard = await DSGuard.new();
      usdxToken = await DSToken.new("0x555344780000000000000000000000");
      dfToken = await DSToken.new("0x444600000000000000000000000000");

      dfStore[system] = await DFStore.new(
        wrapTokenAddress[system],
        xTokenWeightList
      );
      dfCollateral[system] = await DFCollateral.new();
      dfPool[system] = await DFPool.new(dfCollateral[system].address);
      dfFunds = await DFFunds.new();
      priceFeed = await PriceFeed.new();
      medianizer = await Medianizer.new();

      dfEngine[system] = await DFEngine.new(
        usdxToken.address,
        dfStore[system].address,
        dfPool[system].address,
        dfCollateral[system].address,
        dfFunds.address
      );
      dfSetting[system] = await DFSetting.new(dfStore[system].address);

      dfProtocol = [];
      dfProtocol[system] = await DFProtocol.new();
      dfProtocolView[system] = await DFProtocolView.new(
        dfStore[system].address,
        dfCollateral[system].address
      );

      for (let index = 0; index < wrapTokenAddress[system].length; index++) {
        await wrapTokenContract[system][
          wrapTokenAddress[system][index]
        ].setAuthority(dfEngine[system].address);
        await dfPool[system].approveToEngine(
          wrapTokenAddress[system][index],
          dfEngine[system].address
        );
        await dfCollateral[system].approveToEngine(
          wrapTokenAddress[system][index],
          dfEngine[system].address
        );
      }

      await usdxToken.setAuthority(dfEngine[system].address);
      await dfToken.setAuthority(dfEngine[system].address);
      await dfStore[system].setAuthority(dSGuard.address);
      await dfCollateral[system].setAuthority(dSGuard.address);
      await dfPool[system].setAuthority(dSGuard.address);
      await dfFunds.setAuthority(dSGuard.address);
      await dfEngine[system].setAuthority(dSGuard.address);
      await dfSetting[system].setAuthority(dSGuard.address);

      await dSGuard.permitx(dfEngine[system].address, dfStore[system].address);
      await dSGuard.permitx(
        dfEngine[system].address,
        dfCollateral[system].address
      );
      await dSGuard.permitx(dfEngine[system].address, dfPool[system].address);
      await dSGuard.permitx(dfEngine[system].address, dfFunds.address);

      await dSGuard.permitx(dfSetting[system].address, dfStore[system].address);
      await dSGuard.permitx(
        dfProtocol[system].address,
        dfEngine[system].address
      );

      await dfSetting[system].setCommissionToken(0, dfToken.address);
      await dfSetting[system].setCommissionMedian(
        dfToken.address,
        medianizer.address
      );
      await dfSetting[system].setCommissionRate(0, 0);
      await dfSetting[system].setCommissionRate(1, 50);
      await medianizer.set(priceFeed.address);
      await priceFeed.post(
        new BN(
          Number(2 * 10 ** 18)
            .toLocaleString()
            .replace(/,/g, "")
        ),
        2058870102,
        medianizer.address
      );

      await dfProtocol[system].requestImplChange(dfEngine[system].address);
      await dfProtocol[system].confirmImplChange();

      amount = Number(1000000 * 10 ** 18)
        .toLocaleString()
        .replace(/,/g, "");
      await dfToken.mint(accounts[0], amount);

      amount = Number(10000 * 10 ** 18)
        .toLocaleString()
        .replace(/,/g, "");
      for (let index = 1; index < accounts.length; index++) {
        await dfToken.transfer(accounts[index], amount);
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

      console.log("contract init finish!!!\n");
    });

    it("Verify USDx System after construction", async () => {
      var system;
      var runType;
      var configTimes = runConfig[configIndex].hasOwnProperty("times")
        ? runConfig[configIndex]["times"]
        : runConfig[configIndex]["data"].length;

      var dfEngineIndex = 0;

      var dfEngineTimes = 0;
      while (dfEngineTimes < configTimes) {
        console.log(
          "config : " +
            (configIndex + 1) +
            " dfEngine : " +
            (dfEngineTimes + 1) +
            "\n"
        );

        dfEngineIndex = dfEngineTimes % runConfig[configIndex]["data"].length;
        runType = runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
          "type"
        )
          ? runConfig[configIndex]["data"][dfEngineIndex]["type"]
          : dfEngineTimes > 0 && dfEngineTimes % runUpdateSection == 0
          ? runTypeArr[updateSectionIndex]
          : runTypeArr[MathTool.randomNum(0, updateSectionIndex - 1)];

        var runTimes = 1;
        if (
          runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty("data")
        ) {
          runTimes =
            runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
        }
        if (
          runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty("times")
        ) {
          runTimes = runConfig[configIndex]["data"][dfEngineIndex]["times"];
        }

        system = runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
          "sys"
        )
          ? runConfig[configIndex]["data"][dfEngineIndex]["sys"] - 1
          : MathTool.randomNum(0, dfProtocol.length - 1);

        console.log(
          "system : " +
            (system + 1) +
            " runType : " +
            runType +
            " runTimes : " +
            runTimes +
            "\n"
        );
        var conditionIndex = 0;
        var condition = 0;
        switch (true) {
          case runType == "deposit":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              dfProtocolMintingSection = await dfProtocolView[
                system
              ].getMintingSection.call();
              var tokenAddressList = dfProtocolMintingSection[0];

              tokenAddress =
                tokenAddressList[
                  MathTool.randomNum(0, tokenAddressList.length - 1)
                ];
              accountAddress =
                accounts[MathTool.randomNum(1, accounts.length - 1)];
              amount = MathTool.randomNum(10, 500);

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                //     system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                //     dfProtocolMintingSection = await dfProtocolView[system].getMintingSection.call();
                //     tokenAddressList = dfProtocolMintingSection[0];
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("tokenAddress")
                ) {
                  tokenAddress =
                    srcTokenAddress[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["tokenAddress"] - 1
                    ];
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("accountAddress")
                ) {
                  accountAddress =
                    accounts[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["accountAddress"]
                    ];
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("amount")
                ) {
                  amount =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["amount"];
                }
              }
              var tokenDecimals =
                srcTokenDecimals[srcTokenAddress.indexOf(tokenAddress)];
              var xTokenAddress = await dfStore[system].getWrappedToken.call(
                tokenAddress
              );
              assert.equal(
                xTokenAddress,
                wrapTokenAddress[system][srcTokenAddress.indexOf(tokenAddress)]
              );
              assert.equal(
                tokenDecimals.toString(),
                (
                  await wrapTokenContract[system][
                    xTokenAddress
                  ].srcDecimals.call()
                ).toString()
              );
              assert.equal(
                tokenAddress,
                await wrapTokenContract[system][
                  xTokenAddress
                ].getSrcERC20.call()
              );

              var amountNB = new BN(
                Number(amount * 10 ** tokenDecimals.toString())
                  .toLocaleString()
                  .replace(/,/g, "")
              );
              var amountReal = await wrapTokenContract[system][
                xTokenAddress
              ].reverseByMultiple.call(
                await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(amountNB)
              );
              console.log(
                "deposit token index : " +
                  (srcTokenAddress.indexOf(tokenAddress) + 1)
              );
              console.log(
                "deposit token name : " +
                  (await srcTokenContract[tokenAddress].name.call())
              );
              console.log("deposit token address : " + tokenAddress);
              console.log(
                "deposit token decimals : " + tokenDecimals.toString()
              );
              console.log(
                "deposit account index : " +
                  (accounts.indexOf(accountAddress) + 1)
              );
              console.log("deposit account address : " + accountAddress);
              console.log("\n");
              console.log("deposit amount");
              console.log(amount);
              console.log(amount.toLocaleString().replace(/,/g, ""));
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");

              accountTokenBalanceOrigin = await srcTokenContract[
                tokenAddress
              ].balanceOf.call(accountAddress);
              var tokenName = await srcTokenContract[tokenAddress].name.call();

              await srcTokenContract[tokenAddress].approve(
                dfPool[system].address,
                new BN(0),
                { from: accountAddress }
              );
              await srcTokenContract[tokenAddress].approve(
                dfPool[system].address,
                amountReal,
                { from: accountAddress }
              );
              console.log(tokenName + " belance:");
              console.log(accountTokenBalanceOrigin);
              console.log(accountTokenBalanceOrigin.toString());
              console.log("\n");

              // await srcTokenContract[tokenAddress].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
              usdxBalanceOrigin = await usdxToken.balanceOf.call(
                accountAddress
              );
              calcDepositorMintTotal = new BN(0);
              if (tokenAddressList.indexOf(tokenAddress) >= 0) {
                calcDepositorMintTotal = await dfProtocolView[
                  system
                ].getUSDXForDeposit.call(tokenAddress, amountNB, {
                  from: accountAddress,
                });
              }
              console.log("usdx total supply origin:");
              console.log(usdxTotalSupplyOrigin);
              console.log(usdxTotalSupplyOrigin.toString());
              console.log("usdx account origin:");
              console.log(usdxBalanceOrigin);
              console.log(usdxBalanceOrigin.toString());
              console.log("get USDx deposit amount:");
              console.log(calcDepositorMintTotal);
              console.log(calcDepositorMintTotal.toString());
              console.log("\n");

              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["accountAddress"] = accounts.indexOf(accountAddress);

              runData["tokenAddress"] =
                srcTokenAddress.indexOf(tokenAddress) + 1;
              runData[tokenName + " balance"] =
                accountTokenBalanceOrigin.toString() /
                10 ** tokenDecimals.toString();
              runData[
                tokenName + " balance BN"
              ] = accountTokenBalanceOrigin.toString();

              runData["USDx balance"] = usdxBalanceOrigin.toString() / 10 ** 18;
              runData["USDx balance BN"] = usdxBalanceOrigin.toString();

              runData["decimals"] = tokenDecimals.toString();
              runData["amount"] = amount;
              runData["amountNB"] = amountNB.toString();
              runData["amount real"] = amountReal.toString();
              try {
                transactionData = await dfProtocol[system].deposit(
                  tokenAddress,
                  new BN(0),
                  amountNB,
                  { from: accountAddress }
                );
                depositGasUsed =
                  depositGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : depositGasUsed;
                depositGasData[depositGasData.length] =
                  transactionData.receipt.gasUsed;

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                // runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              assert.equal(
                (
                  await srcTokenContract[tokenAddress].allowance.call(
                    accountAddress,
                    dfPool[system].address
                  )
                ).toString(),
                "0"
              );

              // await srcTokenContract[tokenAddress].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

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
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );

                dfStoreTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getTokenBalance.call(xTokenAddress);
                dfStoreTokenTotal = dfStoreTokenTotal.add(
                  dfStoreTokenBalance[xTokenAddress]
                );

                dfStoreLockTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getResUSDXBalance.call(xTokenAddress);
                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(
                  dfStoreLockTokenBalance[xTokenAddress]
                );

                dfStoreAccountToken[xTokenAddress] = await dfStore[
                  system
                ].getDepositorBalance.call(accountAddress, xTokenAddress);
                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(
                  dfStoreAccountToken[xTokenAddress]
                );

                dfPoolTokenBalance[xTokenAddress] = await wrapTokenContract[
                  system
                ][xTokenAddress].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotal = dfPoolTokenTotal.add(
                  dfPoolTokenBalance[xTokenAddress]
                );

                dfCollateralTokenBalance[
                  xTokenAddress
                ] = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotal = dfCollateralTokenTotal.add(
                  dfCollateralTokenBalance[xTokenAddress]
                );
              }

              dfStoreTotalCol = await dfStore[system].getTotalCol.call();

              console.log("dfStore token total:");
              console.log(dfStoreTokenBalance);
              console.log(dfStoreTokenTotal);
              console.log(dfStoreTokenTotal.toString());
              console.log("dfStore lock token total:");
              console.log(dfStoreLockTokenBalance);
              console.log(dfStoreLockTokenTotal);
              console.log(dfStoreLockTokenTotal.toString());
              console.log("dfStore account token total:");
              console.log(dfStoreAccountToken);
              console.log(dfStoreAccountTokenTotal);
              console.log(dfStoreAccountTokenTotal.toString());
              console.log("\n");

              console.log("dfPool token total:");
              console.log(dfPoolTokenBalance);
              console.log(dfPoolTokenTotal);
              console.log(dfPoolTokenTotal.toString());
              console.log("\n");

              console.log("dfCollateral token total:");
              console.log(dfCollateralTokenBalance);
              console.log(dfCollateralTokenTotal);
              console.log(dfCollateralTokenTotal.toString());
              console.log(dfStoreTotalCol);
              console.log(dfStoreTotalCol.toString());
              console.log("\n");

              usdxTotalSupply = await usdxToken.totalSupply.call();
              usdxBalance = await usdxToken.balanceOf.call(accountAddress);
              usdxBalanceOfDfPool = await usdxToken.balanceOf.call(
                dfPool[system].address
              );

              console.log("usdx total supply:");
              console.log(usdxTotalSupply);
              console.log(usdxTotalSupply.toString());
              console.log("usdx account:");
              console.log(usdxBalance);
              console.log(usdxBalance.toString());
              console.log("usdx dfPool:");
              console.log(usdxBalanceOfDfPool);
              console.log(usdxBalanceOfDfPool.toString());
              console.log("\n");

              // assert.equal(usdxTotalSupply.toString(), recordTokenTotal.sub(dfStoreTokenTotal.add(dfStoreLockTokenTotal)).toString());
              // assert.equal(usdxTotalSupply.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());
              // assert.equal(usdxBalance.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());
              assert.equal(
                usdxBalanceOfDfPool.toString(),
                dfStoreLockTokenTotal.toString()
              );
              // assert.equal(dfStoreTokenTotal.add(dfStoreLockTokenTotal).toString(), dfPoolTokenTotal.toString());
              assert.equal(
                dfStoreTokenTotal.toString(),
                dfPoolTokenTotal.toString()
              );
              assert.equal(
                usdxTotalSupply.toString(),
                dfCollateralTokenTotal.toString()
              );
              assert.equal(
                usdxTotalSupply.toString(),
                dfStoreTotalCol.toString()
              );
              // assert.equal(recordTokenTotal.toString(), dfStoreTotalCol.add(dfPoolTokenTotal).toString());

              // assert.equal(usdxTotalSupply.sub(usdxTotalSupplyOrigin).toString(), calcDepositorMintTotal.toString());
              assert.equal(
                usdxBalance.sub(usdxBalanceOrigin).toString(),
                calcDepositorMintTotal.toString()
              );

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });

              dfPoolSrcTokenBalance = {};
              dfPoolSrcTokenTotal = new BN(0);
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  dfStoreLockTokenBalance[xTokenAddress].toString()
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );
                withdrawAmount = dfStoreTokenBalance[xTokenAddress].lt(
                  dfStoreAccountToken[xTokenAddress]
                )
                  ? dfStoreTokenBalance[xTokenAddress]
                  : dfStoreAccountToken[xTokenAddress];
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                assert.equal(
                  dfStoreTokenBalance[xTokenAddress].toString(),
                  dfPoolTokenBalance[xTokenAddress].toString()
                );

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = await srcTokenContract[
                  srcTokenAddress[index]
                ].balanceOf.call(dfPool[system].address);
                balanceOfSrcTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(
                  dfPoolSrcTokenBalance[srcTokenAddress[index]]
                );
                dfPoolSrcTokenTotal = dfPoolSrcTokenTotal.add(
                  balanceOfSrcTokens
                );

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = dfPoolSrcTokenBalance[srcTokenAddress[index]].toString();

                assert.equal(
                  balanceOfSrcTokens.toString(),
                  dfPoolTokenBalance[xTokenAddress]
                    .add(dfCollateralTokenBalance[xTokenAddress])
                    .toString()
                );

                // if (recordLockToken.hasOwnProperty(srcTokenAddress[index])) {

                //     assert.equal(
                //         dfStoreLockTokenBalance[srcTokenAddress[index]].toString(),
                //         recordLockToken[srcTokenAddress[index]].toString()
                //         );
                // }

                // if (recordToken.hasOwnProperty(srcTokenAddress[index])) {
                //     assert.equal(
                //         dfStoreTokenBalance[srcTokenAddress[index]].toString(),
                //         recordToken[srcTokenAddress[index]].toString()
                //         );
                // }

                // if (recordAccountMap.hasOwnProperty(srcTokenAddress[index])
                //     && recordAccountMap[srcTokenAddress[index]].hasOwnProperty(accountAddress)
                // ) {
                //     recordAccountMap[srcTokenAddress[index]][accountAddress]
                //     assert.equal(
                //         recordAccountMap[srcTokenAddress[index]][accountAddress].toString(),
                //         dfStoreAccountToken[srcTokenAddress[index]].toString()
                //         );
                // }

                // if (recordDfCollateralToken.hasOwnProperty(srcTokenAddress[index])) {
                //     assert.equal(
                //         dfCollateralTokenBalance[srcTokenAddress[index]].toString(),
                //         recordDfCollateralToken[srcTokenAddress[index]].toString()
                //         );
                // }
              }

              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                dfPoolTokenTotal.add(dfCollateralTokenTotal).toString()
              );
              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                usdxTotalSupply.add(dfStoreTokenTotal).toString()
              );
              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                usdxTotalSupply.add(dfPoolTokenTotal).toString()
              );

              // dfStoreMintPosition = await dfStore[system].getMintPosition.call();
              // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

              dfStoreMintedTotal = await dfStore[system].getTotalMinted.call();
              // assert.equal(dfStoreMintedTotal.toString(), recordMintedTotal.toString());
              assert.equal(
                dfStoreMintedTotal
                  .sub(await dfStore[system].getTotalBurned.call())
                  .toString(),
                usdxTotalSupply.toString()
              );

              // dfStoreMinted = await dfStore[system].getSectionMinted.call(dfStoreMintPosition);
              // assert.equal(
              //     dfStoreMinted.toString(),
              //     recordMinted.hasOwnProperty(recordMintedPosition) ? recordMinted[recordMintedPosition].toString() : '0');

              accountTokenBalanceCurrent = await srcTokenContract[
                tokenAddress
              ].balanceOf.call(accountAddress);
              assert.equal(
                accountTokenBalanceOrigin.sub(amountReal).toString(),
                accountTokenBalanceCurrent.toString()
              );

              runData[tokenName + " balance current"] =
                accountTokenBalanceCurrent.toString() /
                10 ** tokenDecimals.toString();
              runData[
                tokenName + " balance current BN"
              ] = accountTokenBalanceCurrent.toString();

              runData["USDx balance current"] =
                usdxBalance.toString() / 10 ** 18;
              runData["USDx balance current BN"] = usdxBalance.toString();

              runData["pool src token balance"] = dfPoolSrcTokenBalance;

              runDataList[runDataList.length] = runData;
              condition++;
            }
            break;
          case runType == "destroy":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              accountAddress =
                accounts[MathTool.randomNum(1, accounts.length - 1)];

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                // system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                // dfProtocolMintingSection = await dfProtocolView[system].getMintingSection.call();
                // tokenAddressList = dfProtocolMintingSection[0];
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("accountAddress")
                ) {
                  accountAddress =
                    accounts[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["accountAddress"]
                    ];
                }
              }

              dfnBalance = await dfToken.balanceOf.call(accountAddress);
              usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
              usdxBalanceOrigin = await usdxToken.balanceOf.call(
                accountAddress
              );
              console.log("dfn token balance:");
              console.log(dfnBalance);
              console.log(dfnBalance.toString());
              console.log("usdx origin total supply:");
              console.log(usdxTotalSupplyOrigin);
              console.log(usdxTotalSupplyOrigin.toString());
              console.log("usdx origin balance:");
              console.log(usdxBalanceOrigin);
              console.log(usdxBalanceOrigin.toString());
              console.log("\n");

              // amount = MathTool.randomNum(0, Number(usdxBalanceOrigin.mul(new BN(11)).div(new BN(10)).div(new BN(Number(10 ** 10).toLocaleString().replace(/,/g,'')))));
              minBurnAmount = await dfProtocolView[
                system
              ].getDestroyThreshold.call();
              amount = MathTool.randomNum(
                0,
                Number(
                  usdxBalanceOrigin
                    .mul(new BN(11))
                    .div(new BN(10))
                    .div(minBurnAmount)
                )
              );
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("amount")
                ) {
                  amount =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["amount"];
                  amount =
                    amount * 10 ** (18 - (minBurnAmount.toString().length - 1));
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("total") &&
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ]["total"]
                ) {
                  amount = usdxBalanceOrigin;
                }
              }
              // var amountNB = typeof(amount) == 'number' ? new BN((amount * 10 ** 10).toLocaleString().replace(/,/g,'')) : amount;
              var amountNB =
                typeof amount == "number"
                  ? new BN(amount.toLocaleString().replace(/,/g, "")).mul(
                      minBurnAmount
                    )
                  : amount;
              console.log(
                "destroy account index : " + accounts.indexOf(accountAddress)
              );
              console.log("destroy account address : " + accountAddress);
              console.log("create destroy random the amount");
              console.log(amount);
              console.log(amount.toLocaleString().replace(/,/g, ""));
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");
              console.log("min burn amount");
              console.log(minBurnAmount);
              console.log(minBurnAmount.toString());
              console.log("\n");

              burnedTotalOrigin = await dfStore[system].getTotalBurned.call();
              burnedOrigin = await dfStore[system].getSectionBurned.call(
                await dfStore[system].getBurnPosition.call()
              );

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });

              dfStoreTokenTotal = new BN(0);
              dfPoolTokenTotal = new BN(0);
              dfCollateralTokenTotalOrigin = new BN(0);
              dfCollateralTokenBalance = {};
              dfPoolSrcTokenBalance = {};
              dfPoolSrcTokenTotalOrigin = new BN(0);
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );

                balanceOfTokens = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );
                dfStoreTokenTotal = dfStoreTokenTotal.add(balanceOfTokens);

                balanceOfTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotal = dfPoolTokenTotal.add(balanceOfTokens);

                dfCollateralTokenBalance[
                  xTokenAddress
                ] = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(
                  dfCollateralTokenBalance[xTokenAddress]
                );

                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  (
                    await dfStore[system].getResUSDXBalance.call(xTokenAddress)
                  ).toString()
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );
                dfAccountToken = await dfStore[system].getDepositorBalance.call(
                  accountAddress,
                  xTokenAddress
                );

                withdrawAmount = dfTokenBalance.lt(dfAccountToken)
                  ? dfTokenBalance
                  : dfAccountToken;
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                // if (recordDfCollateralToken.hasOwnProperty(xTokenAddress))
                //     assert.equal(recordDfCollateralToken[xTokenAddress].toString(), dfCollateralTokenBalance[xTokenAddress].toString());

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = await srcTokenContract[
                  srcTokenAddress[index]
                ].balanceOf.call(dfPool[system].address);
                balanceOfSrcTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(
                  dfPoolSrcTokenBalance[srcTokenAddress[index]]
                );
                dfPoolSrcTokenTotalOrigin = dfPoolSrcTokenTotalOrigin.add(
                  balanceOfSrcTokens
                );

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = dfPoolSrcTokenBalance[srcTokenAddress[index]].toString();
              }

              dfStoreTotalColOrigin = await dfStore[system].getTotalCol.call();

              assert.equal(
                dfPoolSrcTokenTotalOrigin.toString(),
                dfPoolTokenTotal.add(dfStoreTotalColOrigin).toString()
              );
              if (system == dfProtocol.length - 1) {
                assert.equal(
                  dfPoolSrcTokenTotalOrigin.toString(),
                  usdxTotalSupplyOrigin.add(dfStoreTokenTotal).toString()
                );
                assert.equal(
                  dfPoolSrcTokenTotalOrigin.toString(),
                  usdxTotalSupplyOrigin.add(dfPoolTokenTotal).toString()
                );
              }

              console.log("burned origin token total :");
              console.log(burnedTotalOrigin);
              console.log(burnedTotalOrigin.toString());
              console.log("burned origin token:");
              console.log(burnedOrigin);
              console.log(burnedOrigin.toString());
              console.log("DFCollateral origin token total:");
              console.log(dfCollateralTokenBalance);
              console.log(dfStoreTotalColOrigin);
              console.log(dfStoreTotalColOrigin.toString());
              console.log("\n");

              // assert.equal(recordBurnedTotal.toString(), burnedTotalOrigin.toString());
              // assert.equal(recordBurnedPosition.toString(), (await dfStore[system].getBurnPosition.call()).toString());
              // if (recordBurned.hasOwnProperty(recordBurnedPosition))
              //     assert.equal(recordBurned[recordBurnedPosition].toString(), burnedOrigin.toString());

              // await dfToken.approvex(dfEngine.address, {from: accountAddress});
              await dfToken.approve(dfEngine[system].address, new BN(0), {
                from: accountAddress,
              });
              await dfToken.approve(
                dfEngine[system].address,
                amountNB.mul(new BN(5)).div(new BN(2000)),
                { from: accountAddress }
              );
              await usdxToken.approve(dfEngine[system].address, new BN(0), {
                from: accountAddress,
              });
              await usdxToken.approve(dfEngine[system].address, amountNB, {
                from: accountAddress,
              });
              // await usdxToken.approvex(dfEngine.address, {from: accountAddress});
              var approvals = await usdxToken.allowance.call(
                accountAddress,
                dfEngine[system].address
              );
              console.log("usdx approvals token :");
              console.log(approvals);
              console.log(approvals.toString());
              console.log("\n");
              var approvals = await dfToken.allowance.call(
                accountAddress,
                dfEngine[system].address
              );
              console.log("dfn approvals token :");
              console.log(approvals);
              console.log(approvals.toString());
              console.log("\n");

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["accountAddress"] = accounts.indexOf(accountAddress);
              // runData['amount'] = amount / 10 ** 8;
              runData["amount"] =
                amount / 10 ** (18 - (minBurnAmount.toString().length - 1));
              runData["amountNB"] = amountNB.toString();
              runData["min amount"] = minBurnAmount.toString() / 10 ** 18;
              runData["min amount BN"] = minBurnAmount.toString();
              runData["usdx balance"] = usdxBalanceOrigin.toString() / 10 ** 18;
              runData["usdx balance BN"] = usdxBalanceOrigin.toString();
              runData["pool src token balance"] = dfPoolSrcTokenBalance;
              try {
                transactionData = await dfProtocol[system].destroy(
                  new BN(0),
                  amountNB,
                  { from: accountAddress }
                );
                destroyGasUsed =
                  destroyGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : destroyGasUsed;
                destroyGasData[destroyGasData.length] =
                  transactionData.receipt.gasUsed;

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                // runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              assert.equal(
                (
                  await usdxToken.allowance.call(
                    accountAddress,
                    dfEngine[system].address
                  )
                ).toString(),
                "0"
              );
              assert.equal(
                (
                  await dfToken.allowance.call(
                    accountAddress,
                    dfEngine[system].address
                  )
                ).toString(),
                "0"
              );

              var burnedTokens = [];
              var burnedWeight = [];
              var sumWeight = new BN(0);
              var amountBurned = new BN(0);
              var amountTemp = amountNB;
              console.log(
                "--------------------record destroy burned--------------------"
              );
              console.log(
                "--------------------burned start--------------------\n"
              );
              // while (amountTemp.gt(new BN(0))) {

              //     burnedTokens = [];
              //     burnedWeight = [];
              //     burnedTokens = await dfStore[system].getSectionToken.call(recordBurnedPosition);
              //     burnedWeight = await dfStore[system].getSectionWeight.call(recordBurnedPosition);

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
              //         //     (await srcTokenContract[burnedTokens[index]].balanceOf.call(dfCollateral[system].address)).toString(),
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
              console.log(
                "--------------------burned end--------------------\n"
              );
              // recordBurnedTotal = recordBurnedTotal.add(amountNB);
              // console.log('record: bured total amount:');
              // console.log(recordBurnedTotal);
              // console.log(recordBurnedTotal.toString());

              burnedTotalCurrent = await dfStore[system].getTotalBurned.call();
              burnedCurrent = await dfStore[system].getSectionBurned.call(
                await dfStore[system].getBurnPosition.call()
              );

              dfCollateralTokenTotalCurrent = new BN(0);
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );

                balanceOfTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(
                  balanceOfTokens
                );

                // if (recordDfCollateralToken.hasOwnProperty(srcTokenAddress[index]))
                //     assert.equal(recordDfCollateralToken[srcTokenAddress[index]].toString(), balanceOfTokens.toString());
              }
              dfStoreTotalColCurrent = await dfStore[system].getTotalCol.call();
              console.log("current burned token total :");
              console.log(burnedTotalCurrent);
              console.log(burnedTotalCurrent.toString());
              console.log("current burned token:");
              console.log(burnedCurrent);
              console.log(burnedCurrent.toString());
              console.log("current DFCollateral token total:");
              console.log(dfStoreTotalColCurrent);
              console.log(dfStoreTotalColCurrent.toString());
              console.log("\n");

              // assert.equal(recordBurnedTotal.toString(), burnedTotalCurrent.toString());
              assert.equal(
                burnedTotalOrigin.toString(),
                burnedTotalCurrent.sub(amountNB).toString()
              );
              // assert.equal(recordBurnedPosition.toString(), (await dfStore[system].getBurnPosition.call()).toString());
              // if (recordBurned.hasOwnProperty(recordBurnedPosition))
              //     assert.equal(recordBurned[recordBurnedPosition].toString(), burnedCurrent.toString());

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });

              dfStoreTokenTotal = new BN(0);
              dfPoolTokenTotal = new BN(0);
              dfStoreLockTokenTotal = new BN(0);
              dfStoreAccountTokenTotal = new BN(0);
              dfPoolSrcTokenBalance = {};
              dfPoolSrcTokenTotal = new BN(0);
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );

                balanceOfTokens = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );
                dfStoreTokenTotal = dfStoreTokenTotal.add(balanceOfTokens);

                balanceOfTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotal = dfPoolTokenTotal.add(balanceOfTokens);

                dfAccountToken = await dfStore[system].getDepositorBalance.call(
                  accountAddress,
                  xTokenAddress
                );
                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(
                  dfAccountToken
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                withdrawAmount = balanceOfTokens.lt(dfAccountToken)
                  ? balanceOfTokens
                  : dfAccountToken;
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                balanceOfTokens = await dfStore[system].getResUSDXBalance.call(
                  xTokenAddress
                );
                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(
                  balanceOfTokens
                );

                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  balanceOfTokens.toString()
                );

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = await srcTokenContract[
                  srcTokenAddress[index]
                ].balanceOf.call(dfPool[system].address);
                balanceOfSrcTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(
                  dfPoolSrcTokenBalance[srcTokenAddress[index]]
                );
                dfPoolSrcTokenTotal = dfPoolSrcTokenTotal.add(
                  balanceOfSrcTokens
                );

                dfPoolSrcTokenBalance[
                  srcTokenAddress[index]
                ] = dfPoolSrcTokenBalance[srcTokenAddress[index]].toString();
              }

              console.log("dfStore token total:");
              console.log(dfStoreTokenTotal);
              console.log(dfStoreTokenTotal.toString());
              console.log("dfStore lock token total:");
              console.log(dfStoreLockTokenTotal);
              console.log(dfStoreLockTokenTotal.toString());
              console.log("dfStore account token total:");
              console.log(dfStoreAccountTokenTotal);
              console.log(dfStoreAccountTokenTotal.toString());
              console.log("\n");

              usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
              usdxBalanceCurrent = await usdxToken.balanceOf.call(
                accountAddress
              );
              usdxBalanceOfDfPool = await usdxToken.balanceOf.call(
                dfPool[system].address
              );

              console.log("usdx current total supply:");
              console.log(usdxTotalSupplyCurrent);
              console.log(usdxTotalSupplyCurrent.toString());
              console.log("usdx current balance:");
              console.log(usdxBalanceCurrent);
              console.log(usdxBalanceCurrent.toString());
              console.log("usdx dfPool:");
              console.log(usdxBalanceOfDfPool);
              console.log(usdxBalanceOfDfPool.toString());
              console.log("\n");

              assert.equal(
                usdxTotalSupplyOrigin.toString(),
                dfStoreTotalColOrigin.toString()
              );
              assert.equal(
                usdxTotalSupplyCurrent.toString(),
                dfStoreTotalColCurrent.toString()
              );

              assert.equal(
                burnedTotalCurrent.sub(burnedTotalOrigin).toString(),
                amountNB.toString()
              );
              // assert.equal(burnedCurrent.sub(burnedOrigin).toString(), amountNB.toString());
              assert.equal(
                dfStoreTotalColOrigin.sub(dfStoreTotalColCurrent).toString(),
                amountNB.toString()
              );
              assert.equal(
                usdxTotalSupplyOrigin.sub(usdxTotalSupplyCurrent).toString(),
                amountNB.toString()
              );
              assert.equal(
                usdxBalanceOrigin.sub(usdxBalanceCurrent).toString(),
                amountNB.toString()
              );
              assert.equal(
                usdxBalanceOfDfPool.toString(),
                dfStoreLockTokenTotal.toString()
              );

              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                dfPoolTokenTotal.add(dfStoreTotalColCurrent).toString()
              );
              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                usdxTotalSupplyCurrent.add(dfStoreTokenTotal).toString()
              );
              assert.equal(
                dfPoolSrcTokenTotal.toString(),
                usdxTotalSupplyCurrent.add(dfPoolTokenTotal).toString()
              );

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
              runData["usdx balance current"] =
                usdxBalanceCurrent.toString() / 10 ** 18;
              runData[
                "usdx balance current BN"
              ] = usdxBalanceCurrent.toString();
              runData["pool src token balance current"] = dfPoolSrcTokenBalance;
              runDataList[runDataList.length] = runData;
              condition++;
            }
            break;
          case runType == "withdraw":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              // dfProtocolMintingSection = await dfProtocolView[system].getMintingSection.call();
              // var tokenAddressList = dfProtocolMintingSection[0];

              tokenAddress =
                srcTokenAddress[
                  MathTool.randomNum(0, srcTokenAddress.length - 1)
                ];
              accountAddress =
                accounts[MathTool.randomNum(1, accounts.length - 1)];

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                // system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                // dfProtocolMintingSection = await dfProtocolView[system].getMintingSection.call();
                // tokenAddressList = dfProtocolMintingSection[0];
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("tokenAddress")
                ) {
                  tokenAddress =
                    srcTokenAddress[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["tokenAddress"] - 1
                    ];
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("accountAddress")
                ) {
                  accountAddress =
                    accounts[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["accountAddress"]
                    ];
                }
              }

              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });
              amountTotal =
                dfWithdrawBalances[1][
                  dfWithdrawBalances[0].indexOf(tokenAddress)
                ];
              amount = MathTool.randomNum(
                0,
                Number(amountTotal.mul(new BN(11)).div(new BN(10)))
              );
              // amount = MathTool.randomNum(0, 50);
              var tokenDecimals =
                srcTokenDecimals[srcTokenAddress.indexOf(tokenAddress)];
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("amount")
                ) {
                  amount =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["amount"];
                  amount = amount * 10 ** tokenDecimals.toString();
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("total") &&
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ]["total"]
                ) {
                  amount = amountTotal;
                }
              }
              // var tokenDecimals = srcTokenDecimals[srcTokenAddress.indexOf(tokenAddress)];
              // var amountNB = typeof(amount) == 'number' ? new BN(Number(amount * 10 ** tokenDecimals.toString()).toLocaleString().replace(/,/g,'')) : amount;
              var amountNB =
                typeof amount == "number"
                  ? new BN(amount.toLocaleString().replace(/,/g, ""))
                  : amount;
              var tokenName = await srcTokenContract[tokenAddress].name.call();
              console.log("withdraw token name : " + tokenName);
              console.log("withdraw token address : " + tokenAddress);
              console.log(
                "withdraw token decimals : " + tokenDecimals.toString()
              );
              console.log(
                "withdraw account index : " + accounts.indexOf(accountAddress)
              );
              console.log("withdraw account address : " + accountAddress);
              console.log("\n");
              console.log("create withdraw random the amount");
              console.log(amount);
              console.log(amount.toLocaleString().replace(/,/g, ""));
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");

              xTokenAddress = await dfStore[system].getWrappedToken.call(
                tokenAddress
              );
              var amountReal = await wrapTokenContract[system][
                xTokenAddress
              ].reverseByMultiple.call(
                await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(amountNB)
              );
              dfStoreTokenBalanceOrigin = await dfStore[
                system
              ].getTokenBalance.call(xTokenAddress);
              dfStoreLockTokenBalanceOrigin = await dfStore[
                system
              ].getResUSDXBalance.call(xTokenAddress);
              dfStoreAccountTokenOrigin = await dfStore[
                system
              ].getDepositorBalance.call(accountAddress, xTokenAddress);
              console.log("dfStore origin token total:");
              console.log(dfStoreTokenBalanceOrigin);
              console.log(dfStoreTokenBalanceOrigin.toString());
              console.log("dfStore origin Lock token otal:");
              console.log(dfStoreLockTokenBalanceOrigin);
              console.log(dfStoreLockTokenBalanceOrigin.toString());
              console.log("dfStore origin account token total:");
              console.log(dfStoreAccountTokenOrigin);
              console.log(dfStoreAccountTokenOrigin.toString());
              console.log("\n");
              // if (recordToken.hasOwnProperty(tokenAddress))
              //     assert.equal(dfStoreTokenBalanceOrigin.toString(), recordToken[tokenAddress].toString());

              // if (recordLockToken.hasOwnProperty(tokenAddress))
              //     assert.equal(dfStoreLockTokenBalanceOrigin.toString(), recordLockToken[tokenAddress].toString());

              // if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
              //     assert.equal(dfStoreAccountTokenOrigin.toString(), recordAccountMap[tokenAddress][accountAddress].toString());

              dfPoolTokenBalanceOrigin = await wrapTokenContract[system][
                xTokenAddress
              ].balanceOf.call(dfPool[system].address);
              accountTokenBalanceOrigin = await srcTokenContract[
                tokenAddress
              ].balanceOf.call(accountAddress);
              console.log("dfPool origin token balance:");
              console.log(dfPoolTokenBalanceOrigin);
              console.log(dfPoolTokenBalanceOrigin.toString());
              console.log("account origin token balance:");
              console.log(accountTokenBalanceOrigin);
              console.log(accountTokenBalanceOrigin.toString());
              console.log("\n");

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  (
                    await dfStore[system].getResUSDXBalance.call(xTokenAddress)
                  ).toString()
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );
                dfAccountToken = await dfStore[system].getDepositorBalance.call(
                  accountAddress,
                  xTokenAddress
                );

                withdrawAmount = dfTokenBalance.lt(dfAccountToken)
                  ? dfTokenBalance
                  : dfAccountToken;
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );
              }

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["accountAddress"] = accounts.indexOf(accountAddress);

              runData["tokenAddress"] =
                srcTokenAddress.indexOf(tokenAddress) + 1;
              runData[tokenName + " balance"] =
                accountTokenBalanceOrigin.toString() /
                10 ** tokenDecimals.toString();
              runData[
                tokenName + " balance BN"
              ] = accountTokenBalanceOrigin.toString();

              runData["decimals"] = tokenDecimals.toString();
              runData["amount"] = amount / 10 ** tokenDecimals.toString();
              runData["amountNB"] = amountNB.toString();
              runData["amount real"] = amountReal.toString();
              runData[
                "depositor balance"
              ] = dfStoreAccountTokenOrigin.toString();
              try {
                transactionData = await dfProtocol[
                  system
                ].withdraw(tokenAddress, new BN(0), amountNB, {
                  from: accountAddress,
                });
                withdrawGasUsed =
                  withdrawGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : withdrawGasUsed;
                withdrawGasData[withdrawGasData.length] =
                  transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                // runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  (
                    await dfStore[system].getResUSDXBalance.call(xTokenAddress)
                  ).toString()
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );
                dfAccountToken = await dfStore[system].getDepositorBalance.call(
                  accountAddress,
                  xTokenAddress
                );

                withdrawAmount = dfTokenBalance.lt(dfAccountToken)
                  ? dfTokenBalance
                  : dfAccountToken;
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );
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

              console.log("withdraw Real the amount Min");
              console.log(amountMin);
              console.log(amountMin.toString());
              console.log("\n");

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

              xTokenAddress = await dfStore[system].getWrappedToken.call(
                tokenAddress
              );
              dfStoreTokenBalanceCurrent = await dfStore[
                system
              ].getTokenBalance.call(xTokenAddress);
              dfStoreLockTokenBalanceCurrent = await dfStore[
                system
              ].getResUSDXBalance.call(xTokenAddress);
              dfStoreAccountTokenCurrent = await dfStore[
                system
              ].getDepositorBalance.call(accountAddress, xTokenAddress);
              dfPoolTokenBalanceCurrent = await wrapTokenContract[system][
                xTokenAddress
              ].balanceOf.call(dfPool[system].address);
              accountTokenBalanceCurrent = await srcTokenContract[
                tokenAddress
              ].balanceOf.call(accountAddress);
              // dfCollateralToken = await srcTokenContract[tokenAddress].balanceOf.call(dfCollateral[system].address);
              usdxBalance = await usdxToken.balanceOf.call(accountAddress);

              console.log("dfStore current token total:");
              console.log(dfStoreTokenBalanceCurrent);
              console.log(dfStoreTokenBalanceCurrent.toString());
              console.log("dfStore current token Lock total:");
              console.log(dfStoreLockTokenBalanceCurrent);
              console.log(dfStoreLockTokenBalanceCurrent.toString());
              console.log("dfStore current token account total:");
              console.log(dfStoreAccountTokenCurrent);
              console.log(dfStoreAccountTokenCurrent.toString());
              console.log("\n");
              console.log("dfPool current token balance:");
              console.log(dfPoolTokenBalanceCurrent);
              console.log(dfPoolTokenBalanceCurrent.toString());
              console.log("collateral current account token balance:");
              console.log(accountTokenBalanceCurrent);
              console.log(accountTokenBalanceCurrent.toString());
              console.log("\n");
              // console.log('dfCollateral current token balance:');
              // console.log(dfCollateralToken);
              // console.log(dfCollateralToken.toString());
              console.log("usdx current token balance:");
              console.log(usdxBalance);
              console.log(usdxBalance.toString());
              console.log("\n");

              // if (!recordToken.hasOwnProperty(tokenAddress))
              //     recordToken[tokenAddress] = new BN(0);
              // assert.equal(dfStoreTokenBalanceCurrent.toString(), recordToken[tokenAddress].toString());

              // if (!recordLockToken.hasOwnProperty(tokenAddress))
              //     recordLockToken[tokenAddress] = new BN(0);
              // assert.equal(dfStoreLockTokenBalanceCurrent.toString(), recordLockToken[tokenAddress].toString());

              // if (recordAccountMap.hasOwnProperty(tokenAddress) && recordAccountMap[tokenAddress].hasOwnProperty(accountAddress))
              //     assert.equal(dfStoreAccountTokenCurrent.toString(), recordAccountMap[tokenAddress][accountAddress].toString());

              xAmount = await wrapTokenContract[system][
                xTokenAddress
              ].changeByMultiple.call(amountMin);
              assert.equal(
                dfStoreTokenBalanceOrigin.toString(),
                dfPoolTokenBalanceOrigin.toString()
              );
              assert.equal(
                dfStoreTokenBalanceCurrent.toString(),
                dfPoolTokenBalanceCurrent.toString()
              );
              assert.equal(
                dfStoreTokenBalanceCurrent.toString(),
                dfStoreTokenBalanceOrigin.sub(xAmount).toString()
              );
              assert.equal(
                dfPoolTokenBalanceCurrent.toString(),
                dfPoolTokenBalanceOrigin.sub(xAmount).toString()
              );

              assert.equal(
                dfStoreAccountTokenOrigin.toString(),
                dfStoreAccountTokenCurrent.add(xAmount).toString()
              );
              assert.equal(
                accountTokenBalanceCurrent.toString(),
                accountTokenBalanceOrigin.add(amountMin).toString()
              );

              runData["withdraw amount"] =
                amountMin.toString() / 10 ** tokenDecimals.toString();
              runData["withdraw amount BN"] = amountMin.toString();
              runData[tokenName + " balance current"] =
                accountTokenBalanceCurrent.toString() /
                10 ** tokenDecimals.toString();
              runData[
                tokenName + " balance current BN"
              ] = accountTokenBalanceCurrent.toString();
              runDataList[runDataList.length] = runData;
              condition++;
            }
            break;
          case runType == "claim":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              accountAddress =
                accounts[MathTool.randomNum(1, accounts.length - 1)];

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                //     system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("accountAddress")
                ) {
                  accountAddress =
                    accounts[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["accountAddress"]
                    ];
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
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                // dfStoreTokenBalance[xTokenAddress] = await dfStore[system].getTokenBalance.call(xTokenAddress);
                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[xTokenAddress]);

                dfStoreLockTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getResUSDXBalance.call(xTokenAddress);
                // if (recordLockToken.hasOwnProperty(xTokenAddress))
                //     assert.equal(dfStoreLockTokenBalance[xTokenAddress].toString(), recordLockToken[xTokenAddress].toString());
                dfStoreLockTokenTotalOrigin = dfStoreLockTokenTotalOrigin.add(
                  dfStoreLockTokenBalance[xTokenAddress]
                );

                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  dfStoreLockTokenBalance[xTokenAddress].toString()
                );

                dfStoreAccountToken[xTokenAddress] = await dfStore[
                  system
                ].getDepositorBalance.call(accountAddress, xTokenAddress);
                // if (recordAccountMap.hasOwnProperty(xTokenAddress) && recordAccountMap[xTokenAddress].hasOwnProperty(accountAddress))
                //     assert.equal(dfStoreAccountToken[xTokenAddress].toString(), recordAccountMap[xTokenAddress][accountAddress].toString());
                dfStoreAccountTokenTotalOrigin = dfStoreAccountTokenTotalOrigin.add(
                  dfStoreAccountToken[xTokenAddress]
                );

                tokenClaimAmount[
                  srcTokenAddress[index]
                ] = dfStoreLockTokenBalance[xTokenAddress].lt(
                  dfStoreAccountToken[xTokenAddress]
                )
                  ? dfStoreLockTokenBalance[xTokenAddress]
                  : dfStoreAccountToken[xTokenAddress];

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );

                withdrawAmount = dfTokenBalance.lt(
                  dfStoreAccountToken[xTokenAddress]
                )
                  ? dfTokenBalance
                  : dfStoreAccountToken[xTokenAddress];
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                dfPoolTokenBalance[xTokenAddress] = await wrapTokenContract[
                  system
                ][xTokenAddress].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotalOrigin = dfPoolTokenTotalOrigin.add(
                  dfPoolTokenBalance[xTokenAddress]
                );

                dfCollateralTokenBalance[
                  xTokenAddress
                ] = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotalOrigin = dfCollateralTokenTotalOrigin.add(
                  dfCollateralTokenBalance[xTokenAddress]
                );
              }

              dfStoreTotalColOrigin = await dfStore[system].getTotalCol.call();

              usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
              usdxBalanceOrigin = await usdxToken.balanceOf.call(
                accountAddress
              );
              usdxBalanceOfDfPool = await usdxToken.balanceOf.call(
                dfPool[system].address
              );
              calcMaxClaimAmount = await dfProtocolView[
                system
              ].getUserMaxToClaim.call({ from: accountAddress });

              console.log("dfStore origin lock token total:");
              console.log(dfStoreLockTokenBalance);
              console.log(dfStoreLockTokenTotalOrigin);
              console.log(dfStoreLockTokenTotalOrigin.toString());
              console.log("dfStore origin account token total:");
              console.log(dfStoreAccountToken);
              console.log(dfStoreAccountTokenTotalOrigin);
              console.log(dfStoreAccountTokenTotalOrigin.toString());
              console.log("\n");
              console.log("dfPool origin token total:");
              console.log(dfPoolTokenBalance);
              console.log(dfPoolTokenTotalOrigin);
              console.log(dfPoolTokenTotalOrigin.toString());
              console.log("dfCollateral origin token total:");
              // console.log(dfCollateralTokenBalance);
              console.log(dfStoreTotalColOrigin);
              console.log(dfStoreTotalColOrigin.toString());
              console.log("\n");
              console.log("usdx origin total supply:");
              console.log(usdxTotalSupplyOrigin);
              console.log(usdxTotalSupplyOrigin.toString());
              console.log("usdx origin balance:");
              console.log(usdxBalanceOrigin);
              console.log(usdxBalanceOrigin.toString());
              console.log("usdx dfPool:");
              console.log(usdxBalanceOfDfPool);
              console.log(usdxBalanceOfDfPool.toString());
              console.log("\n");

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["accountAddress"] = accounts.indexOf(accountAddress);
              runData["getMaxToClaim"] = calcMaxClaimAmount.toString();
              runData["usdx_balance origin"] = usdxBalanceOrigin.toString();
              try {
                // transactionData = await dfEngine.withdraw(accountAddress, usdxToken.address, amountNB, {from: accountAddress});
                transactionData = await dfProtocol[system].claim(new BN(0), {
                  from: accountAddress,
                });
                claimGasUsed =
                  claimGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : claimGasUsed;
                claimGasData[claimGasData.length] =
                  transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["usdx_balance current"] = (
                  await usdxToken.balanceOf.call(accountAddress)
                ).toString();
                runData["claim amount"] =
                  runData["usdx_balance current"] -
                  runData["usdx_balance origin"];
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["usdx_balance current"] = (
                  await usdxToken.balanceOf.call(accountAddress)
                ).toString();
                runData["claim amount"] =
                  runData["usdx_balance current"] -
                  runData["usdx_balance origin"];
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              var amountNB = dfStoreAccountTokenTotalOrigin.lt(
                dfStoreLockTokenTotalOrigin
              )
                ? dfStoreAccountTokenTotalOrigin
                : dfStoreLockTokenTotalOrigin;
              console.log(
                "claim account index : " + accounts.indexOf(accountAddress)
              );
              console.log("claim account address : " + accountAddress);
              console.log("\n");
              console.log("create claim the amount");
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");

              amountMin = new BN(0);
              amountMinTotal = new BN(0);
              console.log(
                "--------------------record [claim] claim--------------------"
              );
              console.log(
                "--------------------claim start--------------------\n"
              );
              for (let index = 0; index < srcTokenAddress.length; index++) {
                amountMin = tokenClaimAmount[srcTokenAddress[index]];
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                // if (recordAccountMap.hasOwnProperty(srcTokenAddress[index])
                //     && recordAccountMap[srcTokenAddress[index]].hasOwnProperty(accountAddress)
                //     && recordLockToken.hasOwnProperty(srcTokenAddress[index])
                // )
                // {
                //     amountMin = recordAccountMap[srcTokenAddress[index]][accountAddress].lt(recordLockToken[srcTokenAddress[index]]) ?
                //         recordAccountMap[srcTokenAddress[index]][accountAddress] : recordLockToken[srcTokenAddress[index]];

                //     recordLockToken[srcTokenAddress[index]] = recordLockToken[srcTokenAddress[index]].sub(amountMin);
                //     recordAccountMap[srcTokenAddress[index]][accountAddress] = recordAccountMap[srcTokenAddress[index]][accountAddress].sub(amountMin);
                // }else{

                //     if (!recordLockToken.hasOwnProperty(srcTokenAddress[index]))
                //         recordLockToken[srcTokenAddress[index]] = new BN(0);

                //     if (!recordAccountMap.hasOwnProperty(srcTokenAddress[index])){
                //         recordAccountMap[srcTokenAddress[index]] = {};
                //         recordAccountMap[srcTokenAddress[index]][accountAddress] = new BN(0);
                //     }else if (!recordAccountMap[srcTokenAddress[index]].hasOwnProperty(accountAddress)) {
                //         recordAccountMap[srcTokenAddress[index]][accountAddress] = new BN(0);
                //     }
                // }

                assert.equal(
                  dfStoreLockTokenBalance[xTokenAddress]
                    .sub(amountMin)
                    .toString(),
                  (
                    await dfStore[system].getResUSDXBalance.call(xTokenAddress)
                  ).toString()
                );

                assert.equal(
                  dfStoreAccountToken[xTokenAddress].sub(amountMin).toString(),
                  (
                    await dfStore[system].getDepositorBalance.call(
                      accountAddress,
                      xTokenAddress
                    )
                  ).toString()
                );

                amountMinTotal = amountMinTotal.add(amountMin);

                console.log("--------------- token index : " + index);
                console.log("token address : " + srcTokenAddress[index]);
                console.log("[claim claim] amount " + amountMin);
                // console.log('record: [claim claim] lock token belance:');
                // console.log(recordLockToken[srcTokenAddress[index]]);
                // console.log(recordLockToken[srcTokenAddress[index]].toString());
                // console.log('record: [claim claim] account tokens balance:');
                // console.log(recordAccountMap[srcTokenAddress[index]][accountAddress]);
                // console.log(recordAccountMap[srcTokenAddress[index]][accountAddress].toString());
                console.log("\n");
              }
              console.log(
                "--------------------record [claim] claim end--------------------\n"
              );

              amountNB = amountMinTotal.lt(amountNB)
                ? amountMinTotal
                : amountNB;
              console.log("claim Real the amount");
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");

              // assert.equal(recordMintedTotal.toString(), (await dfStore[system].getTotalMinted.call()).toString());
              // if (recordMinted.hasOwnProperty(recordMintedPosition))
              //     assert.equal(recordMinted[recordMintedPosition].toString(), (await dfStore[system].getSectionMinted.call(await dfStore[system].getMintPosition.call())).toString());
              // else
              //     assert.equal('0', (await dfStore[system].getSectionMinted.call(await dfStore[system].getMintPosition.call())).toString());
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
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                // dfStoreTokenBalance[srcTokenAddress[index]] = await dfStore[system].getTokenBalance.call(srcTokenAddress[index]);
                // dfStoreTokenTotal = dfStoreTokenTotal.add(dfStoreTokenBalance[srcTokenAddress[index]]);

                dfStoreLockTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getResUSDXBalance.call(xTokenAddress);
                // if (recordLockToken.hasOwnProperty(xTokenAddress))
                //     assert.equal(dfStoreLockTokenBalance[xTokenAddress].toString(), recordLockToken[xTokenAddress].toString());
                dfStoreLockTokenTotalCurrent = dfStoreLockTokenTotalCurrent.add(
                  dfStoreLockTokenBalance[xTokenAddress]
                );

                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  dfStoreLockTokenBalance[xTokenAddress].toString()
                );

                dfStoreAccountToken[xTokenAddress] = await dfStore[
                  system
                ].getDepositorBalance.call(accountAddress, xTokenAddress);
                // if (recordAccountMap.hasOwnProperty(xTokenAddress) && recordAccountMap[xTokenAddress].hasOwnProperty(accountAddress))
                //     assert.equal(dfStoreAccountToken[xTokenAddress].toString(), recordAccountMap[xTokenAddress][accountAddress].toString());
                dfStoreAccountTokenTotalCurrent = dfStoreAccountTokenTotalCurrent.add(
                  dfStoreAccountToken[xTokenAddress]
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  xTokenAddress
                );

                withdrawAmount = dfTokenBalance.lt(
                  dfStoreAccountToken[xTokenAddress]
                )
                  ? dfTokenBalance
                  : dfStoreAccountToken[xTokenAddress];
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                dfPoolTokenBalance[xTokenAddress] = await wrapTokenContract[
                  system
                ][xTokenAddress].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotalCurrent = dfPoolTokenTotalCurrent.add(
                  dfPoolTokenBalance[xTokenAddress]
                );

                dfCollateralTokenBalance[
                  xTokenAddress
                ] = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotalCurrent = dfCollateralTokenTotalCurrent.add(
                  dfCollateralTokenBalance[xTokenAddress]
                );
              }

              dfStoreTotalColCurrent = await dfStore[system].getTotalCol.call();

              console.log("dfStore current lock token total:");
              console.log(dfStoreLockTokenBalance);
              console.log(dfStoreLockTokenTotalCurrent);
              console.log(dfStoreLockTokenTotalCurrent.toString());
              console.log("dfStore current account token total:");
              console.log(dfStoreAccountToken);
              console.log(dfStoreAccountTokenTotalCurrent);
              console.log(dfStoreAccountTokenTotalCurrent.toString());
              console.log("\n");
              console.log("dfPool current token total:");
              console.log(dfPoolTokenBalance);
              console.log(dfPoolTokenTotalCurrent);
              console.log(dfPoolTokenTotalCurrent.toString());
              console.log("dfCollateral current token total:");
              console.log(dfCollateralTokenBalance);
              console.log(dfStoreTotalColCurrent);
              console.log(dfStoreTotalColCurrent.toString());
              console.log("\n");

              assert.equal(
                dfStoreLockTokenTotalCurrent.toString(),
                dfStoreLockTokenTotalOrigin.sub(amountNB).toString()
              );
              assert.equal(
                dfStoreAccountTokenTotalCurrent.toString(),
                dfStoreAccountTokenTotalOrigin.sub(amountNB).toString()
              );
              assert.equal(
                dfPoolTokenTotalCurrent.toString(),
                dfPoolTokenTotalOrigin.toString()
              );
              assert.equal(
                dfStoreTotalColCurrent.toString(),
                dfStoreTotalColOrigin.toString()
              );

              usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
              usdxBalanceCurrent = await usdxToken.balanceOf.call(
                accountAddress
              );
              console.log("usdx current total supply:");
              console.log(usdxTotalSupplyCurrent);
              console.log(usdxTotalSupplyCurrent.toString());
              console.log("usdx current balance:");
              console.log(usdxBalanceCurrent);
              console.log(usdxBalanceCurrent.toString());
              console.log("usdx dfPool:");
              console.log(usdxBalanceOfDfPool);
              console.log(usdxBalanceOfDfPool.toString());
              console.log("\n");

              assert.equal(
                usdxTotalSupplyCurrent.toString(),
                usdxTotalSupplyOrigin.toString()
              );
              assert.equal(
                usdxBalanceCurrent.toString(),
                usdxBalanceOrigin.add(amountNB).toString()
              );

              assert.equal(
                usdxBalanceCurrent.toString(),
                usdxBalanceOrigin.add(calcMaxClaimAmount).toString()
              );

              assert.equal(
                usdxBalanceOfDfPool.toString(),
                dfStoreLockTokenTotalOrigin.toString()
              );
              assert.equal(
                usdxBalanceOfDfPool.toString(),
                dfStoreLockTokenTotalCurrent.add(amountNB).toString()
              );

              assert.equal(
                (
                  await usdxToken.balanceOf.call(dfPool[system].address)
                ).toString(),
                dfStoreLockTokenTotalOrigin.sub(amountNB).toString()
              );
              assert.equal(
                (
                  await usdxToken.balanceOf.call(dfPool[system].address)
                ).toString(),
                dfStoreLockTokenTotalCurrent.toString()
              );

              condition++;
            }
            break;
          case runType == "oneClickMinting":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              dfProtocolMintingSection = await dfProtocolView[
                system
              ].getMintingSection.call();
              var tokenAddressList = dfProtocolMintingSection[0];

              accountAddress =
                accounts[MathTool.randomNum(1, accounts.length - 1)];
              amount = MathTool.randomNum(1, 100);
              amount = amount / 2;

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                //     system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                //     dfProtocolMintingSection = await dfProtocolView[system].getMintingSection.call();
                //     tokenAddressList = dfProtocolMintingSection[0];
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("accountAddress")
                ) {
                  accountAddress =
                    accounts[
                      runConfig[configIndex]["data"][dfEngineIndex]["data"][
                        conditionIndex
                      ]["accountAddress"]
                    ];
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("amount")
                ) {
                  amount =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["amount"];
                }
              }
              var amountNB = new BN(
                Number(amount * 10 ** 18)
                  .toLocaleString()
                  .replace(/,/g, "")
              );
              console.log(
                "minting account index : " + accounts.indexOf(accountAddress)
              );
              console.log("minting account address : " + accountAddress);
              console.log("\n");
              console.log("minting amount");
              console.log(amount);
              console.log(amount.toLocaleString().replace(/,/g, ""));
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

              usdxTotalSupplyOrigin = await usdxToken.totalSupply.call();
              usdxBalanceOrigin = await usdxToken.balanceOf.call(
                accountAddress
              );
              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["accountAddress"] = accounts.indexOf(accountAddress) + 1;
              runData["amount"] = amount;
              runData["amountNB"] = amountNB.toString();
              runData["usdxTotalSupplyOrigin"] =
                usdxTotalSupplyOrigin.toString() / 10 ** 18;
              runData[
                "usdxTotalSupplyOrigin BN"
              ] = usdxTotalSupplyOrigin.toString();
              runData["usdxBalanceOrigin"] =
                usdxBalanceOrigin.toString() / 10 ** 18;
              runData["usdxBalanceOrigin BN"] = usdxBalanceOrigin.toString();

              dfProtocolMintingSection = await dfProtocolView[
                system
              ].getMintingSection.call();
              var cwSum = new BN(0);
              runData["weight"] = {};
              for (
                let index = 0;
                index < dfProtocolMintingSection[0].length;
                index++
              ) {
                // assert.equal(dfProtocolMintingSection[0][index], tokenAddressList[index]);
                // assert.equal(dfProtocolMintingSection[1][index].toString(), tokenWeightList[index].toString());
                runData["weight"][index] =
                  dfProtocolMintingSection[1][index].toString() / 10 ** 18;

                cwSum = cwSum.add(dfProtocolMintingSection[1][index]);
              }
              var times = amountNB.div(cwSum);
              var tokenAmount = {};
              var srcTokenAmount = new BN(0);
              accountTokenBalanceMapOrigin = {};
              accountTokenTotalOrigin = new BN(0);
              runData["token amount"] = {};
              runData["token amount BN"] = {};
              for (let index = 0; index < tokenAddressList.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  tokenAddressList[index]
                );

                accountTokenBalanceMapOrigin[
                  tokenAddressList[index]
                ] = await srcTokenContract[
                  tokenAddressList[index]
                ].balanceOf.call(accountAddress);
                balanceOfSrcTokens = await wrapTokenContract[system][
                  xTokenAddress
                ].changeByMultiple.call(
                  accountTokenBalanceMapOrigin[tokenAddressList[index]]
                );
                accountTokenTotalOrigin = accountTokenTotalOrigin.add(
                  balanceOfSrcTokens
                );

                await srcTokenContract[tokenAddressList[index]].approve(
                  dfPool[system].address,
                  new BN(0),
                  { from: accountAddress }
                );
                tokenAmount[tokenAddressList[index]] = amountNB
                  .mul(dfProtocolMintingSection[1][index])
                  .div(cwSum);

                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(tokenAmount[tokenAddressList[index]]);
                console.log("-------------------------");
                console.log("tokenAddress : " + index);
                console.log("srcTokenAmount : " + srcTokenAmount.toString());
                console.log(
                  "decimal : " +
                    (
                      await wrapTokenContract[system][
                        xTokenAddress
                      ].srcDecimals.call()
                    ).toString()
                );
                console.log("-------------------------\n");
                await srcTokenContract[tokenAddressList[index]].approve(
                  dfPool[system].address,
                  srcTokenAmount,
                  { from: accountAddress }
                );
                // await srcTokenContract[tokenAddressList[index]].approvex(dfPool[system].address, {from: accountAddress});

                tokenAmount[tokenAddressList[index]] = srcTokenAmount;
                runData["token amount"][
                  srcTokenAddress.indexOf(tokenAddressList[index])
                ] =
                  srcTokenAmount /
                  10 **
                    (
                      await wrapTokenContract[system][
                        xTokenAddress
                      ].srcDecimals.call()
                    ).toString();
                runData["token amount BN"][
                  srcTokenAddress.indexOf(tokenAddressList[index])
                ] = srcTokenAmount.toString();
              }

              try {
                transactionData = await dfProtocol[
                  system
                ].oneClickMinting(new BN(0), amountNB, {
                  from: accountAddress,
                });
                oneClickMintingGasUsed =
                  oneClickMintingGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : oneClickMintingGasUsed;
                oneClickMintingGasData[oneClickMintingGasData.length] =
                  transactionData.receipt.gasUsed;

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
                usdxBalanceCurrent = await usdxToken.balanceOf.call(
                  accountAddress
                );
                runData["usdxTotalSupplyCurrent"] =
                  usdxTotalSupplyCurrent.toString() / 10 ** 18;
                runData[
                  "usdxTotalSupplyCurrent BN"
                ] = usdxTotalSupplyCurrent.toString();
                runData["usdxBalanceCurrent"] =
                  usdxBalanceCurrent.toString() / 10 ** 18;
                runData[
                  "usdxBalanceCurrent BN"
                ] = usdxBalanceCurrent.toString();
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              // await srcTokenContract[srcTokenAddress[MathTool.randomNum(0, srcTokenAddress.length - 1)]].transfer(dfCollateral[system].address, new BN(MathTool.randomNum(1000, 2000).toString()));

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
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );

                dfStoreTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getTokenBalance.call(xTokenAddress);
                dfStoreTokenTotal = dfStoreTokenTotal.add(
                  dfStoreTokenBalance[xTokenAddress]
                );

                dfStoreLockTokenBalance[xTokenAddress] = await dfStore[
                  system
                ].getResUSDXBalance.call(xTokenAddress);
                dfStoreLockTokenTotal = dfStoreLockTokenTotal.add(
                  dfStoreLockTokenBalance[xTokenAddress]
                );

                dfStoreAccountToken[xTokenAddress] = await dfStore[
                  system
                ].getDepositorBalance.call(accountAddress, xTokenAddress);
                dfStoreAccountTokenTotal = dfStoreAccountTokenTotal.add(
                  dfStoreAccountToken[xTokenAddress]
                );

                dfPoolTokenBalance[xTokenAddress] = await wrapTokenContract[
                  system
                ][xTokenAddress].balanceOf.call(dfPool[system].address);
                dfPoolTokenTotal = dfPoolTokenTotal.add(
                  dfPoolTokenBalance[xTokenAddress]
                );

                dfCollateralTokenBalance[
                  xTokenAddress
                ] = await wrapTokenContract[system][
                  xTokenAddress
                ].balanceOf.call(dfCollateral[system].address);
                dfCollateralTokenTotal = dfCollateralTokenTotal.add(
                  dfCollateralTokenBalance[xTokenAddress]
                );
              }

              dfStoreTotalCol = await dfStore[system].getTotalCol.call();

              console.log("dfStore token total:");
              console.log(dfStoreTokenBalance);
              console.log(dfStoreTokenTotal);
              console.log(dfStoreTokenTotal.toString());
              console.log("dfStore lock token total:");
              console.log(dfStoreLockTokenBalance);
              console.log(dfStoreLockTokenTotal);
              console.log(dfStoreLockTokenTotal.toString());
              console.log("dfStore account token total:");
              console.log(dfStoreAccountToken);
              console.log(dfStoreAccountTokenTotal);
              console.log(dfStoreAccountTokenTotal.toString());
              console.log("\n");

              console.log("dfPool token total:");
              console.log(dfPoolTokenBalance);
              console.log(dfPoolTokenTotal);
              console.log(dfPoolTokenTotal.toString());
              console.log("\n");

              console.log("dfCollateral token total:");
              console.log(dfCollateralTokenBalance);
              console.log(dfStoreTotalCol);
              console.log(dfStoreTotalCol.toString());
              console.log("\n");

              usdxTotalSupplyCurrent = await usdxToken.totalSupply.call();
              usdxBalanceCurrent = await usdxToken.balanceOf.call(
                accountAddress
              );
              usdxBalanceOfDfPool = await usdxToken.balanceOf.call(
                dfPool[system].address
              );

              console.log("usdx current total supply:");
              console.log(usdxTotalSupplyCurrent);
              console.log(usdxTotalSupplyCurrent.toString());
              console.log("usdx current account:");
              console.log(usdxBalanceCurrent);
              console.log(usdxBalanceCurrent.toString());
              console.log("usdx dfPool:");
              console.log(usdxBalanceOfDfPool);
              console.log(usdxBalanceOfDfPool.toString());
              console.log("\n");

              // assert.equal(usdxTotalSupplyCurrent.toString(), recordTokenTotal.sub(dfStoreTokenTotal).toString());
              assert.equal(
                usdxTotalSupplyCurrent.toString(),
                usdxTotalSupplyOrigin.add(amountNB).toString()
              );
              // assert.equal(usdxBalanceCurrent.toString(), recordAccountTotalMap[accountAddress].sub(dfStoreAccountTokenTotal).toString());
              assert.equal(
                usdxBalanceOfDfPool.toString(),
                dfStoreLockTokenTotal.toString()
              );
              assert.equal(
                dfStoreTokenTotal.toString(),
                dfPoolTokenTotal.toString()
              );
              assert.equal(
                usdxTotalSupplyCurrent.toString(),
                dfStoreTotalCol.toString()
              );
              // assert.equal(recordTokenTotal.toString(), dfStoreTotalCol.add(dfPoolTokenTotal).toString());

              assert.equal(
                usdxBalanceCurrent.sub(usdxBalanceOrigin).toString(),
                amountNB.toString()
              );

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();
              dfWithdrawBalances = {};
              dfWithdrawBalances = await dfProtocolView[
                system
              ].getUserWithdrawBalance.call({ from: accountAddress });

              accountTokenBalanceMapCurrent = {};
              accountTokenTotalCurrent = new BN(0);
              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  dfStoreLockTokenBalance[xTokenAddress].toString()
                );

                assert.equal(
                  dfWithdrawBalances[0][index],
                  srcTokenAddress[index]
                );

                withdrawAmount = dfStoreTokenBalance[xTokenAddress].lt(
                  dfStoreAccountToken[xTokenAddress]
                )
                  ? dfStoreTokenBalance[xTokenAddress]
                  : dfStoreAccountToken[xTokenAddress];
                srcTokenAmount = await wrapTokenContract[system][
                  xTokenAddress
                ].reverseByMultiple.call(withdrawAmount);
                assert.equal(
                  dfWithdrawBalances[1][index].toString(),
                  srcTokenAmount.toString()
                );

                assert.equal(
                  dfStoreTokenBalance[xTokenAddress].toString(),
                  dfPoolTokenBalance[xTokenAddress].toString()
                );

                if (
                  accountTokenBalanceMapOrigin.hasOwnProperty(
                    srcTokenAddress[index]
                  )
                ) {
                  accountTokenBalanceMapCurrent[
                    srcTokenAddress[index]
                  ] = await srcTokenContract[
                    srcTokenAddress[index]
                  ].balanceOf.call(accountAddress);
                  balanceOfSrcTokens = await wrapTokenContract[system][
                    xTokenAddress
                  ].changeByMultiple.call(
                    accountTokenBalanceMapCurrent[srcTokenAddress[index]]
                  );
                  accountTokenTotalCurrent = accountTokenTotalCurrent.add(
                    balanceOfSrcTokens
                  );
                  assert.equal(
                    accountTokenBalanceMapOrigin[srcTokenAddress[index]]
                      .sub(tokenAmount[srcTokenAddress[index]])
                      .toString(),
                    accountTokenBalanceMapCurrent[
                      srcTokenAddress[index]
                    ].toString()
                  );
                }
              }
              assert.equal(
                accountTokenTotalOrigin.toString(),
                accountTokenTotalCurrent.add(amountNB).toString()
              );

              // dfStoreMintPosition = await dfStore[system].getMintPosition.call();
              // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

              dfStoreMintedTotal = await dfStore[system].getTotalMinted.call();
              // assert.equal(dfStoreMintedTotal.toString(), recordMintedTotal.toString());
              assert.equal(
                dfStoreMintedTotal
                  .sub(await dfStore[system].getTotalBurned.call())
                  .toString(),
                usdxTotalSupplyCurrent.toString()
              );

              // dfStoreMinted = await dfStore[system].getSectionMinted.call(dfStoreMintPosition);
              // assert.equal(
              //     dfStoreMinted.toString(),
              //     recordMinted.hasOwnProperty(recordMintedPosition) ? recordMinted[recordMintedPosition].toString() : '0');

              condition++;
            }
            break;
          case runType == "updateSection":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);

              var tokenWeightList = DataMethod.createMixIndexData(
                weightTest,
                weightTest.length,
                weightTest.length
              );
              var tokenAddressIndex = DataMethod.createIndex(
                srcTokenAddress,
                tokenWeightList.length - 1,
                tokenWeightList.length - 1
              );
              tokenAddressIndex.push(-1);
              var randomFlag = true;

              var tokenAddressList = [];
              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                //     system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("tokens")
                ) {
                  tokenAddressIndex = [];
                  tokenAddressIndex =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["tokens"];
                  randomFlag = false;
                }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("weight")
                ) {
                  tokenWeightList = [];
                  tokenWeightList =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["weight"];
                }

                for (let index = 0; index < tokenAddressIndex.length; index++) {
                  if (
                    tokenAddressIndex[index] <= (randomFlag ? -1 : 0) ||
                    tokenAddressIndex[index] > srcTokenAddress.length
                  ) {
                    srcTokenIndex++;
                    var nameIndex = MathTool.randomNum(
                      0,
                      collateralNames.length - 1
                    );
                    decimals = MathTool.randomNum(6, 22);
                    var collaterals = await Collaterals.new(
                      collateralNames[nameIndex] + srcTokenIndex,
                      collateralNames[nameIndex] + srcTokenIndex + "1.0",
                      accounts[accounts.length - 1],
                      decimals
                    );

                    var amount = await collaterals.balanceOf.call(
                      accounts[accounts.length - 1]
                    );
                    var accountsIndex = 1;
                    while (accountsIndex < accounts.length - 1) {
                      await collaterals.transfer(
                        accounts[accountsIndex],
                        amount
                      );
                      accountsIndex++;
                    }

                    srcTokenAddress.push(collaterals.address);
                    srcTokenContract[collaterals.address] = collaterals;
                    srcTokenDecimals.push(decimals);
                    tokenAddressList.push(collaterals.address);

                    var wrappedToken = await DSWrappedToken.new(
                      collaterals.address,
                      decimals,
                      "x" + collateralNames[nameIndex] + srcTokenIndex
                    );

                    await wrappedToken.setAuthority(dfEngine[system].address);
                    wrapTokenAddress[system].push(wrappedToken.address);
                    wrapTokenContract[system][
                      wrappedToken.address
                    ] = wrappedToken;
                    // xTokenDecimalsList.push(decimals);

                    await dfPool[system].approveToEngine(
                      wrappedToken.address,
                      dfEngine[system].address
                    );
                    await dfCollateral[system].approveToEngine(
                      wrappedToken.address,
                      dfEngine[system].address
                    );
                  } else {
                    tokenAddressList.push(
                      srcTokenAddress[
                        tokenAddressIndex[index] - (randomFlag ? 0 : 1)
                      ]
                    );
                  }
                }

                if (tokenWeightList.length == 0) {
                  tokenWeightList = DataMethod.createData(
                    weightTest,
                    tokenAddressList.length,
                    tokenAddressList.length
                  );
                }
              }

              console.log("tokenAddressIndex : ");
              console.log(tokenAddressIndex);
              console.log("\n");
              console.log("tokenWeightList : ");
              console.log(tokenWeightList);
              console.log("\n");

              console.log("srcTokenAddress:");
              console.log(srcTokenAddress);
              console.log("\n");
              console.log("tokenAddressList:");
              console.log(tokenAddressList);
              console.log("\n");

              var xTokenAddressList = [];
              var tokenDecimalsList = [];
              var xTokenWeightList = [];
              for (let index = 0; index < tokenWeightList.length; index++) {
                xTokenWeightList[index] = new BN(
                  (tokenWeightList[index] * 10 ** 18)
                    .toLocaleString()
                    .replace(/,/g, "")
                );
                xTokenAddressList.push(
                  wrapTokenAddress[system][
                    srcTokenAddress.indexOf(tokenAddressList[index])
                  ]
                );
                tokenDecimalsList.push(
                  srcTokenDecimals[
                    srcTokenAddress.indexOf(tokenAddressList[index])
                  ]
                );
              }

              console.log("wrapTokenAddress:");
              console.log(wrapTokenAddress[system]);
              console.log("\n");
              console.log("xTokenAddressList:");
              console.log(xTokenAddressList);
              console.log("\n");
              console.log("tokenDecimalsList:");
              console.log(tokenDecimalsList);
              console.log("\n");
              console.log("xTokenWeightList:");
              console.log(xTokenWeightList);
              console.log("\n");

              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["tokens"] = tokenAddressIndex;
              runData["weight"] = tokenWeightList;
              try {
                transactionData = await dfSetting[
                  system
                ].updateMintSection(xTokenAddressList, xTokenWeightList, {
                  from: owner,
                });
                updateGasUsed =
                  updateGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : updateGasUsed;

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;

                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }

              // recordMintedPosition = recordMintedPosition.add(new BN(1));
              dfStoreMintPosition = await dfStore[
                system
              ].getMintPosition.call();
              // console.log('record Minted Position :');
              // console.log(recordMintedPosition);
              // console.log(recordMintedPosition.toString());
              console.log("dfStore mintPosition :");
              console.log(dfStoreMintPosition);
              console.log(dfStoreMintPosition.toString());
              console.log("\n");
              // assert.equal(dfStoreMintPosition.toString(), recordMintedPosition.toString());

              dfStoreTokenAddress = await dfStore[system].getSectionToken.call(
                dfStoreMintPosition
              );
              console.log("dfStore collateral address :");
              console.log(dfStoreTokenAddress);
              console.log("\n");

              dfStoreTokenWeight = await dfStore[system].getSectionWeight.call(
                dfStoreMintPosition
              );
              console.log("dfStore tokens weight :");
              console.log(dfStoreTokenWeight);
              console.log("\n");

              for (let index = 0; index < dfStoreTokenAddress.length; index++) {
                assert.equal(
                  dfStoreTokenAddress[index],
                  xTokenAddressList[index]
                );
                assert.equal(
                  dfStoreTokenAddress[index],
                  await dfStore[system].getWrappedToken.call(
                    tokenAddressList[index]
                  )
                );
                assert.equal(
                  dfStoreTokenWeight[index].toString(),
                  xTokenWeightList[index].toString()
                );
              }

              dfColMaxClaim = {};
              dfColMaxClaim = await dfProtocolView[
                system
              ].getColMaxClaim.call();

              for (let index = 0; index < srcTokenAddress.length; index++) {
                xTokenAddress = await dfStore[system].getWrappedToken.call(
                  srcTokenAddress[index]
                );
                assert.equal(dfColMaxClaim[0][index], srcTokenAddress[index]);
                assert.equal(
                  dfColMaxClaim[1][index].toString(),
                  (
                    await dfStore[system].getResUSDXBalance.call(xTokenAddress)
                  ).toString()
                );
                assert.equal(
                  (
                    await wrapTokenContract[system][
                      xTokenAddress
                    ].balanceOf.call(dfPool[system].address)
                  ).toString(),
                  (
                    await dfStore[system].getTokenBalance.call(xTokenAddress)
                  ).toString()
                );
                // if(recordToken.hasOwnProperty(xTokenAddress))
                //     assert.equal(recordToken[xTokenAddress].toString(), (await dfStore[system].getTokenBalance.call(xTokenAddress)).toString());

                // if(recordLockToken.hasOwnProperty(xTokenAddress))
                //     assert.equal(recordLockToken[xTokenAddress].toString(), (await dfStore[system].getResUSDXBalance.call(xTokenAddress)).toString());

                assert.equal(
                  await dfStore[system].getMintedToken.call(xTokenAddress),
                  true
                );
                if (dfStoreTokenAddress.indexOf(xTokenAddress) >= 0)
                  assert.equal(
                    await dfStore[system].getMintingToken.call(xTokenAddress),
                    true
                  );
                else
                  assert.equal(
                    await dfStore[system].getMintingToken.call(xTokenAddress),
                    false
                  );
              }
              condition++;
            }
            break;
          case runType == "changeEngine":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);

              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              // if(runConfig[configIndex]['data'][dfEngineIndex].hasOwnProperty('data')){

              //     if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

              //         system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
              //     }
              // }

              dfEngineNew = await DFEngine.new(
                usdxToken.address,
                dfStore[system].address,
                dfPool[system].address,
                dfCollateral[system].address,
                dfFunds.address
              );

              await usdxToken.setAuthority(dfEngineNew.address);
              await dfToken.setAuthority(dfEngineNew.address);
              // await dfStore[system].setAuthority(dSGuard.address);
              // await dfCollateral[system].setAuthority(dSGuard.address);
              // await dfPool[system].setAuthority(dSGuard.address);
              // await dfFunds.setAuthority(dSGuard.address);
              await dfEngineNew.setAuthority(dSGuard.address);

              await dSGuard.permitx(
                dfEngineNew.address,
                dfStore[system].address
              );
              await dSGuard.permitx(
                dfEngineNew.address,
                dfCollateral[system].address
              );
              await dSGuard.permitx(
                dfEngineNew.address,
                dfPool[system].address
              );
              await dSGuard.permitx(dfEngineNew.address, dfFunds.address);

              await dSGuard.forbidx(
                dfEngine[system].address,
                dfStore[system].address
              );
              await dSGuard.forbidx(
                dfEngine[system].address,
                dfCollateral[system].address
              );
              await dSGuard.forbidx(
                dfEngine[system].address,
                dfPool[system].address
              );
              await dSGuard.forbidx(dfEngine[system].address, dfFunds.address);
              await dSGuard.forbidx(
                dfProtocol[system].address,
                dfEngine[system].address
              );

              dfProtocolMintingSection = await dfProtocolView[
                system
              ].getMintingSection.call();
              var tokenAddressList = dfProtocolMintingSection[0];
              var tokenAddress =
                tokenAddressList[
                  MathTool.randomNum(0, tokenAddressList.length - 1)
                ];

              var accountAddress =
                accounts[MathTool.randomNum(0, accounts.length - 1)];

              var amount = MathTool.randomNum(1, 5);
              var amountNB = new BN(
                Number(amount * 10 ** 18)
                  .toLocaleString()
                  .replace(/,/g, "")
              );
              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["testType"] = "deposit";
              runData["tokenAddress"] =
                srcTokenAddress.indexOf(tokenAddress) + 1;
              runData["accountAddress"] = accounts.indexOf(accountAddress) + 1;
              runData["amount"] = amount;
              runData["amountNB"] = amountNB.toString();
              runData[
                (await srcTokenContract[tokenAddress].name.call()) + " balance"
              ] = accountTokenBalanceOrigin.toString();
              try {
                transactionData = await dfProtocol[system].deposit(
                  tokenAddress,
                  new BN(0),
                  amountNB,
                  { from: accountAddress }
                );
                depositGasUsed =
                  depositGasUsed < transactionData.receipt.gasUsed
                    ? transactionData.receipt.gasUsed
                    : depositGasUsed;
                depositGasData[depositGasData.length] =
                  transactionData.receipt.gasUsed;

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
              }

              dfEngine[system] = dfEngineNew;
              await dSGuard.permitx(
                dfProtocol[system].address,
                dfEngine[system].address
              );
              await dfProtocol[system].requestImplChange(
                dfEngine[system].address
              );
              await dfProtocol[system].confirmImplChange();
              console.log("dfEngine new address : " + dfEngine[system].address);
              console.log("\n");
              condition++;
            }
            break;
          case runType == "setMinBurnAmount":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );

              // var system = MathTool.randomNum(0, dfProtocol.length - 1);
              amount = MathTool.randomNum(1, 10) / 10;
              conditionIndex =
                condition %
                runConfig[configIndex]["data"][dfEngineIndex]["data"].length;
              if (
                runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
                  "data"
                )
              ) {
                // if (runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex].hasOwnProperty('sys')) {

                //     system = runConfig[configIndex]['data'][dfEngineIndex]['data'][conditionIndex]['sys'] - 1;
                // }

                if (
                  runConfig[configIndex]["data"][dfEngineIndex]["data"][
                    conditionIndex
                  ].hasOwnProperty("amount")
                ) {
                  amount =
                    runConfig[configIndex]["data"][dfEngineIndex]["data"][
                      conditionIndex
                    ]["amount"];
                }
              }
              var amountNB = new BN(
                Number(amount * 10 ** 18)
                  .toLocaleString()
                  .replace(/,/g, "")
              );
              console.log("min burn amount");
              console.log(amount);
              console.log(amount.toLocaleString().replace(/,/g, ""));
              console.log(amountNB);
              console.log(amountNB.toString());
              console.log("\n");
              runData = {};
              runData["dfEngine"] = dfEngineTimes + 1;
              runData["runTimes"] = condition + 1;
              runData["system"] = system + 1;
              runData["type"] = runType;
              runData["amount"] = amount;
              runData["amountNB"] = amountNB.toString();
              try {
                transactionData = await dfSetting[
                  system
                ].setDestroyThreshold(amountNB, { from: owner });

                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["gasUsed"] = transactionData.receipt.gasUsed;
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "success";
                runData["gasUsed"] = transactionData.receipt.gasUsed;
                runData["gasUsed ETH"] =
                  (transactionData.receipt.gasUsed * gasPrice) / 10 ** 18;
                runData["result"] = "success";
                runDataList[runDataList.length] = runData;
                console.log(
                  "dfEngine " +
                    (dfEngineTimes + 1) +
                    " " +
                    runType +
                    " runTimes " +
                    (condition + 1) +
                    " gasUsed:" +
                    transactionData.receipt.gasUsed +
                    "\n"
                );
              } catch (error) {
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["result"] = "fail";
                runConfig[configIndex]["data"][dfEngineIndex]["data"][
                  conditionIndex
                ]["error"] = error.message;
                runData["result"] = "fail";
                runData["error"] = error.message;
                runDataList[runDataList.length] = runData;
                console.log(error.message + "\n");
                condition++;
                continue;
              }
              assert.equal(
                (
                  await dfProtocol[system].getDestroyThreshold.call()
                ).toString(),
                amountNB.toString()
              );
              condition++;
            }
            break;
          case runType == "dataMigration":
            while (condition < runTimes) {
              console.log(
                "config : " +
                  (configIndex + 1) +
                  " dfEngine : " +
                  (dfEngineTimes + 1) +
                  " runType : " +
                  runType +
                  " runTimes " +
                  (condition + 1) +
                  "\n"
              );
              var system = dfProtocol.length - 1;
              var systemNew = system + 1;
              await dSGuard.forbidx(
                dfProtocol[system].address,
                dfEngine[system].address
              );

              dfCollateral[systemNew] = await DFCollateral.new();
              dfPool[systemNew] = await DFPool.new(
                dfCollateral[systemNew].address
              );
              var mintedTokenList = await dfStore[
                system
              ].getMintedTokenList.call();
              var srcToken;
              var decimals;
              var srcName;
              var wrappedToken;
              var mintedTokenMap = {};
              wrapTokenAddress[systemNew] = [];
              wrapTokenContract[systemNew] = {};
              dfCollateralTokenBalance = {};
              for (let index = 0; index < mintedTokenList.length; index++) {
                assert.equal(
                  wrapTokenAddress[system][index],
                  mintedTokenList[index]
                );
                srcToken = await wrapTokenContract[system][
                  mintedTokenList[index]
                ].getSrcERC20.call();
                decimals = await wrapTokenContract[system][
                  mintedTokenList[index]
                ].srcDecimals.call();
                srcName = await srcTokenContract[srcToken].symbol.call();
                wrappedToken = await DSWrappedToken.new(
                  srcToken,
                  decimals,
                  "x2" + srcName
                );

                wrapTokenAddress[systemNew].push(wrappedToken.address);
                wrapTokenContract[systemNew][
                  wrappedToken.address
                ] = wrappedToken;
                mintedTokenMap[mintedTokenList[index]] = wrappedToken.address;

                // balanceOfTokens = await wrapTokenContract[system][mintedTokenList[index]].balanceOf.call(dfCollateral[system].address);
                // dfCollateralTokenBalance[mintedTokenList[index]] = balanceOfTokens.sub(await dfStore.getResUSDXBalance.call(mintedTokenList[index]));
                // await wrappedToken.wrap(dfCollateral[systemNew].address, await wrapTokenContract[system][mintedTokenList[index]].reverseByMultiple.call(dfCollateralTokenBalance[mintedTokenList[index]]));
                // await wrapTokenContract[system][mintedTokenList[index]].unwrap(dfCollateral[system].address, dfCollateralTokenBalance[mintedTokenList[index]]);
                // dfStoreTotalCol = dfStoreTotalCol.add(dfCollateralTokenBalance[mintedTokenList[index]]);

                balanceOfTokens = await wrapTokenContract[system][
                  mintedTokenList[index]
                ].balanceOf.call(dfCollateral[system].address);
                await wrappedToken.wrap(
                  dfCollateral[systemNew].address,
                  await wrapTokenContract[system][
                    mintedTokenList[index]
                  ].reverseByMultiple.call(balanceOfTokens)
                );
                await dfCollateral[system].approveToEngine(
                  mintedTokenList[index],
                  owner
                );
                await wrapTokenContract[system][mintedTokenList[index]].unwrap(
                  dfCollateral[system].address,
                  balanceOfTokens
                );

                balanceOfTokens = await srcTokenContract[
                  srcToken
                ].balanceOf.call(dfPool[system].address);
                dfTokenBalance = await dfStore[system].getTokenBalance.call(
                  mintedTokenList[index]
                );
                balanceOfTokens = balanceOfTokens.sub(
                  await wrapTokenContract[system][
                    mintedTokenList[index]
                  ].reverseByMultiple.call(dfTokenBalance)
                );
                await dfPool[system].transferOut(
                  srcToken,
                  dfPool[systemNew].address,
                  balanceOfTokens
                );
              }

              var sectionData = await dfStore[system].getSectionData.call(
                new BN(0)
              );
              var xTokenAddressList = [];
              for (let index = 0; index < sectionData[3].length; index++)
                xTokenAddressList[index] =
                  mintedTokenMap[sectionData[3][index]];

              dfStore[systemNew] = await DFStore.new(
                xTokenAddressList,
                sectionData[4]
              );
              await dfStore[systemNew].setSectionMinted(
                new BN(0),
                sectionData[0]
              );
              await dfStore[systemNew].setSectionBurned(
                new BN(0),
                sectionData[1]
              );

              // await dfStore[systemNew].setTotalCol(dfStoreTotalCol);
              await dfStore[systemNew].setTotalCol(
                await dfStore[system].getTotalCol.call()
              );
              await dfStore[system].setTotalCol(new BN(0));

              await dfStore[systemNew].setTotalMinted(
                await dfStore[system].getTotalMinted.call()
              );
              await dfStore[systemNew].setTotalBurned(
                await dfStore[system].getTotalBurned.call()
              );

              await dfStore[systemNew].setMinBurnAmount(
                await dfStore[system].getMinBurnAmount.call()
              );

              // await dfStore[systemNew].setTokenMedian(dfToken.address, medianizer.address);
              // await dfStore[systemNew].setFeeRate(new BN(0), await dfStore[system].getFeeRate.call(new BN(0)));
              // await dfStore[systemNew].setFeeRate(new BN(1), await dfStore[system].getFeeRate.call(new BN(1)));
              // await dfStore[systemNew].setTypeToken(new BN(0), await dfStore[system].getTypeToken.call(new BN(0)));
              // await dfStore[systemNew].setTypeToken(new BN(1), await dfStore[system].getTypeToken.call(new BN(1)));

              var mintPosition = await dfStore[system].getMintPosition.call();
              condition = new BN(1);
              while (condition.lte(mintPosition)) {
                sectionData = await dfStore[system].getSectionData.call(
                  condition
                );
                xTokenAddressList = [];
                for (let index = 0; index < sectionData[3].length; index++)
                  xTokenAddressList[index] =
                    mintedTokenMap[sectionData[3][index]];

                await dfStore[systemNew].setSection(
                  xTokenAddressList,
                  sectionData[4]
                );
                await dfStore[systemNew].setSectionMinted(
                  condition,
                  sectionData[0]
                );
                await dfStore[systemNew].setSectionBurned(
                  condition,
                  sectionData[1]
                );
                condition = condition.add(new BN(1));
              }

              dfEngine[systemNew] = await DFEngine.new(
                usdxToken.address,
                dfStore[systemNew].address,
                dfPool[systemNew].address,
                dfCollateral[systemNew].address,
                dfFunds.address
              );
              dfSetting[systemNew] = await DFSetting.new(
                dfStore[systemNew].address
              );

              dfProtocol[systemNew] = await DFProtocol.new();
              dfProtocolView[systemNew] = await DFProtocolView.new(
                dfStore[systemNew].address,
                dfCollateral[systemNew].address
              );

              for (
                let index = 0;
                index < wrapTokenAddress[systemNew].length;
                index++
              ) {
                await wrapTokenContract[systemNew][
                  wrapTokenAddress[systemNew][index]
                ].setAuthority(dfEngine[systemNew].address);
                await dfPool[systemNew].approveToEngine(
                  wrapTokenAddress[systemNew][index],
                  dfEngine[systemNew].address
                );
                await dfCollateral[systemNew].approveToEngine(
                  wrapTokenAddress[systemNew][index],
                  dfEngine[systemNew].address
                );
              }

              await usdxToken.setAuthority(dfEngine[systemNew].address);
              await dfToken.setAuthority(dfEngine[systemNew].address);

              await dfStore[systemNew].setAuthority(dSGuard.address);
              await dfCollateral[systemNew].setAuthority(dSGuard.address);
              await dfPool[systemNew].setAuthority(dSGuard.address);
              await dfEngine[systemNew].setAuthority(dSGuard.address);
              await dfSetting[systemNew].setAuthority(dSGuard.address);

              await dSGuard.permitx(
                dfEngine[systemNew].address,
                dfStore[systemNew].address
              );
              await dSGuard.permitx(
                dfEngine[systemNew].address,
                dfCollateral[systemNew].address
              );
              await dSGuard.permitx(
                dfEngine[systemNew].address,
                dfPool[systemNew].address
              );
              await dSGuard.permitx(
                dfEngine[systemNew].address,
                dfFunds.address
              );

              await dSGuard.permitx(
                dfSetting[systemNew].address,
                dfStore[systemNew].address
              );
              await dSGuard.permitx(
                dfProtocol[systemNew].address,
                dfEngine[systemNew].address
              );

              await dfSetting[systemNew].setCommissionToken(0, dfToken.address);
              await dfSetting[systemNew].setCommissionMedian(
                dfToken.address,
                medianizer.address
              );
              await dfSetting[systemNew].setCommissionRate(0, 0);
              await dfSetting[systemNew].setCommissionRate(1, 50);

              await dfProtocol[systemNew].requestImplChange(
                dfEngine[systemNew].address
              );
              await dfProtocol[systemNew].confirmImplChange();

              var signature = {};
              for (let index = 0; index < dfEngine[system].abi.length; index++)
                signature[dfEngine[system].abi[index].name] =
                  dfEngine[system].abi[index].signature;

              await dSGuard.permit(
                dfProtocol[system].address,
                dfEngine[system].address,
                signature.withdraw
              );
              await dSGuard.permit(
                dfProtocol[system].address,
                dfEngine[system].address,
                signature.claim
              );
            }
            break;
        }

        dfEngineTimes++;
      }

      console.log(
        "deposit max gasUsed:" +
          depositGasUsed +
          ":[" +
          (depositGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "destroy max gasUsed:" +
          destroyGasUsed +
          ":[" +
          (destroyGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "withdraw max gasUsed:" +
          withdrawGasUsed +
          ":[" +
          (withdrawGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "claim max gasUsed:" +
          claimGasUsed +
          ":[" +
          (claimGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "claimAmount max gasUsed:" +
          claimAmountGasUsed +
          ":[" +
          (claimAmountGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "update max gasUsed:" +
          updateGasUsed +
          ":[" +
          (updateGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );
      console.log(
        "oneClickMinting max gasUsed:" +
          oneClickMintingGasUsed +
          ":[" +
          (oneClickMintingGasUsed * gasPrice) / 10 ** 18 +
          "]"
      );

      console.log("\ndeposit gas data:");
      console.log(depositGasData);
      console.log("\ndestroy gas data:");
      console.log(destroyGasData);
      console.log("\nwithdraw gas data:");
      console.log(withdrawGasData);
      console.log("\nclaim gas data:");
      console.log(claimGasData);
      console.log("\nclaimAmount gas data:");
      console.log(claimAmountGasData);
      console.log("\noneClickMinting gas data:");
      console.log(oneClickMintingGasData);

      if (configIndex == runConfig.length - 1) {
        if (
          runConfig[configIndex]["data"][dfEngineIndex].hasOwnProperty(
            "verify"
          ) &&
          runConfig[configIndex]["data"][dfEngineIndex]["verify"]
        ) {
          var wrapTokenList = [];
          for (
            let systemIndex = 0;
            systemIndex < dfProtocol.length;
            systemIndex++
          ) {
            console.log("system : " + (systemIndex + 1) + " data!!!");
            var wrapTokenList = await dfStore[
              systemIndex
            ].getMintedTokenList.call();
            console.log("wrapTokenList\n");
            console.log(wrapTokenList);
            console.log("\n");
            var srcToken;
            for (let index = 0; index < wrapTokenList.length; index++) {
              console.log("wrap token---------------------------------");
              console.log(wrapTokenList[index]);
              console.log("\n");

              srcToken = await wrapTokenContract[systemIndex][
                wrapTokenList[index]
              ].getSrcERC20.call();
              balanceOfTokens = await srcTokenContract[srcToken].balanceOf.call(
                dfPool[systemIndex].address
              );

              console.log("src token : " + srcToken);
              console.log("dfpool src token balance : " + balanceOfTokens);
              assert.equal(balanceOfTokens.toString(), "0");

              console.log("wrap token : " + wrapTokenList[index]);

              balanceOfTokens = await wrapTokenContract[systemIndex][
                wrapTokenList[index]
              ].balanceOf.call(dfPool[systemIndex].address);
              console.log("dfpool wrap token balance : " + balanceOfTokens);
              assert.equal(balanceOfTokens.toString(), "0");
              balanceOfTokens = await wrapTokenContract[systemIndex][
                wrapTokenList[index]
              ].balanceOf.call(dfCollateral[systemIndex].address);
              console.log(
                "dfCollateral wrap token balance : " + balanceOfTokens
              );
              assert.equal(balanceOfTokens.toString(), "0");

              dfTokenBalance = await dfStore[systemIndex].getTokenBalance.call(
                wrapTokenList[index]
              );
              console.log("dfStore poolBalance : " + dfTokenBalance);
              assert.equal(dfTokenBalance.toString(), "0");

              dfTokenBalance = await dfStore[
                systemIndex
              ].getResUSDXBalance.call(wrapTokenList[index]);
              console.log("dfStore resUSDXBalance : " + dfTokenBalance);
              assert.equal(dfTokenBalance.toString(), "0");

              console.log("\n");

              console.log("accounts--------------------\n");
              for (let i = 0; i < accounts.length; i++) {
                dfTokenBalance = await dfStore[
                  systemIndex
                ].getDepositorBalance.call(accounts[i], wrapTokenList[index]);
                console.log("account : " + i);
                console.log("dfStore depositorsBalance : " + dfTokenBalance);
                assert.equal(dfTokenBalance.toString(), "0");
              }
            }

            console.log("------------------------------\n");
          }

          console.log("usdx totalSupply : ");
          console.log((await usdxToken.totalSupply.call()).toString());
          assert.equal((await usdxToken.totalSupply.call()).toString(), "0");
        }

        console.log(JSON.stringify(runConfig));
        console.log(JSON.stringify(runDataList));
      }
    });
  }

  it("Verify Pool & Engine V2 Migration", async () => {
    let system = 0;
    let contracts = {};
    contracts.funds = dfFunds;
    contracts.guard = dSGuard;
    contracts.usdxToken = usdxToken;
    contracts.dfToken = dfToken;
    contracts.protocol = dfProtocol[system];
    contracts.collateral = dfCollateral[system];
    contracts.store = dfStore[system];
    contracts.protocolView = dfProtocolView[system];
    contracts.poolV1 = dfPool[system];

    contracts.srcTokens = srcTokenAddress.map(function (addr) {
      return srcTokenContract[addr];
    });

    contracts.dTokenController = await DTokenController.new();

    contracts.poolV2 = await DFPoolV2.new(
      contracts.collateral.address,
      contracts.poolV1.address,
      contracts.dTokenController.address
    );
    contracts.engineV2 = await DFEngineV2.new(
      contracts.usdxToken.address,
      contracts.store.address,
      contracts.poolV2.address,
      contracts.collateral.address,
      contracts.funds.address
    );

    let claimableList = await SupportDToken.getClaimableList(
      contracts.protocolView,
      accounts
    );

    await SupportDToken.deployDTokens(
      contracts.srcTokens,
      contracts.dTokenController
    );
    await SupportDToken.migrate(contracts);
    await SupportDToken.updateEngineAndPool(contracts, accounts);
    await SupportDToken.depositAndWithdraw(contracts, accounts);
    await SupportDToken.claim(contracts, claimableList);
    await SupportDToken.destroy(contracts, accounts);
    await SupportDToken.oneClickMinting(contracts, accounts);
  });
});
