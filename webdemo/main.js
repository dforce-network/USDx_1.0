var usdxAddr = "0x29d1980bDe9A71eBd47FE7cdef14640DC731BAA5";
var dfAddr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

var protocolAddr = "0x555bd8A39524635C725b62b28602cF52184C8CAE";
var storeAddr = "0x1E3b33c17C93a7B541186413239Fac77A475b91C";
var poolAddr = "0xA90B0e780f9eCb78D9bc4fE951E4A7A698b90b24";
var collateralAddr = "0x049b6B20826366897965592cabc24C35cDB69fe5";
var fundsAddr = "0xB251Cd6DA1C6EE08Eca7ea3A691C52A979B7971C";
var engineAddr = "0xC7135d5F772FD9fD1e1780A401552fA15ee52E60";
var guardAddr = "0x3BaA62c9030538A90532866b66A25f5850af626e";
var medianAddr = "0xE3B9682Ec26b233A1b88Eb2B69C735b551188020";
var feedAddr = "0x91eeD11839BaED085DB95cA66aC1e6b492d5055D";

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
let daiW = new BN(Number(1 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let paxW = new BN(Number(3 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let tusdW = new BN(Number(3 * 10 ** 18).toLocaleString().replace(/,/g, ''));
let usdcW = new BN(Number(3 * 10 ** 18).toLocaleString().replace(/,/g, ''));

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
      console.log(ret.toFixed(), err);
    }
  );
}

function tryBurningSection() {
  contractProtocol.getBurningSection.call(
    function (err, ret) {
      console.log(ret.toFixed(), err);
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
      console.log(ret, err);
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
      console.log(ret, err);
    }
  );
}

function tryDFFeeRate() {
  contractProtocol.getFeeRateByID.call(
    1,
    function (err, ret) {
      console.log(ret, err);
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

function getLockedUSDX2DAI() {
  contractStore.getResUSDXBalance.call(
    daiAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function getLockedUSDX2PAX() {
  contractStore.getResUSDXBalance.call(
    paxAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function getLockedUSDX2TUSD() {
  contractStore.getResUSDXBalance.call(
    tusdAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}

function getLockedUSDX2USDC() {
  contractStore.getResUSDXBalance.call(
    usdcAddr,
    function (err, ret) {
      console.log(ret.toFixed(), err);
    }
  );
}