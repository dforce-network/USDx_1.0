var usdxAddr = "0x614912e603d3e436a06C8Af114531672C1Ec7417";
var dfAddr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

var protocolAddr = "0x1ADb4438d172a99b473FE203c859A18c2a4BA821";
var storeAddr = "0xA937395881C29c6105c6Bf9a65c0702110125B87";
var poolAddr = "0xA0CCABACd7a0Bf3214C998AE50CfF0897948b071";
var collateralAddr = "0x097406DCe77D405fd1d21C6aeE5cCFAa074c93F1";
var fundsAddr = "0xB5C5110ff5d5Bf5c003c6286B78Bd824e6141889";
var engineAddr = "0xdba9d97Fc74BF9e8F2Dd536177aCca838f8a3654";
var guardAddr = "0x1871C81E269b0998564AEC4A4B0dE5677762172c";
var medianAddr = "0x4496F3664B9fF038fBb5476ed156C6DD6497bdFe";
var feedAddr = "0x35Dae8f90fe3B9a9983dAF1572Cd35221e4E9963";
var msgSender = "0x9df7C98C933A0cB409606A3A24B1660a70283542";

var contractUsdx = web3.eth.contract(usdxABI).at(usdxAddr);
var contractDF = web3.eth.contract(erc20ABI).at(dfAddr);

var contractProtocol = web3.eth.contract(protocolABI).at(protocolAddr);
var contractStore = web3.eth.contract(storeABI).at(storeAddr);
var contractPool = web3.eth.contract(poolABI).at(poolAddr);
var contractCollateral = web3.eth.contract(collateralABI).at(collateralAddr);
var contractFunds = web3.eth.contract(fundsABI).at(fundsAddr);
var contractEngine = web3.eth.contract(engineABI).at(engineAddr);
var contractGuard = web3.eth.contract(guardABI).at(guardAddr);
var contractMedian = web3.eth.contract(medianABI).at(medianAddr);
var contractFeed = web3.eth.contract(feedABI).at(feedAddr);

var daiAddr = "0xf494e07dfdbce883bf699cedf818fde2fa432db4";
var paxAddr = "0x561b11000e95ac053eccec5bcefdc37e16c2491b";
var tusdAddr = "0x25470030aa105bca679752e5c5e482c295de2b68";
var usdcAddr = "0xbc34e50f589e389c507e0213501114bd2e70b1d7";

var contractDAI = web3.eth.contract(erc20ABI).at(daiAddr);
var contractPAX = web3.eth.contract(erc20ABI).at(paxAddr);
var contractTUSD = web3.eth.contract(erc20ABI).at(tusdAddr);
var contractUSDC = web3.eth.contract(erc20ABI).at(usdcAddr);

