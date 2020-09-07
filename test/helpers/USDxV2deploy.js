const DSGuard = artifacts.require("DSGuard.sol");
const DSToken = artifacts.require("DSToken.sol");
const DFStore = artifacts.require("DFStore.sol");
const DFPool = artifacts.require("DFPoolV2.sol");
const DFCollateral = artifacts.require("DFCollateral.sol");
const DFFunds = artifacts.require("DFFunds.sol");
const PriceFeed = artifacts.require("PriceFeed.sol");
const Medianizer = artifacts.require("Medianizer.sol");
const DFEngine = artifacts.require("DFEngineV2.sol");
const DFSetting = artifacts.require("DFSetting.sol");
const DFProtocol = artifacts.require("DFProtocol.sol");
const DFProtocolView = artifacts.require("DFProtocolView.sol");
const Collaterals = artifacts.require("Collaterals_t.sol");
const DSWrappedToken = artifacts.require("DSWrappedToken.sol");
const DToken = artifacts.require("DToken");
const DTokenController = artifacts.require("DTokenController");

const BN = require("bn.js");
const utils = require("./Utils.js");
const MathTool = require("./MathTool.js");
const DataMethod = require("./DataMethod.js");
const supportDToken = require("../supportDToken.js");
const { MAX_UINT256 } = require("@openzeppelin/test-helpers/src/constants");

let gasPrice = 10 ** 10;

let wrapTokenAddress = [];
let wrapTokens = [];

let srcTokenAddress = [];
let srcTokenDecimals = [];
let srcTokens = [];

async function deployCollateralAndWrappedToken(accounts, name) {
  decimals = MathTool.randomNum(6, 22);
  let collateral = await Collaterals.new(
    name,
    name + "1.0",
    accounts[accounts.length - 1],
    decimals
  );

  let amount = await collateral.balanceOf(accounts[accounts.length - 1]);
  for (const account of accounts) {
    await collateral.transfer(account, amount);
  }

  srcTokenAddress.push(collateral.address);
  srcTokenDecimals.push(decimals);
  srcTokens.push(collateral);

  let wrappedToken = await DSWrappedToken.new(
    collateral.address,
    decimals,
    web3.utils.hexToBytes(web3.utils.asciiToHex("x" + name))
  );
  wrapTokenAddress.push(wrappedToken.address);
  wrapTokens.push(wrappedToken);
}

async function contractsDeploy(accounts, collateralNames, weightTest) {
  for (const name of collateralNames) {
    await deployCollateralAndWrappedToken(accounts, name);
  }

  let xTokenWeightList = weightTest.map((w) => web3.utils.toWei(new BN(w)));

  // console.log("srcTokenAddress");
  // console.log(srcTokenAddress);
  // console.log("wrapTokenAddress");
  // console.log(wrapTokenAddress);
  // console.log("\n");

  // console.log("weightTest");
  // console.log(weightTest);
  // console.log("\n");
  // console.log("xTokenWeightList");
  // console.log(xTokenWeightList.map((w) => w.toString()));
  // console.log("\n");

  dSGuard = await DSGuard.new();
  usdxToken = await DSToken.new("0x555344780000000000000000000000");
  dfToken = await DSToken.new("0x444600000000000000000000000000");

  dfStore = await DFStore.new(wrapTokenAddress, xTokenWeightList);
  dfCollateral = await DFCollateral.new();
  dTokenController = await DTokenController.new();
  dfPool = await DFPool.new(
    dfCollateral.address,
    dfCollateral.address,
    dTokenController.address
  );
  dfFunds = await DFFunds.new();
  priceFeed = await PriceFeed.new();
  medianizer = await Medianizer.new();

  dfEngine = await DFEngine.new(
    usdxToken.address,
    dfStore.address,
    dfPool.address,
    dfCollateral.address,
    dfFunds.address
  );
  dfSetting = await DFSetting.new(dfStore.address);

  dfProtocol = await DFProtocol.new();
  dfProtocolView = await DFProtocolView.new(
    dfStore.address,
    dfCollateral.address
  );

  for (let index = 0; index < wrapTokenAddress.length; index++) {
    await wrapTokens[index].setAuthority(dfEngine.address);
    await dfPool.approveToEngine(wrapTokenAddress[index], dfEngine.address);
    await dfCollateral.approveToEngine(
      wrapTokenAddress[index],
      dfEngine.address
    );
  }

  //   let srcTokens = await Promise.all(
  //     srcTokenAddress.map((a) => Collaterals.at(a))
  //   );

  await usdxToken.setAuthority(dfEngine.address);
  await dfToken.setAuthority(dfEngine.address);
  await dfStore.setAuthority(dSGuard.address);
  await dfCollateral.setAuthority(dSGuard.address);
  await dfPool.setAuthority(dSGuard.address);
  await dfFunds.setAuthority(dSGuard.address);
  await dfEngine.setAuthority(dSGuard.address);
  await dfSetting.setAuthority(dSGuard.address);

  await dSGuard.permitx(dfEngine.address, dfStore.address);
  await dSGuard.permitx(dfEngine.address, dfCollateral.address);
  await dSGuard.permitx(dfEngine.address, dfPool.address);
  await dSGuard.permitx(dfEngine.address, dfFunds.address);

  await dSGuard.permitx(dfSetting.address, dfStore.address);
  await dSGuard.permitx(dfProtocol.address, dfEngine.address);

  await dfSetting.setCommissionToken(0, dfToken.address);
  await dfSetting.setCommissionMedian(dfToken.address, medianizer.address);
  await dfSetting.setCommissionRate(0, 0);
  await dfSetting.setCommissionRate(1, 50);
  await medianizer.set(priceFeed.address);
  await priceFeed.post(
    web3.utils.toWei(new BN(2)),
    2058870102,
    medianizer.address
  );

  await dfProtocol.requestImplChange(dfEngine.address);
  await dfProtocol.confirmImplChange();

  amount = web3.utils.toWei(new BN(1000000));
  await dfToken.mint(accounts[0], amount);

  amount = web3.utils.toWei(new BN(10000));
  for (account of accounts) {
    await Promise.all(
      srcTokens.map((t) =>
        t.approve(dfPool.address, MAX_UINT256, { from: account })
      )
    );

    await dfToken.transfer(account, amount);

    await dfToken.approve(dfEngine.address, MAX_UINT256, {
      from: account,
    });
    await usdxToken.approve(dfEngine.address, MAX_UINT256, {
      from: account,
    });
  }

  owner = accounts[0];

  await supportDToken.deployDTokens(srcTokens, dTokenController, accounts);

  // Allow dToken to transfer src token from pool
  await Promise.all(
    srcTokens.map((t) => {
      dfPool.approve(t.address);
    })
  );

  // console.log("contract init finish!!!\n");

  return {
    guard: dSGuard,
    usdxToken: usdxToken,
    dfToken: dfToken,
    store: dfStore,
    collateral: dfCollateral,
    protocol: dfProtocol,
    protocolView: dfProtocolView,
    funds: dfFunds,
    poolV2: dfPool,
    engineV2: dfEngine,
    srcTokens,
    wrapTokens,
    dTokenController: dTokenController,
  };
}

module.exports = {
  contractsDeploy,
};
