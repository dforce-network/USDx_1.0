var usdxAddr = "0x3f999E82746Dfe08429fe338E758846faEd3e8e5";
var dfAddr = "0x4AF82b7C2F049574C9fc742A896DAbEA379b7d51";

var protocolAddr = "0x61F217204e51c9cb0A3B53f91c613d861e6f7c73";
var storeAddr = "0xB2d0bB042E4F84DE393D34C00Aea7D146D6CBe4C";
var poolAddr = "0x23083Ed7a998dEAD08e26fdF6da369d27B121528";
var collateralAddr = "0x4fBddab2840FdBC516fED97c116323B2c41999D4";
var fundsAddr = "0x892072cAD90E0451BC4f459F6b26FBd3E7701d59";
var engineAddr = "0xf46c19780e49678224ff15C574eF563fEeAA3498";
var guardAddr = "0x9e20202B010b0960D45b693Cf6265C47a148c0F2";
var medianAddr = "0xdADbD64f7df40989D7d3CBeE0bCE264EbCD7699f";
var feedAddr = "0x1606b4Ab7235480B41623dA10B6E78cf70d0E99E";
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

function tryUSDXForDeposit() {
  contractProtocol.getUSDXForDeposit.call(
    usdcAddr,
    500 * 1000000000000000000,
    function (err, ret) {
      console.log(ret.toFixed(), err);
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