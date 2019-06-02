var usdxAddr = "0x8f3BFc1c0b1B4078f53a3cfbE1d445020d2A5509";
var dfAddr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

var protocolAddr = "0x9A35766a47B71114AaCa15852B72768d2Ec55Cd0";
var storeAddr = "0x009b885C087788D6e706689e4802D977fB544621";
var poolAddr = "0x226E8EfdF955f33fA4C530A6cD2334A637052973";
var collateralAddr = "0x35D46686Da8Aa7f334079559A4e03be34AcfF5Da";
var fundsAddr = "0xe4aB960e101De5aFB5C3038fF636afdf81fE80f8";
var engineAddr = "0xD8f5ED3FD6606192d0316E23ba75AD193343841a";
var guardAddr = "0x74d6A3845cC287D93eA419dA3D80B3f68C508d1A";
var medianAddr = "0x9CDC48eFd0Ff0e5CB0E049D4Db3ba3a9F16636Af";
var feedAddr = "0x5baEe4954760B703691B3484AA37590f2C589BCF";

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

let th = new BN(Number(0.1 * 10 ** 18).toLocaleString().replace(/,/g, ''));

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
  user actions.
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

function balanceInCollateral() {
  contractPAX.balanceOf.call(
    collateralAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function tryUSDXForDeposit() {
  contractProtocol.getUSDXForDeposit.call(
    usdcAddr,
    50 * 1000000000000000000,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}