function setStoreAuth2Guard() {
  contractStore.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setPoolAuth2Guard() {
  contractPool.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setCollateralAuth2Guard() {
  contractCollateral.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setFundsAuth2Guard() {
  contractFunds.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setEngineAuth2Guard() {
  contractEngine.setAuthority.sendTransaction(
    guardAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitStorebyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, storeAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitPoolbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, poolAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitCollateralbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, collateralAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitFundsbyGuard() {
  contractGuard.permitx.sendTransaction(
    engineAddr, fundsAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function permitEnginebyGuard() {
  contractGuard.permitx.sendTransaction(
    protocolAddr, engineAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  let protocol know the instance of engine.
*/
function engineProtocolReq() {
  contractProtocol.requestImplChange.sendTransaction(
    engineAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function engineProtocolConfirm() {
  contractProtocol.confirmImplChange.sendTransaction({
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  let usdx know who can call mint/burn.
*/
function usdxSetAuth() {
  contractUsdx.setAuthority.sendTransaction(
    engineAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  set Auth carefully, only Owner can do this job.
*/
let daiW = new BN(Number(0.1 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let paxW = new BN(Number(0.3 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let tusdW = new BN(Number(0.3 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let usdcW = new BN(Number(0.3 * 10 ** 18).toLocaleString().replace(/,/g, ''));

function updateMintSection() {
  contractEngine.updateMintSection.sendTransaction(
    [
      "0xf494e07dfdbce883bf699cedf818fde2fa432db4",
      "0x561b11000e95ac053eccec5bcefdc37e16c2491b",
      "0x25470030aa105bca679752e5c5e482c295de2b68",
      "0xbc34e50f589e389c507e0213501114bd2e70b1d7"
    ],
    [daiW, paxW, tusdW, usdcW], {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setDestroyFeeRate() {
  contractEngine.setCommissionRate.sendTransaction(
    1, 20, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setDestroyFeeToken() {
  contractEngine.setCommissionToken.sendTransaction(
    0, dfAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

let th = new BN(Number(0.001 * 10 ** 18).toLocaleString().replace(/,/g, ''));

function setDestroyThreshold() {
  contractEngine.setDestroyThreshold.sendTransaction(
    th, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setDFTokenMedianizer() {
  contractEngine.setCommissionMedian.sendTransaction(
    dfAddr, medianAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function setMedianizerPriceFeed() {
  contractMedian.set.sendTransaction(
    feedAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

let p = new BN(Number(5 * 10 ** 18).toLocaleString().replace(/,/g, ''));

function setPricebyFeed() {
  contractFeed.post.sendTransaction(
    p, 2058870102, medianAddr, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

/*
  @USER actions.
*/
function usdxBurnApprove() {
  contractUsdx.approvex.sendTransaction(engineAddr, {
    gas: 1000000
  }, function (
    err,
    ret
  ) {
    console.log(ret, err);
  });
}

function dfApprove() {
  contractDF.approve.sendTransaction(
    engineAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (
      err,
      ret
    ) {
      console.log(ret, err);
    });
}

function tryMintingSection() {
  contractProtocol.getMintingSection.call(
    function (err, ret) {
      console.log(ret[1][0].toFixed(), err);
      console.log(ret[1][1].toFixed(), err);
    }
  );
}

function tryBurningSection() {
  contractProtocol.getBurningSection.call(
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockDAI() {
  contractDAI.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockPAX() {
  contractPAX.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockTUSD() {
  contractTUSD.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function unlockUSDC() {
  contractUSDC.approve.sendTransaction(
    poolAddr,
    1000000000 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositDAI() {
  contractProtocol.deposit.sendTransaction(
    daiAddr,
    0,
    100 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositPAX() {
  contractProtocol.deposit.sendTransaction(
    paxAddr,
    0,
    200 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositTUSD() {
  contractProtocol.deposit.sendTransaction(
    tusdAddr,
    0,
    300 * 1000000000000000000, {
      gas: 1000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function depositUSDC() {
  contractProtocol.deposit.sendTransaction(
    usdcAddr,
    0,
    500 * 1000000000000000000, {
      gas: 5000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function tryUSDXForDeposit() {
  contractProtocol.getUSDXForDeposit.call(
    usdcAddr,
    500 * 1000000000000000000,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function MintinOneKey() {
  contractProtocol.oneClickMinting.sendTransaction(
    0,
    200 * 1000000000000000000, {
      gas: 5000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function claimUSDX() {
  contractProtocol.claim.sendTransaction(
    0, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function tryUserClaimMaxUSDX() {
  contractProtocol.getUserMaxToClaim.call(
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function tryColMaxClaimUSDX() {
  contractProtocol.getColMaxClaim.call(
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function tryUserWithdrawBalance() {
  contractProtocol.getUserWithdrawBalance.call(
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function tryDFPrice() {
  contractProtocol.getPrice.call(
    0,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function tryDFFeeRate() {
  contractProtocol.getFeeRate.call(
    1,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function tryDestroyThresHold() {
  contractProtocol.getDestroyThreshold.call(
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function withdrawDAI() {
  contractProtocol.withdraw.sendTransaction(
    daiAddr,
    0,
    10 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawPAX() {
  contractProtocol.withdraw.sendTransaction(
    paxAddr,
    0,
    30 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawTUSD() {
  contractProtocol.withdraw.sendTransaction(
    tusdAddr,
    0,
    30 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function withdrawUSDC() {
  contractProtocol.withdraw.sendTransaction(
    usdcAddr,
    0,
    30 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function destroy() {
  contractProtocol.destroy.sendTransaction(
    0,
    100 * 1000000000000000000, {
      gas: 2000000
    },
    function (err, ret) {
      console.log(ret, err);
    }
  );
}

function miscFunction() {
  contractStore.getDepositorBalance.call(
    msgSender, usdcAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );

  contractStore.getTokenBalance.call(
    usdcAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );

  contractEngine.getWithdrawBalances.call(
    msgSender,
    function (err, ret) {
      console.log(ret[1][0].toFixed(), err);
      console.log(ret[1][3].toFixed(), err);
    }
  );
}